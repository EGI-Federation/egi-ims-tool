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
import {store, storeProcessInfo, storeProcessRoles} from "@/store";
import { isValid, strEqual, deepClone } from '@/utils'
import { findUserWithEmail } from "@/roles";
import { updateRole } from "@/api/updateRole";
import RoleHeader from "@/components/roleHeader.vue"
import TextboxWithPreview from "@/components/textboxPreview.vue"
import Message from "@/components/message.vue"
import {getRoles} from "@/api/getRoles";

export default {
    name: 'roleEdit',
    components: { RoleHeader, TextboxWithPreview, Message },
    props: {
        processCode: String,
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
            roleInfo: null, // Role
            tasksEditor: reactive({ text: isValid(this.edited) ? this.edited.tasks : "" }),
            forceCancel: false,
        }
    },
    computed: {
        i18n() { return i18n },
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
                pc.status !== pe.status)
                return true;

            return false;
        },
        users() {
            const users = store.state.temp.usersByProcess?.get(this.$props.processCode);
            return isValid(users) ? users : new Map();
        },
        returnToRoute() {
            return `/${this.$props.processCode.toLowerCase()}/roles/${this.$route.params.role}`;
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
            if(this.$refs.roleForm.checkValidity()) {
                if(!this.roleChanged)
                    this.cancelChanges();
                else {
                    // We have changes to the process that must be saved as another version
                    console.log(`Saving ${this.$props.processCode}.${this.$route.params.role} role changes`);

                    this.roleInfo.tasks = this.tasksEditor.text;
                    this.roleInfo.changeBy = findUserWithEmail(this.$props.processCode, this.myEmail);
                    if(isValid(this.roleInfo.changeBy)) {
                        delete this.roleInfo.changeBy['kind'];
                        delete this.roleInfo.changeBy['given_name'];
                        delete this.roleInfo.changeBy['family_name'];
                        delete this.roleInfo.changeBy['email_verified'];
                    }

                    // Call API to update the role
                    let t = this;
                    const piResult = updateRole(this.accessToken, this.$props.processCode, this.roleInfo,
                                                this.$props.apiBaseUrl);
                    piResult.update().then(() => {
                        if(isValid(piResult.error?.value))
                            t.$root.$refs.toasts.showError(t.$t('ims.error'), piResult.error.value);
                        else {
                            console.log(`Created new version of role ${t.$props.processCode}.${t.$route.params.role}`);
                            t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                             t.$t('ims.newEntityVersion',
                                                                 { entity: t.$t('ims.role').toLowerCase() }));

                            // Fetch the role details from the API to include the added version
                            const prResult = getRoles(t.accessToken, 'SLM', t.$route.params.role,
                                                      t.$props.apiBaseUrl);
                            prResult.load().then(() => {
                                storeProcessRoles(prResult);
                                t.forceCancel = true;
                                t.$router.push(t.returnToRoute);
                            });
                        }
                    });
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
        let isValidRole = true;
        if(!isValidRole)
            this.$router.push(this.returnToRoute);
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
}

@media screen and (min-width: 765px) {
    .content {
        min-height: calc(100vh - var(--navbar-height) - var(--breadcrumb-height) - var(--footer-horizontal-height));
    }
}

.content > div {
    width: 100%;
    max-width: 60rem;
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
