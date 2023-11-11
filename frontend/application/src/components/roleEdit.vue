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

                <h3 v-if="isNew || isSystem">{{ $t('ims.general') }}</h3>

                <!-- Name -->
                <div v-if="isNew" class="text-field mb-3">
                    <label for="roleName" class="form-label">{{ $t('role.newRoleName') }}:</label>
                    <input type="text" class="form-control" id="roleName" v-model="roleName" :maxlength=50 required/>
                    <div class="invalid-feedback">
                        {{ $t(roleName.length > 0 ? 'role.invalidRoleName' : 'role.missingRoleName') }}
                    </div>
                </div>

                <!-- Recommendation -->
                <textbox-with-preview v-if="isSystem" class="mt-1" :label="$t('role.recommendLabel')"
                                      :text="recommendationEditor" :rows="5" :max-length=4096 required/>

                <div v-if="isSystem" class="input-group mb-3 flex-nowrap gap-2">
                    <!-- Category -->
                    <div class="input-group flex-column flex-nowrap category">
                        <label for="category" class="form-label">{{ $t('role.category') }}:</label>
                        <div class="input-group">
                            <input type="text" readonly class="form-control" id="category" :value="roleCategory">
                            <button type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                    class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split text-nowrap">
                                <span class="visually-hidden">Toggle</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#" @click="changeCategory(Category.IMS, $event)">
                                    {{ $t('role.imsRole') }}
                                </a></li>
                                <li><a class="dropdown-item" href="#" @click="changeCategory(Category.PROCESS, $event)">
                                    {{ $t('role.processRole') }}
                                </a></li>
                                <li><a class="dropdown-item" href="#" @click="changeCategory(Category.SERVICE, $event)">
                                    {{ $t('role.serviceRole') }}
                                </a></li>
                            </ul>
                        </div>
                    </div>
                    <!-- Handover -->
                    <div class="input-group flex-column flex-nowrap handover">
                        <label for="handover" class="form-label">{{ $t('role.handoverLabel') }}:</label>
                        <div class="input-group">
                            <input type="text" readonly class="form-control" id="handover" :value="roleHandover">
                            <button type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                    class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split text-nowrap">
                                <span class="visually-hidden">Toggle</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#" @click="changeHandover(true, $event)">
                                    {{ $t('ims.yes') }}
                                </a></li>
                                <li><a class="dropdown-item" href="#" @click="changeHandover(false, $event)">
                                    {{ $t('ims.no') }}
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Inherited Tasks -->
                <h3 v-if="!isSystem">{{ $t('role.inheritedTasks') }}</h3>

                <div v-if="!isSystem" class="input-group flex-column flex-nowrap mb-3">
                    <label for="inheritFrom" class="form-label">{{ $t('role.inheritFrom') }}:</label>
                    <div class="input-group inherit-from">
                        <input type="text" readonly class="form-control" id="inheritFrom"
                               :value="roleInfo.globalRoleName ? roleInfo.globalRoleName : $t('role.noInherit')">
                        <button type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split text-nowrap">
                            <span class="visually-hidden">Toggle</span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" id="no-inherit"
                                   @click="inheritGlobalRole($event)">
                                {{ $t('role.noInherit') }}
                            </a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li v-for="[roleCode, roleInfo] in globalRoles">
                                <a class="dropdown-item" href="#" :id="roleCode"
                                   @click="inheritGlobalRole($event)">
                                    {{ roleInfo.name }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <vue3-markdown-it v-if="roleInfo.globalRoleTasks" :source="roleInfo.globalRoleTasks" />

                <!-- Tasks -->
                <h3>{{ $t('role.tasks') }}</h3>

                <textbox-with-preview class="mt-1" :label="$t('role.tasksLabel')" :text="tasksEditor"
                                      :rows="10" :max-length=4096 :required="!roleInfo.globalRole"/>
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
import { isValid, isSuccess, strEqual, deepClone } from "@/utils";
import { getRoles } from "@/api/getRoles";
import { updateRole } from "@/api/updateRole";
import { addRole } from "@/api/addRole";
import RoleHeader from "@/components/roleHeader.vue";
import TextboxWithPreview from "@/components/textboxPreview.vue";
import Message from "@/components/message.vue";
import MarkdownIt from "markdown-it";
import {Category} from "@/roles";

var mdRender = new MarkdownIt();

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
            bidirectional: reactive({ roleChanged: false }),
            roleInfo: null,         // Role
            existingRoles: [],      // Strings
            globalRoles: new Map(), // Map<String, { name: String, tasks: String, handover: Boolean }>
            recommendationEditor: reactive({
                text: isValid(this.edited?.recommendation) ? this.edited?.recommendation : ""
            }),
            tasksEditor: reactive({
                text: isValid(this.edited) ? this.edited.tasks : ""
            }),
            forceCancel: false,
        }
    },
    computed: {
        Category() {
            return Category
        },
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
                if(this.isSystem)
                    this.recommendationEditor.text = this.roleInfo.recommendation;
            }

            return this.roleInfo;
        },
        isNew() { return 'new' === this.$route.params.role; },
        isSystem() { return 'IMS' === this.$props.processCode; },
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
        roleCategory() {
            if(isValid(this.roleInfo)) {
                switch(this.roleInfo.category) {
                    case Category.IMS: return this.$t('role.imsRole');
                    case Category.PROCESS: return this.$t('role.processRole');
                    case Category.SERVICE: return this.$t('role.serviceRole');
                }
            }
            return "?";
        },
        roleHandover() {
            return isValid(this.roleInfo) ?
                   this.$t(this.roleInfo.handover ? 'role.handoverMust' : 'role.handoverNope') : "?";
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
               !strEqual(pc.globalRole, pe.globalRole) ||
               !strEqual(pc.category, pe.category) ||
                pc.handover !== pe.handover ||
                pc.status !== pe.status)
                return true;

            if(this.isSystem && !strEqual(pc.recommendation, this.recommendationEditor.text))
                return true;

            return false;
        },
        imsApi() { return process.env.VUE_APP_IMS_IMS_API; },
        returnToRoute() {
            if(this.isNew)
                return this.$props.pageBaseUrl;

            return `${this.$props.pageBaseUrl}/${this.roleCode}`;
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
        changeCategory(category, event) {
            event.preventDefault();
            this.edited.category = category;
            this.edited.assignable = (category === Category.IMS);
        },
        changeHandover(handover, event) {
            event.preventDefault();
            this.edited.handover = handover;
        },
        inheritGlobalRole(event) {
            event.preventDefault();

            let el = event.target;
            const globalRoleCode = el.getAttribute("id");
            if("no-inherit" === globalRoleCode) {
                this.edited.globalRole = null;
                this.edited.globalRoleName = null;
                this.edited.globalRoleTasks = null;
                this.edited.handover = false;
                return;
            }

            const globalRole = this.globalRoles.get(globalRoleCode);
            if(isValid(globalRole)) {
                this.edited.globalRole = globalRoleCode;
                this.edited.globalRoleName = globalRole.name;
                this.edited.globalRoleTasks = globalRole.tasks;
                this.edited.handover = globalRole.handover;
            }
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
                    if(this.isSystem)
                        this.roleInfo.recommendation = this.recommendationEditor.text;
                    else if(isValid(this.roleInfo.globalRole)) {
                        // Update the global role name and tasks
                        const globalRole = this.globalRoles.get(this.roleInfo.globalRole);
                        this.roleInfo.globalRoleName = globalRole.name;
                        this.roleInfo.globalRoleTasks = globalRole.tasks;
                    }

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
                            if(isSuccess(t, arResult)) {
                                // Success
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
                                    if(isSuccess(t, prResult)) {
                                        // Success
                                        storeProcessRoles(prResult);
                                        t.forceCancel = true;
                                        t.$router.push(`${t.$props.pageBaseUrl}/${t.roleCode}`);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        // Call API to update the role
                        const urResult = updateRole(this.accessToken, processCode, this.roleInfo,
                                                    this.$props.apiBaseUrl);
                        urResult.update().then(() => {
                            if(isSuccess(t, urResult)) {
                                // Success
                                console.log(`Created new version of role ${processCode}.${t.$route.params.role}`);
                                t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                                 t.$t('ims.newEntityVersion', {
                                                                     processCode: `${processCode} `,
                                                                     entity: t.$t('ims.role').toLowerCase(),
                                                                     name: " " + t.roleName
                                                                 }));

                                // Fetch the role details from the API to include the added version
                                const prResult = getRoles(t.accessToken, processCode, t.$route.params.role,
                                                          t.$props.apiBaseUrl);
                                prResult.load().then(() => {
                                    if(isSuccess(t, prResult)) {
                                        // Success
                                        storeProcessRoles(prResult);
                                        t.forceCancel = true;
                                        t.$router.push(t.returnToRoute);
                                    }
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
        let t = this;
        if(this.isNew) {
            // Fetch the process roles from the API
            const prrResult = getRoles(this.accessToken, this.$props.processCode, null, this.$props.apiBaseUrl);
            prrResult.load().then(() => {
                if(isSuccess(t, prrResult))
                    // Success
                    t.existingRoles = Array.from(extractProcessRoles(prrResult).keys());
            });
        }

        if(!this.isSystem) {
            // Fetch the global roles from the API
            const grrResult = getRoles(this.accessToken, 'IMS', null, this.imsApi);
            grrResult.load().then(() => {
                if(isSuccess(t, grrResult)) {
                    // Success
                    // Keep just the inheritable global roles
                    let inheritable = Array.from(extractProcessRoles(grrResult).values())
                                           .filter(role => !role.assignable);
                    for(const role of inheritable)
                        t.globalRoles.set(role.role, { name: role.name, tasks: role.tasks, handover: role.handover });
                }
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
.inherit-from
{
    max-width: 30rem;
}
.category
{
    max-width: 20rem;
}
.dropdown-menu {
    background-color: var(--menu-background-color);
    font-size: calc(var(--font-scale) * var(--bs-dropdown-font-size));
}
.dropdown-menu > li:hover,
.dropdown-menu > li:focus,
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
    background-color: var(--menu-item-color);
}
</style>
