<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap">
        <form class="needs-validation" novalidate ref="processForm">
        <div class="process">
            <process-header ref="processHeader" :edit-mode="true" :info="info" :bidirectional="bidirectional"
                            @save="saveChanges($event)" @cancel="cancelChanges"/>
            <div class="details">
                <!-- Commit message -->
                <div class="text-field mb-3">
                    <label for="changeDesc" class="form-label">{{ $t('ims.changeDesc') }}:</label>
                    <textarea ref="textarea" class="form-control textarea" id="changeDesc" rows=3
                              v-model="changeDescription" :maxlength=1024 required/>
                    <div class="invalid-feedback">{{ $t('ims.invalidProcessChange') }}</div>
                </div>

                <h3>{{ $t('ims.general') }}</h3>

                <div class="input-group mb-3 flex-nowrap gap-2">
                    <!-- Review frequency -->
                    <div class="input-group flex-column flex-nowrap frequency">
                        <label for="reviewFrequency" class="form-label">{{ $t('ims.reviewFreq') }}:</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="reviewFrequency" v-model="reviewFrequency" required>
                            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {{ reviewFrequencyUnitName }}</button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#" @click="updateReviewFrequencyUnit('day', $event)">{{ $t('ims.days') }}</a></li>
                                <li><a class="dropdown-item" href="#" @click="updateReviewFrequencyUnit('month', $event)">{{ $t('ims.months') }}</a></li>
                                <li><a class="dropdown-item" href="#" @click="updateReviewFrequencyUnit('year', $event)">{{ $t('ims.years') }}</a></li>
                            </ul>
                        </div>
                    </div>
                    <!-- Next review -->
                    <div class="input-group review-date">
                        <div class="text-field">
                            <label for="nextReview" class="form-label">{{ $t('ims.nextReview') }}:</label>
                            <VueDatePicker v-if="reviewFrequencyUnit === 'day'" id="nextReview" v-model="nextReview"
                                           text-input auto-apply class="focus-ring" required :enable-time-picker="false"
                                           month-name-format="long" :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false, showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="dd/MM/yyyy" format="dd/MM/yyyy"/>

                            <VueDatePicker v-if="reviewFrequencyUnit === 'month'" id="nextReview" v-model="nextReview"
                                           month-picker text-input auto-apply
                                           month-name-format="long" :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false, showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="MM/yyyy"/>

                            <VueDatePicker v-if="reviewFrequencyUnit === 'year'" id="nextReview" v-model="nextReview"
                                           year-picker text-input auto-apply :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false, showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="yyyy"/>
                        </div>
                    </div>
                    <!-- Contact-->
                    <div class="input-group">
                        <div class="text-field">
                            <label for="contactEmail" class="form-label">{{ $t('ims.contact') }}:</label>
                            <input type="email" class="form-control" id="contactEmail" v-model="contactEmail"
                                   placeholder="name@example.com" maxlength="255" required>
                        </div>
                    </div>
                </div>
                <!-- Diagram -->
                <div class="text-field mb-3">
                    <label for="urlDiagram" class="form-label">{{ $t('ims.linkProcessDiagram') }}:</label>
                    <input type="text" class="form-control" id="urlDiagram" v-model="urlDiagram"/>
                </div>
                <!-- Goals -->
                <h3>{{ $t('ims.goals') }}</h3>
                <textbox-with-preview class="mt-1" :label="$t('ims.goalsLabel')" :text="goalsEditor"
                                      :rows="5" :max-length=4096 required/>
                <!-- Scope -->
                <h3>{{ $t('ims.scope') }}</h3>
                <textbox-with-preview class="mt-1" :label="$t('ims.scopeLabel')" :text="scopeEditor"
                                      :rows="10" :max-length=4096 required/>
                <!-- Requirements -->
                <h3 id="requirements-title">{{ $t('ims.requirements') }}</h3>
                <div class="requirements">
                    <table-control v-if="hasRequirements" id="requirements" ref="requirements"
                                   :can-edit="true" :can-remove="true" :action-column="$t('ims.action')"
                                   :header="requirementsHeader" :data="requirementsData"
                                    @edit="editRequirement" @remove="removeRequirement"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                    <div class="d-flex flex-nowrap justify-content-end">
                        <button v-if="!addingRequirement && !editingRequirement" type="button" class="btn btn-primary" @click="addRequirement">{{ $t('ims.addRequirement') }}</button>
                    </div>
                    <!-- Requirement edit start -->
                    <form v-if="addingRequirement || editingRequirement" class="needs-validation" novalidate ref="reqForm">
                        <h5 id="requirement-title">{{ $t(addingRequirement ? 'ims.newRequirement' : 'ims.editRequirement') }}</h5>
                        <div class="input-group pt-3 mb-3 flex-nowrap gap-2 fade-top-border">
                            <!-- Code -->
                            <div class="text-field code">
                                <label for="reqCode" class="form-label">{{ $t('ims.code') }}:</label>
                                <input type="text" class="form-control" id="reqCode" v-model="requirementCode" maxlength="10">
                            </div>
                            <!-- Responsible -->
                            <div class="input-group flex-column flex-nowrap responsible">
                                <label for="reqResponsibles" class="form-label">{{ $t('ims.responsible') }}:</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="reqResponsibles" v-model="requirementResponsibles" readonly>
                                    <button class="btn btn-outline-secondary dropdown-toggle" type="button"
                                            data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                        {{ $t('ims.users') }}
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end user-list">
                                        <li v-for="[checkinUserId, user] in users" class="dropdown-item check-item">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" :id="checkinUserId" @change="toggleResponsible($event)">
                                                <label class="form-check-label" :for="checkinUserId">
                                                    {{ user.fullName }}
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!-- Description -->
                        <textbox-with-preview class="mt-1" :label="$t('ims.describeRequirement')" :text="reqDescriptionEditor" :rows="5" :max-length=2048 required/>
                        <!-- Source -->
                        <textbox-with-preview class="mt-1" :label="$t('ims.indicateSource')" :text="reqSourceEditor" :rows="3" :max-length=1024 required/>
                        <div class="d-flex flex-nowrap justify-content-end gap-1">
                            <button type="submit" class="btn btn-primary" @click="saveRequirement($event)" :disabled="!requirementChanged">
                                {{ $t(addingRequirement ? 'ims.addRequirement' : 'ims.saveRequirement') }}
                            </button>
                            <button type="button" class="btn btn-secondary" @click="cancelRequirementEditing">{{ $t('ims.cancel') }}</button>
                        </div>
                    </form>
                    <!-- Requirement edit end -->
                </div>
                <!-- Interfaces -->
                <h3 id="interfaces-title">{{ $t('ims.inputOutput') }}</h3>
                <div class="interfaces">
                    <table-control v-if="hasInterfaces" id="interfaces" ref="interfaces"
                                   :can-edit="true" :can-remove="true" :action-column="$t('ims.action')"
                                   :header="interfacesHeader" :data="interfacesData"
                                   @edit="editInterface" @remove="removeInterface"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                    <div class="d-flex flex-nowrap justify-content-end">
                        <button v-if="!addingInterface && !editingInterface" type="button" class="btn btn-primary" @click="addInterface">{{ $t('ims.addInterface') }}</button>
                    </div>
                    <!-- Interface edit start -->
                    <form v-if="addingInterface || editingInterface" class="needs-validation" novalidate ref="itfForm">
                        <h5 id="interface-title">{{ $t(addingInterface ? 'ims.newInterface' : 'ims.editInterface') }}</h5>
                        <div class="input-group pt-3 mb-3 flex-nowrap gap-2 fade-top-border">
                            <!-- Direction -->
                            <div class="input-group flex-column flex-nowrap direction">
                                <label for="direction" class="form-label">{{ $t('ims.type') }}:</label>
                                <div class="dropdown">
                                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {{ interfaceDirection }}</button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#" @click="updateInterfaceDirection('In', $event)">{{ $t('ims.in') }}</a></li>
                                        <li><a class="dropdown-item" href="#" @click="updateInterfaceDirection('Out', $event)">{{ $t('ims.out') }}</a></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- Interfaces with -->
                            <div class="input-group flex-column flex-nowrap interfaces-with">
                                <label for="interfaceWith" class="form-label">{{ interfaceDirectionPrefix }}:</label>
                                <div class="input-group dropup">
                                    <input type="text" class="form-control" id="interfaceWith" v-model="interfaceWith" readonly>
                                    <button class="btn btn-outline-secondary dropdown-toggle" type="button"
                                            data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                        {{ $t('ims.interfaces') }}
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li class="dropdown-item check-item">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="Internal" @change="toggleInterface($event)">
                                                <label class="form-check-label" for="Internal">{{ $t('ims.internal') }}</label>
                                            </div>
                                        </li>
                                        <li class="dropdown-item check-item">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="External" @change="toggleInterface($event)">
                                                <label class="form-check-label" for="External">{{ $t('ims.external') }}</label>
                                            </div>
                                        </li>
                                        <li class="dropdown-item check-item">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="Customer" @change="toggleInterface($event)">
                                                <label class="form-check-label" for="Customer">{{ $t('ims.customer') }}</label>
                                            </div>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li v-for="[pcode, processName] in itfConnections" class="dropdown-item check-item">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" :id="pcode" @change="toggleInterface($event)">
                                                <label class="form-check-label" :for="pcode">{{ processName }}</label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!-- Relevant material -->
                        <textbox-with-preview class="mt-1" :label="$t('ims.provideRelevantMaterial')" :text="itfRelevantMaterialEditor" :rows="5" :max-length=2048 required/>
                        <!-- Source -->
                        <textbox-with-preview class="mt-1" :label="$t('ims.describeInterface')" :text="itfDescriptionEditor" :rows="5" :max-length=2048 required/>
                        <div class="d-flex flex-nowrap justify-content-end gap-1">
                            <button type="submit" class="btn btn-primary" @click="saveInterface($event)" :disabled="!interfaceChanged">
                                {{ $t(addingInterface ? 'ims.addInterface' : 'ims.saveInterface') }}
                            </button>
                            <button type="button" class="btn btn-secondary" @click="cancelInterfaceEditing">{{ $t('ims.cancel') }}</button>
                        </div>
                    </form>
                    <!-- Interface edit end -->
                </div>
            </div>
        </div>
        </form>
    </div>
    <message id="warnEditRequirement" ref="warnEditRequirement"
             :title="$t('ims.unsavedChanges')" :message="$t('ims.warnEditingRequirement')"
             :confirm-button="$t('ims.continue')" @confirm="abandonRequirementEditAndSaveChanges" />
    <message id="warnEditInterface" ref="warnEditInterface"
             :title="$t('ims.unsavedChanges')" :message="$t('ims.warnEditingInterface')"
             :confirm-button="$t('ims.continue')" @confirm="abandonInterfaceEditAndSaveChanges" />
    <message id="warnEditProcess" ref="warnEditProcess"
             :title="$t('ims.unsavedChanges')" :message="$t('ims.warnEditing')"
             :confirm-button="$t('ims.continue')" @confirm="abandonChanges" />
