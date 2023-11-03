<template>
<div class="content">
    <div>
        <form class="needs-validation" novalidate ref="governanceForm">
        <div class="governance">
            <governance-header ref="governanceHeader" :edit-mode="true" :info="info" :bidirectional="bidirectional"
                               @save="saveChanges($event)" @cancel="cancelChanges"/>
            <div class="details">
                <!-- Commit message -->
                <div class="text-field mb-3">
                    <label for="changeDesc" class="form-label">{{ $t('ims.changeDesc') }}:</label>
                    <textarea ref="textarea" class="form-control textarea" id="changeDesc" rows=3
                              v-model="changeDescription" :maxlength=1024 required/>
                    <div class="invalid-feedback">{{ $t('ims.invalidEntityChange',
                                                        { entity: $t('ims.process').toLowerCase() }) }}</div>
                </div>

                <h3>{{ $t('ims.general') }}</h3>

                <div class="input-group mb-3 flex-nowrap gap-2">
                    <!-- Title -->
                    <div class="input-group">
                        <div class="text-field">
                            <label for="governanceTitle" class="form-label">{{ $t('gov.title') }}:</label>
                            <input type="text" class="form-control" id="governanceTitle" v-model="governanceTitle"
                                   maxlength="255" required>
                        </div>
                    </div>
                </div>
                <!-- Description -->
                <h3>{{ $t('ims.description') }}</h3>
                <textbox-with-preview class="mt-1" :label="$t('gov.goalsLabel')" :text="descriptionEditor"
                                      :rows="10" :max-length=1048576 required/>
                <!-- Annexes -->
                <h3 id="annexes-title">{{ $t('gov.annexes') }}</h3>
                <div class="groups">
                    <!-- Group summary -->
                    <h5 v-if="hasGroups">1. {{ $t('gov.summaryToR') }}</h5>
                    <table-control v-if="hasGroups" id="governance-annex-tors" ref="groups"
                                   :can-edit="true" :can-remove="true" :action-column="$t('ims.action')"
                                   :header="groupsHeader" :data="groupsData"
                                   @edit="editGroup" @remove="removeGroup"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                    <div class="d-flex flex-nowrap justify-content-end">
                        <button v-if="!addingGroup && !editingGroup" type="button"
                                class="btn btn-primary text-nowrap" @click="addGroup">
                            {{ $t('gov.addGroup') }}
                        </button>
                    </div>
                    <!-- Group edit start -->
                    <form v-if="addingGroup || editingGroup" class="needs-validation" novalidate ref="groupForm">
                        <h5 id="group-title">
                            {{ $t(addingGroup ? 'gov.newGroup' : 'gov.editGroup') }}
                        </h5>
                        <div class="pt-2 mb-2 fade-top-border"/>
                        <!-- Body -->
                        <textbox-with-preview class="mt-1" :label="$t('gov.provideBody')"
                                              :text="groupBodyEditor" :rows="3" :max-length=10240 required/>
                        <!-- Composition -->
                        <textbox-with-preview class="mt-1" :label="$t('gov.provideComposition')"
                                              :text="groupCompositionEditor" :rows="3" :max-length=10240 required/>
                        <!-- Meeting -->
                        <textbox-with-preview class="mt-1" :label="$t('gov.provideMeeting')"
                                              :text="groupMeetingEditor" :rows="3" :max-length=10240 required/>
                        <!-- Decision and Voting -->
                        <textbox-with-preview class="mt-1" :label="$t('gov.provideDecisionVoting')"
                                              :text="groupDecisionEditor" :rows="3" :max-length=10240 required/>
                        <label v-if="hasInterfaces" for="group-interfaces" class="form-label">
                            {{ $t('gov.interfacesLabel') }}:
                        </label>
                        <div class="interfaces input-group mb-3 gap-2" id="group-interfaces">
                            <!-- Interfaces with -->
                            <div class="d-flex flex-nowrap gap-2 interfaces-with"
                                 v-for="itf in groupInterfaces.values()">
                                <div class="input-group dropup">
                                    <button class="btn btn-outline-secondary text-nowrap dropdown-toggle" type="button"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                        {{ interfaceLabel(itf.interfacesWith) }}
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-start">
                                        <li>
                                            <a class="dropdown-item" href="#" data-interface-code="Internal"
                                               @click="updateInterface(itf.id, $event)">{{ $t('ims.internal') }}</a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="#" data-interface-code="External"
                                               @click="updateInterface(itf.id, $event)">{{ $t('ims.external') }}</a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="#" data-interface-code="Customer"
                                               @click="updateInterface(itf.id, $event)">{{ $t('ims.customer') }}</a>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li v-for="[pcode, processName] in interfaces">
                                            <a class="dropdown-item" href="#" :data-interface-code="pcode"
                                               @click="updateInterface(itf.id, $event)">{{ processName }}</a>
                                        </li>
                                    </ul>
                                    <input type="text" class="form-control" :placeholder="$t('gov.comment')"
                                           v-model="itf.comment">
                                </div>
                                <button type="button" class="btn btn-primary text-nowrap"
                                        @click="removeInterface($event)" :data-interface-code="itf.interfacesWith">
                                    {{ $t('gov.removeInterface') }}
                                </button>
                            </div>
                        </div>
                        <div class="d-flex flex-nowrap justify-content-end gap-1">
                            <button type="button" class="btn btn-primary text-nowrap me-2"
                                    @click="addInterface($event)">
                                {{ $t('gov.addInterface') }}
                            </button>
                            <button type="submit" class="btn btn-primary text-nowrap"
                                    @click="saveGroup($event)" :disabled="!groupChanged">
                                {{ $t('gov.saveGroup') }}
                            </button>
                            <button type="button" class="btn btn-secondary text-nowrap" @click="cancelGroupEditing">
                                {{ $t('ims.cancel') }}
                            </button>
                        </div>
                    </form>
                    <!-- Group edit end -->
                </div>
            </div>
        </div>
        </form>
    </div>
    <message id="warnInterfaceIncluded" ref="warnInterfaceIncluded"
             :title="$t('ims.warning')" :message="$t('gov.warnAlreadyIncluded')"
             :confirm-button="$t('ims.continue')"/>
    <message id="warnEditGroup" ref="warnEditGroup"
             :title="$t('ims.unsavedChanges')" :message="$t('gov.warnEditingGroup')"
             :confirm-button="$t('ims.continue')" @confirm="abandonGroupEditAndSaveChanges" />
    <message id="warnEditGovernance" ref="warnEditGovernance"
             :title="$t('ims.unsavedChanges')" :message="$t('ims.warnEditing')"
             :confirm-button="$t('ims.continue')" @confirm="abandonChanges" />
