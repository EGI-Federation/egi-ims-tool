<template>
<div class="content">
    <div>
        <form class="needs-validation" novalidate ref="roleForm">
        <div class="role">
            <role-header ref="roleHeader" :edit-mode="true" :info="info" :bidirectional="bidirectional"
                            :process-code="processCode" @save="saveChanges($event)" @cancel="cancelChanges"/>
            <div class="details">
                <!-- Commit message -->
                <div class="text-field mb-3">
                    <label for="changeDesc" class="form-label">{{ $t('ims.changeDesc') }}:</label>
                    <textarea ref="textarea" class="form-control textarea" id="changeDesc" rows=3
                              v-model="changeDescription" :maxlength=1024 required/>
                    <div class="invalid-feedback">
                        {{ $t('ims.invalidEntityChange', { entity: $t('ims.role').toLowerCase() }) }}
                    </div>
                </div>

                <!-- Tasks -->
                <h3 v-if="isNew">{{ $t('ims.general') }}</h3>

                <!-- Name -->
                <div v-if="isNew" class="text-field mb-3">
                    <label for="roleName" class="form-label">{{ $t('role.newRoleName') }}:</label>
                    <input type="text" class="form-control" id="roleName" v-model="roleName" :maxlength=50 required/>
                    <div class="invalid-feedback">
                        {{ $t(roleName.length > 0 ? 'role.invalidRoleName' : 'role.missingRoleName') }}
                    </div>
                </div>

                <!-- Tasks -->
                <h3>{{ $t('role.tasks') }}</h3>
                <textbox-with-preview class="mt-1" :label="$t('role.tasksLabel')" :text="tasksEditor"
                                      :rows="5" :max-length=4096 required/>
            </div>
        </div>
        </form>
    </div>
    <message id="warnEditRole" ref="warnEditRole"
             :title="$t('ims.unsavedChanges')" :message="$t('ims.warnEditing')"
             :confirm-button="$t('ims.continue')" @confirm="abandonChanges" />
</div>
</template>

<script>
// @ is an alias to /src
import i18n from "@/locales";
import { reactive } from 'vue';
import { store, extractProcessRoles, storeProcessRoles } from "@/store";
import { isValid, strEqual, deepClone } from '@/utils'
import { findUserWithEmail } from "@/roles";
import { getRoles } from "@/api/getRoles";
import { updateRole } from "@/api/updateRole";
import { addRole } from "@/api/addRole";
import RoleHeader from "@/components/roleHeader.vue"
import TextboxWithPreview from "@/components/textboxPreview.vue"
import Message from "@/components/message.vue"