</div>
</template>

<script>
// @ is an alias to /src
import i18n from "@/locales";
import { reactive } from 'vue';
import { store, storeProcessInfo } from "@/store";
import { isValid, strEqual, deepClone, userNames, scrollTo } from '@/utils'
import { findUserWithEmail } from "@/roles";
import { parseInterfaces, interfaceList } from '@/process'
import { getProcessInfo } from "@/api/getProcessInfo";
import { updateProcessInfo } from "@/api/updateProcessInfo";
import MarkdownIt from 'markdown-it';
import ProcessHeader from "@/components/processHeader.vue"
import TextboxWithPreview from "@/components/textboxPreview.vue"
import TableControl, { html } from "@/components/table.vue"
import Message from "@/components/message.vue"

var mdRender = new MarkdownIt();

export default {
    name: 'processEdit',
    components: { ProcessHeader, TextboxWithPreview, TableControl, Message },
    props: {
        processCode: String,
        apiBaseUrl: String,
        info: Object,   // { current: Process, approved: Process }
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
            bidirectional: reactive({ processChanged: false }),
            processInfo: null, // Process
            goalsEditor: reactive({ text: isValid(this.edited) ? this.edited.goals : "" }),
            scopeEditor: reactive({ text: isValid(this.edited) ? this.edited.scope : "" }),
            dpInput: null,
            forceCancel: false,

            requirementsHeader: [
                {
                    name: "id",
                    hidden: true,
                },
                this.$t('ims.code'),
                {
                    name: this.$t('ims.requirement'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('ims.source'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('ims.responsible'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                }],
            requirementsData: reactive({ rows: [] }),
            newRequirement: false,
            requirementBeingEdited: null,
            nextReqId: -1,
            reqId: -1,
            reqCode: "",
            reqDescriptionEditor: reactive({ text: "" }),
            reqSourceEditor: reactive({ text: "" }),
            reqResponsibles: new Map(), // Map<checkinUserId, User>

            interfacesHeader: [
                {
                    name: "id",
                    hidden: true,
                },
                this.$t('ims.type'),
                {
                    name: this.$t('ims.interface'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                },
                {
                    name: this.$t('ims.relevantMaterial'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('ims.description'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                }],
            interfacesData: reactive({ rows: [] }),
            newInterface: false,
            interfaceBeingEdited: null,
            nextItfId: -1,
            itfId: -1,
            itfDirection: "In",
            itfWith: null, // { internal: Boolean, external: Boolean, customer: Boolean, process: Set(processCode) }
            itfRelevantMaterialEditor: reactive({ text: "" }),
            itfDescriptionEditor: reactive({ text: "" }),
            itfConnections: new Map(),
        }
    },
    computed: {
        i18n() { return i18n },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        edited() {
            if(!isValid(this.processInfo) && isValid(this.current)) {
                this.processInfo = deepClone(this.current);
                this.processInfo.changeDescription = "";
                this.processInfo.changeBy = null;
                delete this.processInfo['id'];
                delete this.processInfo['changedOn'];
                delete this.processInfo['history'];
                delete this.processInfo['apiVersion'];

                this.goalsEditor.text = this.processInfo.goals;
                this.scopeEditor.text = this.processInfo.scope;
            }

            return this.processInfo;
        },
        changeDescription: {
            get() { return isValid(this.edited) ? this.edited.changeDescription : ""; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.changeDescription = value;
            },
        },
        contactEmail: {
            get() { return isValid(this.edited) ? this.edited.contact : ""; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.contact = value;
            },
        },
        urlDiagram: {
            get() { return isValid(this.edited) ? this.edited.urlDiagram : ""; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.urlDiagram = value;
            },
        },
        reviewFrequency: {
            get() { return isValid(this.edited) ? this.edited.reviewFrequency : 1; },
            set(value) {
                if(isValid(this.edited))
                    this.edited.reviewFrequency = value;
            },
        },
        reviewFrequencyUnit() {
            if(isValid(this.edited))
                switch(this.edited.frequencyUnit) {
                    case 'day':
                    case 'year':
                        return this.edited.frequencyUnit;
                }
            return 'month';
        },
        reviewFrequencyUnitName() {
            let unit = this.$t('ims.years');
            if(isValid(this.edited))
                switch(this.edited.frequencyUnit) {
                    case 'day':
                        unit = this.$t('ims.days');
                        break;
                    case 'month':
                        unit = this.$t('ims.months');
                        break;
                }
            return unit;
        },
        nextReview: {
            get() {
                let date = Date.now();
                if(isValid(this.edited)) {
                    date = new Date(this.edited.nextReview);
                    switch(this.edited.frequencyUnit) {
                        case 'year': return date.getFullYear();
                        case 'month': return { year: date.getFullYear(), month: date.getMonth() }
                    }
                }

                return date;
            },
            set(value) {
                if(value instanceof Date) {
                    value.setHours(8);
                    value = value.toISOString();
                }
                else if(typeof(value) === "number") {
                    // Got a year
                    value = new Date(value, 3, 1, 8).toISOString();
                }
                else if(isValid(value.year) || isValid(value.month)) {
                    // Got { month: 0, year: 2023 }
                    value = new Date(value.year, value.month, 1, 8).toISOString();
                }

                if(isValid(this.edited))
                    this.edited.nextReview = value;
            },
        },
        hasRequirements() {
            return isValid(this.edited) && isValid(this.edited.requirements) &&
                   this.edited.requirements.length > 0;
        },
        addingRequirement() { return this.newRequirement; },
        editingRequirement() { return isValid(this.requirementBeingEdited); },
        requirements() {
            let r = [];
            if(isValid(this.edited) && isValid(this.edited.requirements)) {
                for(const req of this.edited.requirements) {
                    let row = [
                        req.id,
                        isValid(req.code) ? req.code : "",
                        isValid(req.requirement) ? req.requirement : "",
                        isValid(req.source) ? req.source : "",
                        userNames(req.responsibles, "<br/>")
                    ];
                    r.push(row);
                }
            }
            return r;
        },
        requirementCode: {
            get() { return this.reqCode; },
            set(value) { this.reqCode = value; }
        },
        requirementResponsibles() { return userNames(this.reqResponsibles.values()); },
        requirementChanged() {
            if(this.addingRequirement)
                return true;

            if(!isValid(this.requirementBeingEdited) ||
                this.reqId !== this.requirementBeingEdited.id.toString() ||
                !strEqual(this.reqCode, this.requirementBeingEdited.code) ||
                !strEqual(this.reqDescriptionEditor.text, this.requirementBeingEdited.requirement) ||
                !strEqual(this.reqSourceEditor.text, this.requirementBeingEdited.source) ||
                isValid(this.reqResponsibles) !== isValid(this.requirementBeingEdited.responsibles))
                return true;

            if(isValid(this.requirementBeingEdited.responsibles)) {
                if(this.reqResponsibles.size !== this.requirementBeingEdited.responsibles.length)
                    return true;

                for(const user of this.requirementBeingEdited.responsibles) {
                    if(!this.reqResponsibles.has(user.checkinUserId))
                        return true;
                }
            }

            return false;
        },
        requirementsChanged() {
            const pc = this.current;
            const pe = this.edited;

            if(isValid(pc.requirements) !== isValid(pe.requirements))
                return true;

            if(isValid(pc.requirements)) {
                if(pc.requirements.length !== pe.requirements.length)
                    return true;

                for(const reqc of pc.requirements) {
                    // See if there is such a requirements in the edited process
                    let reqe = null;
                    for(const req of pe.requirements) {
                        if(reqc.id === req.id) {
                            reqe = req;
                            break;
                        }
                    }
                    if(!isValid(reqe))
                        // No such requirement in edited process
                        return true;

                    // Same requirement present in both processes, compare them
                    if (!strEqual(reqc.code, reqe.code) ||
                        !strEqual(reqc.requirement, reqe.requirement) ||
                        !strEqual(reqc.source, reqe.source) ||
                        isValid(reqc.responsibles) !== isValid(reqe.responsibles))
                        return true;

                    if(isValid(reqc.responsibles)) {
                        if(reqc.responsibles.length !== reqe.responsibles.length)
                            return true;

                        for(const ruc of reqc.responsibles) {
                            // See if there is such a responsible
                            let rue = null;
                            for(const user of reqe.responsibles) {
                                if(ruc.checkinUserId === user.checkinUserId) {
                                    rue = user;
                                    break;
                                }
                            }
                            if(!isValid(rue))
                                // No such responsible for requirement in edited process
                                return true;
                        }
                    }
                }
            }

            return false;
        },
        hasInterfaces() {
            return isValid(this.edited) && isValid(this.edited.interfaces) &&
                this.edited.interfaces.length > 0;
        },
        addingInterface() { return this.newInterface; },
        editingInterface() { return isValid(this.interfaceBeingEdited); },
        interfaces() {
            let i = [];
            if(isValid(this.edited) && isValid(this.edited.interfaces)) {
                const _from = this.$t("ims.from");
                const _to = this.$t("ims.to");
                const _in = this.$t("ims.in");
                const _out = this.$t("ims.out");
                for(const itf of this.edited.interfaces) {
                    const prefix = ("in" === itf.direction.substr(0,2).toLowerCase() ? _from : _to) + "<br/>";
                    const itfWith = parseInterfaces(itf.interfacesWith);
                    const itfList = interfaceList(itfWith, this.$t);
                    let row = [
                        itf.id,
                        isValid(itf.direction) && "in" === itf.direction.toLowerCase() ? _in : _out,
                        prefix + itfList,
                        isValid(itf.relevantMaterial) ? itf.relevantMaterial : "",
                        isValid(itf.description) ? itf.description : "",
                    ];
                    i.push(row);
                }
            }
            return i;
        },
        interfaceDirection() {
            return "in" === this.itfDirection.toLowerCase() ? this.$t('ims.in') : this.$t('ims.out');
        },
        interfaceDirectionPrefix() {
            return "in" === this.itfDirection.toLowerCase() ? this.$t('ims.from') : this.$t('ims.to');
        },
        interfaceWith() { return interfaceList(this.itfWith, this.$t); },
        interfaceChanged() {
            if(this.addingInterface)
                return true;

            if(!isValid(this.interfaceBeingEdited) ||
                this.itfId !== this.interfaceBeingEdited.id.toString() ||
                this.itfDirection !== this.interfaceBeingEdited.direction ||
                !strEqual(this.itfDescriptionEditor.text, this.interfaceBeingEdited.description) ||
                !strEqual(this.itfRelevantMaterialEditor.text, this.interfaceBeingEdited.relevantMaterial))
                return true;

            if(isValid(this.itfWith) && isValid(this.interfaceBeingEdited.itfWith)) {
                if(this.itfWith.internal !== this.interfaceBeingEdited.itfWith.internal ||
                   this.itfWith.external !== this.interfaceBeingEdited.itfWith.external ||
                   this.itfWith.customer !== this.interfaceBeingEdited.itfWith.customer ||
                   this.itfWith.process.size !== this.interfaceBeingEdited.itfWith.process.size)
                    return true;

                for(const pcode of this.interfaceBeingEdited.itfWith.process) {
                    if(!this.itfWith.process.has(pcode))
                        return true;
                }
            }

            return false;
        },
        interfacesChanged() {
            const pc = this.current;
            const pe = this.edited;

            if(isValid(pc.interfaces) !== isValid(pe.interfaces))
                return true;

            if(isValid(pc.interfaces)) {
                if(pc.interfaces.length !== pe.interfaces.length)
                    return true;

                for(const itfc of pc.interfaces) {
                    // See if there is such an interface in the edited process
                    let itfe = null;
                    for(const itf of pe.interfaces) {
                        if(itfc.id === itf.id) {
                            itfe = itf;
                            break;
                        }
                    }
                    if(!isValid(itfe))
                        // No such interface in edited process
                        return true;

                    // Same interface present in both processes, compare them
                    if (!strEqual(itfc.direction, itfe.direction) ||
                        !strEqual(itfc.description, itfe.description) ||
                        !strEqual(itfc.relevantMaterial, itfe.relevantMaterial))
                        return true;

                    const itfcWith = parseInterfaces(itfc.interfacesWith);
                    const itfeWith = parseInterfaces(itfe.interfacesWith);

                    if (itfcWith.internal !== itfeWith.internal ||
                        itfcWith.external !== itfeWith.external ||
                        itfcWith.customer !== itfeWith.customer ||
                        itfcWith.process.size !== itfeWith.process.size)
                        return true;

                    for(const pcode of itfcWith.process)
                        if(!itfeWith.process.has(pcode))
                            return true;
                }
            }

            return false;
        },
        processChanged() {
            if(!isValid(this.current) || !isValid(this.edited))
                return false;

            const pc = this.current;
            const pe = this.edited;

            if (!strEqual(pc.goals, this.goalsEditor.text) ||
                !strEqual(pc.scope, this.scopeEditor.text) ||
                !strEqual(pc.urlDiagram, pe.urlDiagram) ||
                !strEqual(pc.contact, pe.contact) ||
                pc.reviewFrequency !== pe.reviewFrequency ||
                pc.frequencyUnit !== pe.frequencyUnit ||
                pc.nextReview !== pe.nextReview || // String
                pc.status !== pe.status)
                return true;

            // We will not check approval related fields, as those cannot be edited directly
            // and approving a process creates a new version anyway

            // Check requirements and interfaces
            return this.requirementsChanged || this.interfacesChanged;
        },
        users() {
            const users = store.state.temp.usersByProcess?.get(this.$props.processCode);
            return isValid(users) ? users : new Map();
        },
    },
    watch: {
        processChanged(changed) {
            this.bidirectional.processChanged = changed;
            this.$props.state.hasUnsavedChanges = changed && !this.forceCancel;
        },
        forceCancel(changed) {
            this.$props.state.hasUnsavedChanges = false;
        }
    },
    methods: {
        updateReviewFrequencyUnit(value, event) {
            event.preventDefault();
            this.dpUnhookFocus();
            if(isValid(this.edited))
                this.edited.frequencyUnit = value;

            let t = this;
            const delayedRehookFocus = setTimeout(function() {
                clearTimeout(delayedRehookFocus);
                t.dpHookFocus();
            }, 500);
        },
        addHaloFocusIn(event) {
            let el = event.target;
            el.classList.add("focus-ring");
            el.classList.add("form-control");
            el.classList.add("form-control-fix");
        },
        removeHaloFocusOut(event) {
            let el = event.target;
            el.classList.remove("focus-ring");
        },
        dpHookFocus() {
            this.dpInput = document.querySelector(".dp__input");
            this.dpInput.addEventListener('focusin', this.addHaloFocusIn);
            this.dpInput.addEventListener('focusout', this.removeHaloFocusOut);
        },
        dpUnhookFocus() {
            if(!isValid(this.dpInput))
                this.dpInput = document.querySelector(".dp__input");

            this.dpInput.removeEventListener('focusin', this.addHaloFocusIn);
            this.dpInput.removeEventListener('focusout', this.removeHaloFocusOut);
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
        addRequirement() {
            this.newRequirement = true;
            this.requirementBeingEdited = null;
            this.reqId = this.nextReqId--;
            this.reqCode = "";
            this.reqResponsibles = new Map();
            this.reqDescriptionEditor.text = "";
            this.reqSourceEditor.text = "";

            let t = this;
            const delayedSetupValidation = setTimeout(function() {
                clearTimeout(delayedSetupValidation);
                t.setupValidation(".requirements ");
                scrollTo('requirement-title');
            }, 250);
        },
        editRequirement(id) {
            this.newRequirement = false;
            if(isValid(this.edited) && isValid(this.edited.requirements)) {
                for(const req of this.edited.requirements) {
                    if(id !== req.id.toString())
                        continue;

                    // Found the requirement to edit, load it in the controls
                    this.requirementBeingEdited = deepClone(req);
                    this.reqId = id;
                    this.reqCode = req.code;
                    this.reqResponsibles = new Map();
                    for(const user of req.responsibles)
                        this.reqResponsibles.set(user.checkinUserId, user);
                    this.reqDescriptionEditor.text = String(req.requirement);
                    this.reqSourceEditor.text = String(req.source);

                    // Update the checkboxes in the user dropdown
                    let t = this;
                    const delayedResponsibleCheckboxes = setTimeout(function() {
                        clearTimeout(delayedResponsibleCheckboxes);
                        for(const [checkinUserId, u] of t.users) {
                            let el = document.getElementById(checkinUserId);
                            if(isValid(el))
                                el.checked = t.reqResponsibles.has(checkinUserId);
                        }
                        t.setupValidation(".requirements ");
                        scrollTo('requirement-title');
                    }, 250);

                    console.log("Edit requirement " + id);
                    break;
                }
            }
        },
        toggleResponsible(event) {
            let el = event.target;
            const checkinUserId = Number(el.getAttribute("id"));
            if(el.checked) {
                // Add user to the responsibles
                const users = store.state.temp.usersByProcess?.get(this.$props.processCode);
                const user = users.get(checkinUserId);
                if(isValid(user))
                    this.reqResponsibles.set(checkinUserId, user);
            }
            else {
                // Remove use from the responsibles
                if(this.reqResponsibles.has(checkinUserId))
                    this.reqResponsibles.delete(checkinUserId);
            }
        },
        cancelRequirementEditing() {
            this.newRequirement = false;
            this.requirementBeingEdited = null;
            scrollTo('requirements-title');
        },
        saveRequirement(event) {
            if(isValid(this.edited) && isValid(this.edited.requirements) &&
               this.$refs.reqForm.checkValidity()) {
                // Check if adding a new requirement or editing an existing one
                if(this.newRequirement) {
                    // Adding new one
                    let requirement = {
                        id: this.reqId,
                        code: this.reqCode,
                        requirement: this.reqDescriptionEditor.text,
                        source: this.reqSourceEditor.text,
                        responsibles: []
                    };
                    for(const [checkinUserId, usr] of this.reqResponsibles)
                        requirement.responsibles.push(usr);

                    this.edited.requirements.push(requirement);
                    this.newRequirement = false;
                    console.log("Added new requirement " + requirement.id);
                } else if(isValid(this.requirementBeingEdited)) {
                    // Saving changes to the one being edited
                    for(const req of this.edited.requirements) {
                        if(this.reqId !== req.id.toString())
                            continue;

                        // Found the requirement being edited, update it
                        req.code = this.reqCode;
                        req.requirement = this.reqDescriptionEditor.text;
                        req.source = this.reqSourceEditor.text;
                        req.responsibles = [];
                        for(const [checkinUserId, usr] of this.reqResponsibles)
                            req.responsibles.push(usr);

                        this.requirementBeingEdited = null;
                        console.log("Store changes to requirement " + req.id);
                        break;
                    }
                }

                this.requirementsData.rows = this.requirements;
                this.$refs.requirements?.forceUpdate();
                scrollTo('requirements-title');
                event.preventDefault();
            }
        },
        removeRequirement(id) {
            if(isValid(this.edited) && isValid(this.edited.requirements)) {
                console.log("Remove requirement " + id);
                this.edited.requirements = this.edited.requirements.filter(req => id !== req.id.toString());
                if(this.edited.requirements.length > 0) {
                    this.requirementsData.rows = this.requirements;
                    this.$refs.requirements.forceUpdate();
                }
            }
        },
        addInterface() {
            this.newInterface = true;
            this.interfaceBeingEdited = null;
            this.itfId = this.nextItfId--;
            this.itfDirection = "In";
            this.itfWith = { internal: false, external: false, customer: false, process: new Set() };
            this.itfRelevantMaterialEditor.text = "";
            this.itfDescriptionEditor.text = "";

            let t = this;
            const delayedSetupValidation = setTimeout(function() {
                clearTimeout(delayedSetupValidation);
                t.setupValidation(".interfaces ");
                scrollTo('interface-title');
            }, 250);
        },
        editInterface(id) {
            this.newInterface = false;
            if(isValid(this.edited) && isValid(this.edited.interfaces)) {
                for(const itf of this.edited.interfaces) {
                    if(id !== itf.id.toString())
                        continue;

                    // Found the interface to edit, load it in the controls
                    this.interfaceBeingEdited = deepClone(itf);
                    this.interfaceBeingEdited.itfWith = parseInterfaces(itf.interfacesWith);
                    this.itfId = id;
                    this.itfDirection = itf.direction;
                    this.itfWith = parseInterfaces(itf.interfacesWith);
                    this.itfDescriptionEditor.text = String(itf.description);
                    this.itfRelevantMaterialEditor.text = String(itf.relevantMaterial);

                    // Update the checkboxes in the interfaces dropdown
                    let t = this;
                    const delayedInterfacesCheckboxes = setTimeout(function() {
                        clearTimeout(delayedInterfacesCheckboxes);

                        let el = document.getElementById("Internal");
                        if(isValid(el))
                            el.checked = t.itfWith.internal;

                        el = document.getElementById("External");
                        if(isValid(el))
                            el.checked = t.itfWith.external;

                        el = document.getElementById("Customer");
                        if(isValid(el))
                            el.checked = t.itfWith.customer;

                        for(const [pcode, processName] of t.itfConnections) {
                            let el = document.getElementById(pcode);
                            if(isValid(el))
                                el.checked = t.itfWith.process.has(pcode);
                        }
                        t.setupValidation(".interfaces ");
                        scrollTo('interface-title');
                    }, 250);

                    console.log("Edit interface " + id);
                    break;
                }
            }
        },
        updateInterfaceDirection(value, event) {
            event.preventDefault();
            this.itfDirection = value;
        },
        toggleInterface(event) {
            let el = event.target;
            const code = el.getAttribute("id");
            if(el.checked) {
                // Add interface
                switch(code.toLowerCase()) {
                    case "internal": this.itfWith.internal = true; break;
                    case "external": this.itfWith.external = true; break;
                    case "customer": this.itfWith.customer = true; break;
                    default:
                        this.itfWith.process.add(code);
                        break;
                }
            }
            else {
                // Remove interface
                switch(code.toLowerCase()) {
                    case "internal": this.itfWith.internal = false; break;
                    case "external": this.itfWith.external = false; break;
                    case "customer": this.itfWith.customer = false; break;
                    default:
                        if(this.itfWith.process.has(code))
                            this.itfWith.process.delete(code);
                        break;
                }
            }
        },
        cancelInterfaceEditing() {
            this.newInterface = false;
            this.interfaceBeingEdited = null;
            scrollTo('interfaces-title');
        },
        saveInterface(event) {
            if(isValid(this.edited) && isValid(this.edited.interfaces) &&
                this.$refs.itfForm.checkValidity()) {
                // Check if adding a new interface or editing an existing one
                if(this.newInterface) {
                    // Adding new one
                    let itf = {
                        id: this.itfId,
                        direction: this.itfDirection,
                        description: this.itfDescriptionEditor.text,
                        relevantMaterial: this.itfRelevantMaterialEditor.text,
                        interfacesWith: interfaceList(this.itfWith, this.$t, false, "")
                    };

                    this.edited.interfaces.push(itf);
                    this.newInterface = false;
                    console.log("Added new interface " + itf.id);
                } else if(isValid(this.interfaceBeingEdited)) {
                    // Saving changes to the one being edited
                    for(const itf of this.edited.interfaces) {
                        if(this.itfId !== itf.id.toString())
                            continue;

                        // Found the interface being edited, update it
                        itf.direction = this.itfDirection;
                        itf.interfacesWith = interfaceList(this.itfWith, this.$t, false, "");
                        itf.description = this.itfDescriptionEditor.text;
                        itf.relevantMaterial = this.itfRelevantMaterialEditor.text;

                        this.interfaceBeingEdited = null;
                        console.log("Store changes to interface " + itf.id);
                        break;
                    }
                }

                this.interfacesData.rows = this.interfaces;
                this.$refs.interfaces?.forceUpdate();
                scrollTo('interfaces-title');
                event.preventDefault();
            }
        },
        removeInterface(id) {
            if(isValid(this.edited) && isValid(this.edited.interfaces)) {
                console.log("Remove interface " + id);
                this.edited.interfaces = this.edited.interfaces.filter(itf => id !== itf.id.toString());
                if(this.edited.interfaces.length > 0) {
                    this.interfacesData.rows = this.interfaces;
                    this.$refs.interfaces.forceUpdate();
                }
            }
        },
        saveChanges(event) {
            if(this.addingRequirement || this.editingRequirement) {
                // Editing a requirement
                if(this.requirementChanged) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.$refs.warnEditRequirement.showModal();
                    return;
                }

                // Cancel requirement editing
                this.newRequirement = false;
                this.requirementBeingEdited = null;
            }

            if(this.addingInterface || this.editingInterface) {
                // Editing an interface
                if(this.interfaceChanged) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.$refs.warnEditInterface.showModal();
                    return;
                }

                // Cancel requirement editing
                this.newRequirement = false;
                this.requirementBeingEdited = null;
            }

            if(this.$refs.processForm.checkValidity()) {
                if(!this.processChanged)
                    this.cancelChanges();
                else {
                    // We have changes to the process that must be saved as another version
                    console.log(`Saving ${this.$props.processCode} process info changes`);

                    this.processInfo.goals = this.goalsEditor.text;
                    this.processInfo.scope = this.scopeEditor.text;
                    this.processInfo.changeBy = findUserWithEmail(this.$props.processCode, this.myEmail);
                    if(isValid(this.processInfo.changeBy)) {
                        delete this.processInfo.changeBy['kind'];
                        delete this.processInfo.changeBy['given_name'];
                        delete this.processInfo.changeBy['family_name'];
                        delete this.processInfo.changeBy['email_verified'];
                    }

                    // Call API to update the process information
                    let t = this;
                    const piResult = updateProcessInfo(this.accessToken, this.$props.processCode, this.processInfo, this.$props.apiBaseUrl);
                    piResult.update().then(() => {
                        if(isValid(piResult.error?.value))
                            t.$root.$refs.toasts.showError(t.$t('ims.error'), piResult.error.value);
                        else {
                            console.log(`Created new version of ${this.$props.processCode} process info`);
                            t.$root.$refs.toasts.showSuccess(t.$t('ims.success'), t.$t('ims.newProcessVersion'));

                            // Fetch the process information from the API to include the added version
                            const piResult = getProcessInfo(this.accessToken, this.$props.processCode, true, this.$props.apiBaseUrl);
                            piResult.load().then(() => {
                                storeProcessInfo(`ims/${this.$props.processCode.toLowerCase()}ProcessInfo`, piResult);
                                t.forceCancel = true;
                                t.$router.push(`/${this.$props.processCode.toLowerCase()}`);
                            });
                        }
                    });
                }
                event.preventDefault();
                event.stopPropagation();
            }
        },
        abandonRequirementEditAndSaveChanges() {
            // Cancel requirement editing
            this.newRequirement = false;
            this.requirementBeingEdited = null;
            this.$refs.processHeader.submit();
        },
        abandonInterfaceEditAndSaveChanges() {
            // Cancel interface editing
            this.newInterface = false;
            this.interfaceBeingEdited = null;
            this.$refs.processHeader.submit();
        },
        cancelChanges() {
            this.$router.push(`/${this.$props.processCode.toLowerCase()}`);
        },
        warnUnsavedChanges() {
            this.$refs.warnEditProcess.showModal();
        },
        abandonChanges() {
            this.forceCancel = true;
            this.$router.push(isValid(this.$props.state.navigateTo) ?
                              this.$props.state.navigateTo :
                              `/${this.$props.processCode.toLowerCase()}`);
        },
    },
    created() {
        if(this.$props.processCode !== 'BA')
            this.itfConnections.set('BA', this.$t('home.BA'));
        if(this.$props.processCode !== 'BDS')
            this.itfConnections.set('BDS', this.$t('home.BDS'));
        if(this.$props.processCode !== 'CAPM')
            this.itfConnections.set('CAPM', this.$t('home.CAPM'));
        if(this.$props.processCode !== 'CHM')
            this.itfConnections.set('CHM', this.$t('home.CHM'));
        if(this.$props.processCode !== 'COM')
            this.itfConnections.set('COM', this.$t('home.COM'));
        if(this.$props.processCode !== 'CONFM')
            this.itfConnections.set('CONFM', this.$t('home.CONFM'));
        if(this.$props.processCode !== 'CSI')
            this.itfConnections.set('CSI', this.$t('home.CSI'));
        if(this.$props.processCode !== 'CRM')
            this.itfConnections.set('CRM', this.$t('home.CRM'));
        if(this.$props.processCode !== 'CPM')
            this.itfConnections.set('CPM', this.$t('home.CPM'));
        if(this.$props.processCode !== 'FA')
            this.itfConnections.set('FA', this.$t('home.FA'));
        if(this.$props.processCode !== 'HR')
            this.itfConnections.set('HR', this.$t('home.HR'));
        if(this.$props.processCode !== 'ISM')
            this.itfConnections.set('ISM', this.$t('home.ISM'));
        if(this.$props.processCode !== 'ISRM')
            this.itfConnections.set('ISRM', this.$t('home.ISRM'));
        if(this.$props.processCode !== 'PPC')
            this.itfConnections.set('PPC', this.$t('home.PPC'));
        if(this.$props.processCode !== 'PM')
            this.itfConnections.set('PM', this.$t('home.PM'));
        if(this.$props.processCode !== 'PKM')
            this.itfConnections.set('PKM', this.$t('home.PKM'));
        if(this.$props.processCode !== 'PPM')
            this.itfConnections.set('PPM', this.$t('home.PPM'));
        if(this.$props.processCode !== 'RDM')
            this.itfConnections.set('RDM', this.$t('home.RDM'));
        if(this.$props.processCode !== 'RM')
            this.itfConnections.set('RM', this.$t('home.RM'));
        if(this.$props.processCode !== 'SACM')
            this.itfConnections.set('SACM', this.$t('home.SACM'));
        if(this.$props.processCode !== 'SUPPM')
            this.itfConnections.set('SUPPM', this.$t('home.SUPPM'));
        if(this.$props.processCode !== 'SLM')
            this.itfConnections.set('SLM', this.$t('home.SLM'));
        if(this.$props.processCode !== 'SPM')
            this.itfConnections.set('SPM', this.$t('home.SPM'));
        if(this.$props.processCode !== 'SRM')
            this.itfConnections.set('SRM', this.$t('home.SRM'));
    },
    mounted() {
        // Add halo ring on focus to the date picker
        this.dpHookFocus();
        this.setupValidation();

        let t = this;
        const delayedData = setTimeout(function() {
            if(isValid(t.edited)) {
                clearTimeout(delayedData);
                t.requirementsData.rows = t.requirements;
                t.$refs.requirements?.forceUpdate();

                t.interfacesData.rows = t.interfaces;
                t.$refs.interfaces?.forceUpdate();
            }
        }, 100);
    },
    beforeDestroy() {
        // Cleanup
        this.dpUnhookFocus();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.form-control-fix {
    padding-left: 35px!important;
    padding-right: 30px!important;
}
</style>
<style scoped>
.content {
    position: relative;
    gap: .5rem;
    width: 100%;
    justify-content: center;
}
.content > div {
    width: 100%;
    max-width: 60rem;
    margin: 0 auto 2rem;
}
.process {
    margin: 0 auto;
}
.process .details {
    text-align: left;
    padding-left: 1rem;
    padding-right: 1rem;
}
.process .details h3 {
    border-bottom: 1px solid #e9ecef;
}
.details .frequency {
    min-width: 10rem;
    max-width: 15rem;
}
.details .frequency button {
    width: 6rem;
    text-align: left;
}
.details .review-date {
    max-width: 15rem;
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
.process .requirements,
.process .interfaces {
    margin-bottom: 1rem;
    gap: 0;
}
.process .requirements h5,
.process .interfaces h5{
    margin-top: 1rem;
    margin-bottom: 0;
}
.process .requirements .code {
    max-width: 10rem;
}
.process .interfaces .direction {
    width: unset;
    max-width: 5rem;
}
.process .interfaces .interfaces-with {

}
.check-item .form-check-input,
.check-item .form-check-label {
    cursor: pointer;
}
.user-list {
    max-height: 25rem;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
}
</style>
<script setup>
import Message from "@/components/message.vue";
import ImsProcessHeader from "@/components/processHeader.vue";
</script>