</div>
</template>

<script>
// @ is an alias to /src
import i18n from "@/locales";
import { reactive } from 'vue';
import { store, storeGovernanceInfo } from "@/store";
import { isValid, isSuccess, strEqual, deepClone, scrollTo } from '@/utils'
import { getGovernance } from "@/api/getGovernance";
import { updateGovernance } from "@/api/updateGovernance";
import MarkdownIt from 'markdown-it';
import GovernanceHeader from "@/components/governanceHeader.vue"
import TextboxWithPreview from "@/components/textboxPreview.vue"
import TableControl, { html } from "@/components/table.vue"
import Message from "@/components/message.vue"

var mdRender = new MarkdownIt();

export default {
    name: 'governanceEdit',
    components: { GovernanceHeader, TextboxWithPreview, TableControl, Message },
    props: {
        apiBaseUrl: String,
        info: { // Reactive { current: Governance }
            type: Object,
            default: () => {}
        },
        state: { // Reactive { hasUnsavedChanges: Boolean, navigateTo: String }
            type: Object,
            default: () => {}
        }
    },
    expose: [ 'setupTables', 'warnUnsavedChanges' ],
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            bidirectional: reactive({ governanceChanged: false }),
            governanceInfo: null, // Process
            descriptionEditor: reactive({ text: isValid(this.edited) ? this.edited.description : "" }),
            forceCancel: false,
            interfaces: new Map(), // Map<processCode, processName>

            groupsHeader: [
                {
                    name: "id",
                    hidden: true,
                },
                {
                    name: this.$t('gov.body'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('gov.composition'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('gov.meeting'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('gov.decisionVoting'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('gov.interfaces'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                }],
            groupsData: reactive({ rows: [] }),
            newGroup: false,
            groupBeingEdited: null,
            groupId: -1,
            groupBodyEditor: reactive({ text: "" }),
            groupCompositionEditor: reactive({ text: "" }),
            groupMeetingEditor: reactive({ text: "" }),
            groupDecisionEditor: reactive({ text: "" }),
            groupInterfaces: null, // Map<interfaceCode, Interface>
            nextInterfaceId: -1,
            nextGroupId: -1,
        }
    },
    computed: {
        i18n() { return i18n },
        current() { return this.$props.info.current; },
        latest() { return store.state.ims?.governanceInfo; },
        edited() {
            if(!isValid(this.governanceInfo) && isValid(this.current)) {
                this.governanceInfo = deepClone(this.current);
                this.governanceInfo.changeDescription = "";
                this.governanceInfo.changeBy = null;
                delete this.governanceInfo['id'];
                delete this.governanceInfo['changedOn'];
                delete this.governanceInfo['history'];

                this.descriptionEditor.text = this.governanceInfo.description;
            }

            return this.governanceInfo;
        },
        changeDescription: {
            get() { return isValid(this.edited) ? this.edited.changeDescription : ""; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.changeDescription = value;
            },
        },
        governanceTitle: {
            get() { return isValid(this.edited) ? this.edited.title : ""; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.title = value;
            },
        },
        hasGroups() {
            return isValid(this.edited) && isValid(this.edited.groups) &&
                   this.edited.groups.length > 0;
        },
        hasInterfaces() {
            return isValid(this.groupInterfaces) && this.groupInterfaces.size > 0;
        },
        addingGroup() { return this.newGroup; },
        editingGroup() { return isValid(this.groupBeingEdited); },
        groups() {
            let r = [];
            if(isValid(this.edited) && isValid(this.edited.groups)) {
                for(const grp of this.edited.groups) {
                    let interfaces = "";
                    if(isValid(grp.interfaces)) {
                        for(let itf of grp.interfaces) {
                            if(interfaces.length > 0)
                                interfaces += ",<br/>";

                            interfaces += itf.interfacesWith;
                            if(isValid(itf.comment) && itf.comment.length > 0)
                                interfaces += ` ${itf.comment}`;
                        }
                    }

                    let row = [
                        grp.id,
                        isValid(grp.body) ? grp.body : "",
                        isValid(grp.composition) ? grp.composition : "",
                        isValid(grp.meeting) ? grp.meeting : "",
                        isValid(grp.decisionVoting) ? grp.decisionVoting : "",
                        interfaces
                    ];
                    r.push(row);
                }
            }
            return r;
        },
        groupChanged() {
            if(this.addingGroup)
                return true;

            if(!isValid(this.groupBeingEdited) ||
                this.groupId !== this.groupBeingEdited.id.toString() ||
                !strEqual(this.groupBodyEditor.text, this.groupBeingEdited.body) ||
                !strEqual(this.groupCompositionEditor.text, this.groupBeingEdited.composition) ||
                !strEqual(this.groupMeetingEditor.text, this.groupBeingEdited.meeting) ||
                !strEqual(this.groupDecisionEditor.text, this.groupBeingEdited.decisionVoting) ||
                isValid(this.groupInterfaces) !== isValid(this.groupBeingEdited.interfaces))
                return true;

            if(isValid(this.groupBeingEdited.interfaces)) {
                if(this.groupInterfaces.size !== this.groupBeingEdited.interfaces.length)
                    return true;

                for(const itfe of this.groupBeingEdited.interfaces) {
                    const itf = this.groupInterfaces.get(itfe.interfacesWith);
                    if(!isValid(itf) || itfe.id !== itf.id || !strEqual(itfe.comment, itf.comment))
                        return true;
                }
            }

            return false;
        },
        groupsChanged() {
            const gc = this.current;
            const ge = this.edited;

            if(isValid(gc.groups) !== isValid(ge.groups))
                return true;

            if(isValid(gc.groups)) {
                if(gc.groups.length !== ge.groups.length)
                    return true;

                for(const grpc of gc.groups) {
                    // See if there is such a group in the edited governance
                    let grpe = null;
                    for(const grp of ge.groups) {
                        if(grpc.id === grp.id) {
                            grpe = grp;
                            break;
                        }
                    }
                    if(!isValid(grpe))
                        // No such group in edited governance
                        return true;

                    // Same group present in both governances, compare them
                    if (!strEqual(grpc.body, grpe.body) ||
                        !strEqual(grpc.composition, grpe.composition) ||
                        !strEqual(grpc.meeting, grpe.meeting) ||
                        !strEqual(grpc.decisionVoting, grpe.decisionVoting) ||
                        isValid(grpc.interfaces) !== isValid(grpe.interfaces))
                        return true;

                    if(isValid(grpc.interfaces)) {
                        if(grpc.interfaces.length !== grpe.interfaces.length)
                            return true;

                        for(const itfc of grpc.interfaces) {
                            // See if there is such an interface
                            let itfe = null;
                            for(const itf of grpe.interfaces) {
                                if(itf.id === itfc.id) {
                                    itfe = itf;
                                    break;
                                }
                            }
                            if(!isValid(itfe) ||
                               !strEqual(itfc.interfacesWith, itfe.interfacesWith) ||
                               !strEqual(itfc.comment, itfe.comment))
                                // No such interface for the group in edited governance
                                return true;
                        }
                    }
                }
            }

            return false;
        },
        governanceChanged() {
            if(!isValid(this.current) || !isValid(this.edited))
                return false;

            const gc = this.current;
            const ge = this.edited;

            if(!strEqual(gc.title, ge.title) ||
               !strEqual(gc.description, this.descriptionEditor.text))
                return true;

            // Check groups
            return this.groupsChanged;
        },
        returnToRoute() {
            return "/ims/plan";
        },
    },
    watch: {
        governanceChanged(changed) {
            this.bidirectional.governanceChanged = changed;
            this.$props.state.hasUnsavedChanges = changed && !this.forceCancel;
        },
        forceCancel() {
            this.$props.state.hasUnsavedChanges = false;
        }
    },
    methods: {
        setupTables() {
            this.groupsData.rows = this.groups;
            this.$refs.groups?.forceUpdate();
        },
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
        interfaceLabel(code) {
            if(code === "Internal")
                return this.$t('ims.internal');
            else if(code === "External")
                return this.$t('ims.external');
            else if(code === "Customer")
                return this.$t('ims.customer');

            return code;
        },
        removeGroup(id) {
            if(isValid(this.edited) && isValid(this.edited.groups)) {
                console.log("Remove group " + id);
                this.edited.groups = this.edited.groups.filter(grp => id !== grp.id.toString());
                if(this.edited.groups.length > 0)
                    this.setupTables();
            }
        },
        addGroup() {
            this.groupId = this.nextGroupId--;
            this.groupBodyEditor.text = "";
            this.groupCompositionEditor.text = "";
            this.groupMeetingEditor.text = "";
            this.groupDecisionEditor.text = "";
            this.groupInterfaces = new Map();
            this.groupBeingEdited = null;
            this.newGroup = true;

            let t = this;
            const delayedSetupValidation = setTimeout(function() {
                clearTimeout(delayedSetupValidation);
                t.setupValidation(".groups ");
                scrollTo('group-title');
            }, 250);
        },
        editGroup(id) {
            this.newGroup = false;
            if(isValid(this.edited) && isValid(this.edited.groups)) {
                for(const grp of this.edited.groups) {
                    if(id !== grp.id.toString())
                        continue;

                    // Found the group to edit, load it in the controls
                    this.groupBeingEdited = deepClone(grp);
                    this.groupId = id;
                    this.groupBodyEditor.text = String(grp.body);
                    this.groupCompositionEditor.text = String(grp.composition);
                    this.groupMeetingEditor.text = String(grp.meeting);
                    this.groupDecisionEditor.text = String(grp.decisionVoting);
                    this.groupInterfaces = new Map();
                    if(isValid(grp.interfaces)) {
                        for(const itf of grp.interfaces)
                            this.groupInterfaces.set(itf.interfacesWith, itf);
                    }
                    else
                        this.groupBeingEdited.interfaces = [];

                    let t = this;
                    const delayedSetupValidation = setTimeout(function() {
                        clearTimeout(delayedSetupValidation);
                        t.setupValidation(".groups ");
                        scrollTo('group-title');
                    }, 250);

                    console.log("Edit group " + id);
                    break;
                }
            }
        },
        cancelGroupEditing() {
            this.newGroup = false;
            this.groupBeingEdited = null;
            this.groupInterfaces = null;
            scrollTo('annexes-title');
        },
        addInterface() {
            if(!this.groupInterfaces.has("External")) {
                this.groupInterfaces.set("External", {
                    id: this.nextInterfaceId--,
                    interfacesWith: "External",
                    comment: null });
                return;
            }

            if(!this.groupInterfaces.has("Internal")) {
                this.groupInterfaces.set("Internal", {
                    id: this.nextInterfaceId--,
                    interfacesWith: "Internal",
                    comment: null });
                return;
            }

            if(!this.groupInterfaces.has("Customer")) {
                this.groupInterfaces.set("Customer", {
                    id: this.nextInterfaceId--,
                    interfacesWith: "Customer",
                    comment: null });
                return;
            }

            for(const [code, name] of this.interfaces) {
                if(!this.groupInterfaces.has(code)) {
                    this.groupInterfaces.set(code, {
                        id: this.nextInterfaceId--,
                        interfacesWith: code,
                        comment: null });
                    return;
                }
            }
        },
        removeInterface(event) {
            let el = event.target;
            const interfacesWith = el.getAttribute("data-interface-code");
            if(this.groupInterfaces.has(interfacesWith))
                this.groupInterfaces.delete(interfacesWith);
        },
        updateInterface(interfaceId, event) {
            let el = event.target;
            const interfacesWith = el.getAttribute("data-interface-code");
            event.preventDefault();

            for(let itf of this.groupInterfaces.values())
                // Found the interface that was changed
                if(itf.id === interfaceId) {
                    if(itf.interfacesWith === interfacesWith)
                        // No change, bail
                        return;

                    if(this.groupInterfaces.has(interfacesWith)) {
                        // This interface is already in the list, warn and no change
                        console.log(`Interface ${interfacesWith} is already included`);
                        this.$refs.warnInterfaceIncluded.showModal();
                        return;
                    }

                    this.groupInterfaces.delete(itf.interfacesWith);
                    itf.interfacesWith = interfacesWith;
                    this.groupInterfaces.set(interfacesWith, itf);

                    break;
                }
        },
        saveGroup(event) {
            if(isValid(this.edited) && this.$refs.groupForm.checkValidity()) {
                // Check if adding a new group or editing an existing one
                if(this.newGroup) {
                    // Adding new one
                    let group = {
                        id: this.groupId,
                        body: this.groupBodyEditor.text,
                        composition: this.groupCompositionEditor.text,
                        meeting: this.groupMeetingEditor.text,
                        decisionVoting: this.groupDecisionEditor.text,
                        interfaces: []
                    };
                    for(const [interfacesWith, itf] of this.groupInterfaces)
                        group.interfaces.push(itf);

                    this.edited.groups.push(group);
                    this.newGroup = false;
                    console.log("Added new group " + group.id);
                } else if(isValid(this.groupBeingEdited) && isValid(this.edited.groups)) {
                    // Saving changes to the one being edited
                    for(const grp of this.edited.groups) {
                        if(this.groupId !== grp.id.toString())
                            continue;

                        // Found the group being edited, update it
                        grp.body = this.groupBodyEditor.text;
                        grp.composition = this.groupCompositionEditor.text;
                        grp.meeting = this.groupMeetingEditor.text;
                        grp.decisionVoting = this.groupDecisionEditor.text;
                        grp.interfaces = [];
                        for(const [interfacesWith, itf] of this.groupInterfaces)
                            grp.interfaces.push(itf);

                        this.groupBeingEdited = null;
                        console.log("Store changes to group " + grp.id);
                        break;
                    }
                }

                this.setupTables();
                scrollTo('annexes-title');
                event.preventDefault();
            }
        },
        saveChanges(event) {
            if(this.addingGroup || this.editingGroup) {
                // Editing a group
                if(this.governanceChanged) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.$refs.warnEditGroup.showModal();
                    return;
                }

                // Cancel group editing
                this.newGroup = false;
                this.groupBeingEdited = null;
            }

            if(this.$refs.governanceForm.checkValidity()) {
                if(!this.governanceChanged)
                    this.cancelChanges();
                else {
                    // We have changes to the governance that must be saved as another version
                    console.log("Saving governance changes");

                    this.governanceInfo.description = this.descriptionEditor.text;
                    if(isValid(this.governanceInfo.changeBy)) {
                        delete this.governanceInfo.changeBy['kind'];
                        delete this.governanceInfo.changeBy['given_name'];
                        delete this.governanceInfo.changeBy['family_name'];
                        delete this.governanceInfo.changeBy['email_verified'];
                    }

                    // Call API to update the governance information
                    let t = this;
                    const guResult = updateGovernance(this.accessToken, this.governanceInfo, this.$props.apiBaseUrl);
                    guResult.update().then(() => {
                        if(isSuccess(t, guResult)) {
                            // Success
                            console.log("Created new governance version");
                            t.$root.$refs.toasts.showSuccess(t.$t('ims.success'),
                                                             t.$t('ims.newEntityVersion', {
                                                                 entity: t.$t('ims.governance').toLowerCase()
                                                             }));

                            // Fetch the governance information from the API to include the added version
                            const giResult = getGovernance(t.accessToken, true, t.$props.apiBaseUrl);
                            giResult.load().then(() => {
                                if(isSuccess(t, giResult)) {
                                    // Success
                                    storeGovernanceInfo(giResult);
                                    t.$props.info.current = t.latest;
                                    t.forceCancel = true;
                                    t.$router.push(t.returnToRoute);
                                }
                            });
                        }
                    });
                }
                event.preventDefault();
                event.stopPropagation();
            }
        },
        abandonGroupEditAndSaveChanges() {
            // Cancel group editing
            this.newGroup = false;
            this.groupBeingEdited = null;
            this.$refs.governanceHeader.submit();
        },
        cancelChanges() {
            this.$router.push(this.returnToRoute);
        },
        warnUnsavedChanges() {
            this.$refs.warnEditGovernance.showModal();
        },
        abandonChanges() {
            this.forceCancel = true;
            this.$router.push(isValid(this.$props.state.navigateTo) ?
                              this.$props.state.navigateTo :
                              this.returnToRoute);
        },
    },
    created() {
        // Populate interface list
        this.interfaces.set('BA', this.$t('home.BA'));
        this.interfaces.set('BDS', this.$t('home.BDS'));
        this.interfaces.set('CAPM', this.$t('home.CAPM'));
        this.interfaces.set('CHM', this.$t('home.CHM'));
        this.interfaces.set('COM', this.$t('home.COM'));
        this.interfaces.set('CONFM', this.$t('home.CONFM'));
        this.interfaces.set('CSI', this.$t('home.CSI'));
        this.interfaces.set('CRM', this.$t('home.CRM'));
        this.interfaces.set('CPM', this.$t('home.CPM'));
        this.interfaces.set('FA', this.$t('home.FA'));
        this.interfaces.set('HR', this.$t('home.HR'));
        this.interfaces.set('ISM', this.$t('home.ISM'));
        this.interfaces.set('ISRM', this.$t('home.ISRM'));
        this.interfaces.set('PPC', this.$t('home.PPC'));
        this.interfaces.set('PM', this.$t('home.PM'));
        this.interfaces.set('PKM', this.$t('home.PKM'));
        this.interfaces.set('PPM', this.$t('home.PPM'));
        this.interfaces.set('RDM', this.$t('home.RDM'));
        this.interfaces.set('RM', this.$t('home.RM'));
        this.interfaces.set('SACM', this.$t('home.SACM'));
        this.interfaces.set('SUPPM', this.$t('home.SUPPM'));
        this.interfaces.set('SLM', this.$t('home.SLM'));
        this.interfaces.set('SPM', this.$t('home.SPM'));
        this.interfaces.set('SRM', this.$t('home.SRM'));
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
.governance {
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
.form-label {
    margin-bottom: .25rem;
}
.governance .groups {
    margin-bottom: 1rem;
    gap: 0;
}
.governance .groups h5 {
    margin-top: 1rem;
    margin-bottom: 0;
}
.governance .interfaces {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.interfaces-with {
    width: 100%;
}
.interfaces-with .input-group {
    min-width: 10rem;
}
.interfaces-with div button:first-of-type {
    text-align: right;
    min-width: 6rem;
}
.check-item .form-check-input,
.check-item .form-check-label {
    cursor: pointer;
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