export default {
    name: 'roleEdit',
    components: { RoleHeader, TextboxWithPreview, Message },
    props: {
        processCode: String,
        pageBaseUrl: String,
        apiBaseUrl: String,
        info: Object,   // { current: Role, implemented: Role }
        state: {        // Reactive { hasUnsavedChanges: Boolean, navigateTo: String }
            type: Object,
            default: () => {}
        }
    },
    expose: [ 'warnUnsavedChanges' ],
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            myName: store.state.oidc?.user?.name,
            myEmail: store.state.oidc?.user?.email,
            bidirectional: reactive({ roleChanged: false }),
            roleInfo: null,     // Role
            existingRoles: [],  // Strings
            tasksEditor: reactive({ text: isValid(this.edited) ? this.edited.tasks : "" }),
            forceCancel: false,
        }
    },
    computed: {
        i18n() { return i18n },
        baseUrl() {
            return isValid(this.$props.pageBaseUrl) ?
                this.$props.pageBaseUrl :
                `/${this.$props.processCode.toLowerCase()}/roles`;
        },
        current() { return this.$props.info.current; },
        implemented() { return this.$props.info.implemented; },
        edited() {
            if(!isValid(this.roleInfo) && isValid(this.current)) {
                this.roleInfo = deepClone(this.current);
                this.roleInfo.changeDescription = "";
                this.roleInfo.changeBy = null;
                delete this.roleInfo['id'];
                delete this.roleInfo['changedOn'];
                delete this.roleInfo['history'];
                delete this.roleInfo['apiVersion'];

                this.tasksEditor.text = this.roleInfo.tasks;
            }

            return this.roleInfo;
        },
        isNew() { return 'new' === this.$route.params.role; },
        roleCode() {
            if(!isValid(this.edited) && !this.isNew)
                return this.$route.params.role;

            return ('symbol' === typeof this.edited.role) ? this.edited.role.description : this.edited.role;
        },
        roleName: {
            get() { return isValid(this.edited) ? this.edited.name : ""; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.name = value;
            },
        },
        roleValueFromName() {
            return this.roleInfo?.name.trim().toLowerCase().replace(/\s/g, "-");
        },
        changeDescription: {
            get() { return isValid(this.edited) ? this.edited.changeDescription : ""; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.changeDescription = value;
            },
        },
        roleChanged() {
            if(!isValid(this.current) || !isValid(this.edited))
                return false;

            const pc = this.current;
            const pe = this.edited;

            if(!strEqual(pc.tasks, this.tasksEditor.text) ||
               !strEqual(pc.name, pe.name) ||
               !strEqual(pc.roleCode, pe.roleCode) ||
                pc.status !== pe.status)
                return true;

            return false;
        },
        users() {
            const users = store.state.temp.usersByProcess?.get(this.$props.processCode);
            return isValid(users) ? users : new Map();
        },
        returnToRoute() {
            if(this.isNew)
                return this.baseUrl;

            return `${this.baseUrl}/${this.$route.params.role}`;
        },
    },
    watch: {
        roleChanged(changed) {
            this.bidirectional.roleChanged = changed;
            this.$props.state.hasUnsavedChanges = changed && !this.forceCancel;
        },
        forceCancel() {
            this.$props.state.hasUnsavedChanges = false;
        }
    },
    methods: {
        setupValidation(scope) {
            const forms = document.querySelectorAll(`${isValid(scope) ? scope : ''}.needs-validation`)
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if(!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    form.classList.add('was-validated');
                }, false);
            })
        },
        saveChanges(event) {
            const formIsValid = this.$refs.roleForm.checkValidity();
            if(this.isNew) {
                let roleNameField = document.querySelector("#roleName");
                if(isValid(roleNameField)) {
                    roleNameField.setCustomValidity('');
                    this.roleInfo.role = this.roleValueFromName;
                    for(let role of this.existingRoles) {
                        if('symbol' === typeof role)
                            role = role.description;
                        if(role === this.roleInfo.role) {
                            // There is already a role with this code
                            roleNameField.setCustomValidity('role-name-not-unique');
                            break;
                        }
                    }
                }
            }

            if(formIsValid) {
                if(!this.roleChanged)
                    this.cancelChanges();
                else {
                    // We have changes that must be saved
                    console.log(`Saving ${this.$props.processCode}.${this.roleCode} role changes`);

                    this.roleInfo.tasks = this.tasksEditor.text;
                    if(isValid(this.roleInfo.changeBy)) {
                        delete this.roleInfo.changeBy['kind'];
                        delete this.roleInfo.changeBy['given_name'];
                        delete this.roleInfo.changeBy['family_name'];
                        delete this.roleInfo.changeBy['email_verified'];
                    }

                    let t = this;
                    const processCode = this.$props.processCode;
                    if(this.isNew) {
                        // Call API to add a new role
                        const arResult = addRole(this.accessToken, processCode, this.roleInfo,
                                                 this.$props.apiBaseUrl);
                        arResult.add().then(() => {
                            if(isValid(arResult.error?.value)) {
                                let message = isValid(arResult.error.value.data?.description) ?
                                    arResult.error.value.data.description :
                                    arResult.error.value.message;
                                t.$root.$refs.toasts.showError(t.$t('ims.error'), message);
                            }
                            else {
                                console.log(`Added new role ${processCode}.${t.roleCode}`);
                                t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                    t.$t('ims.newEntity', {
                                        processCode: processCode,
                                        entity: t.$t('ims.role').toLowerCase(),
                                        name: " " + t.roleName
                                    }));

                                // Fetch the role details from the API to include the added version
                                const prResult = getRoles(t.accessToken, processCode, t.roleCode,
                                                          t.$props.apiBaseUrl);
                                prResult.load().then(() => {
                                    storeProcessRoles(prResult);
                                    t.forceCancel = true;
                                    t.$router.push(`/${processCode.toLowerCase()}/roles/${t.roleCode}`);
                                });
                            }
                        });
                    }
                    else {
                        // Call API to update the role
                        const urResult = updateRole(this.accessToken, processCode, this.roleInfo,
                                                    this.$props.apiBaseUrl);
                        urResult.update().then(() => {
                            if(isValid(urResult.error?.value)) {
                                let message = isValid(urResult.error.value.data?.description) ?
                                    urResult.error.value.data.description :
                                    urResult.error.value.message;
                                t.$root.$refs.toasts.showError(t.$t('ims.error'), message);
                            }
                            else {
                                console.log(`Created new version of role ${processCode}.${t.$route.params.role}`);
                                t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                                 t.$t('ims.newEntityVersion', {
                                                                     processCode: processCode,
                                                                     entity: t.$t('ims.role').toLowerCase(),
                                                                     name: " " + t.roleName
                                                                 }));

                                // Fetch the role details from the API to include the added version
                                const prResult = getRoles(t.accessToken, processCode, t.$route.params.role,
                                                          t.$props.apiBaseUrl);
                                prResult.load().then(() => {
                                    storeProcessRoles(prResult);
                                    t.forceCancel = true;
                                    t.$router.push(t.returnToRoute);
                                });
                            }
                        });
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            }
        },
        cancelChanges() {
            this.$router.push(this.returnToRoute);
        },
        warnUnsavedChanges() {
            this.$refs.warnEditRole.showModal();
        },
        abandonChanges() {
            this.forceCancel = true;
            this.$router.push(isValid(this.$props.state.navigateTo) ?
                              this.$props.state.navigateTo :
                              this.returnToRoute);
        },
    },
    created() {
        if(this.isNew) {
            // Fetch the process roles from the API
            let t = this;
            const rrResult = getRoles(this.accessToken, this.$props.processCode, null, this.$props.apiBaseUrl);
            rrResult.load().then(() => {
                t.existingRoles = Array.from(extractProcessRoles(rrResult).keys());
            });
        }
    },
    mounted() {
        this.setupValidation();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
    position: relative;
    gap: .5rem;
    width: 100%;
    min-height: unset;
}

@media screen and (min-width: 765px) {
    .content {
        min-height: calc(100vh - var(--navbar-height) - var(--breadcrumb-height));
    }
}

.content > div {
    width: 100%;
    max-width: var(--max-content-width);
    margin: 0 auto 2rem;
}
.role {
    margin: 0 auto;
    position: relative;
}
.details {
    text-align: left;
    padding-left: 1rem;
    padding-right: 1rem;
}
.details h3 {
    border-bottom: 1px solid #e9ecef;
}
.details .text-field {
    width: 100%;
}
.details .form-label {
    margin-bottom: 0!important;
}
.details label.form-check-label {
    position: relative;
    top: 2px;
}
.check-item .form-check-input,
.check-item .form-check-label {
    cursor: pointer;
}
</style>
