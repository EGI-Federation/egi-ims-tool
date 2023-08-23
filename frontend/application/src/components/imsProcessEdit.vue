<template>
<div class="d-flex flex-nowrap content">
    <div class="d-flex flex-nowrap">
        <form class="needs-validation" novalidate>
        <div class="process">
            <div class="d-flex flex-nowrap header">
                <div class="d-flex flex-nowrap flex-column operations">
                    <button type="submit" class="btn btn-primary" @click="saveChanges">{{ $t('ims.saveChanges') }}</button>
                    <button type="button" class="btn btn-secondary" @click="cancelChanges">{{ $t('ims.cancel') }}</button>
                </div>
                <div class="d-flex flex-nowrap flex-column">
                    <div class="entity-type">{{ $t('ims.process') }}</div>
                    <h2 class="fade-top-border">{{ processName }} ({{ processCode }})</h2>
                    <div class="d-flex flex-nowrap info">
                        <div>
                            <div>{{ $t('ims.procOwner') }} :</div>
                            <div>{{ $t('ims.procManager') }} :</div>
                            <div>{{ $t('ims.version') }} :</div>
                            <div>{{ $t('ims.status') }} :</div>
                            <div>{{ $t('ims.changed') }} :</div>
                            <div>{{ $t('ims.approved') }} :</div>
                        </div>
                        <div>
                            <div>{{ processOwner }}</div>
                            <div>{{ processManager }}</div>
                            <div>{{ processVersion }}</div>
                            <div><span :class="processStatus.pillClass">{{ processStatus.label }}</span></div>
                            <div>{{ changeDate }}</div>
                            <div>{{ approvalStatus }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="details">
                <div class="text-field mb-3">
                    <label for="changeDesc" class="form-label">{{ $t('ims.changeDesc') }}:</label>
                    <textarea ref="textarea" class="form-control textarea" id="changeDesc" rows=3 v-model="changeDescription" required/>
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
                                <li><a class="dropdown-item" href="#" @click="updateReviewFrequencyUnit('day', $event)">Days</a></li>
                                <li><a class="dropdown-item" href="#" @click="updateReviewFrequencyUnit('month', $event)">Months</a></li>
                                <li><a class="dropdown-item" href="#" @click="updateReviewFrequencyUnit('year', $event)">Years</a></li>
                            </ul>
                        </div>
                    </div>
                    <!-- Next review -->
                    <div class="input-group review-date">
                        <div class="text-field">
                            <label for="nextReview" class="form-label">{{ $t('ims.nextReview') }}:</label>
                            <VueDatePicker v-if="reviewFrequencyUnit === 'day'" id="nextReview" v-model="nextReview" auto-apply class="focus-ring" required
                                           text-input :enable-time-picker="false" month-name-format="long" :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false, showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="dd/MM/yyyy" format="dd/MM/yyyy"/>

                            <VueDatePicker v-if="reviewFrequencyUnit === 'month'" id="nextReview" v-model="nextReview" month-picker auto-apply
                                           text-input month-name-format="long" :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false, showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="MM/yyyy"/>

                            <VueDatePicker v-if="reviewFrequencyUnit === 'year'" id="nextReview" v-model="nextReview" year-picker auto-apply
                                           text-input :locale="i18n.global.locale"
                                           :action-row="{ showSelect: false, showCancel: false, showNow: false, showPreview: false }"
                                           :clearable="false" placeholder="yyyy"/>
                        </div>
                    </div>
                    <!-- Contact-->
                    <div class="input-group">
                        <div class="text-field">
                            <label for="contactEmail" class="form-label">{{ $t('ims.contact') }}:</label>
                            <input type="email" class="form-control" id="contactEmail" v-model="contactEmail" placeholder="name@example.com" required>
                        </div>
                    </div>
                </div>

                <div class="text-field mb-3">
                    <label for="urlDiagram" class="form-label">{{ $t('ims.linkProcessDiagram') }}:</label>
                    <input type="text" class="form-control" id="urlDiagram" v-model="urlDiagram"/>
                </div>

                <h3>{{ $t('ims.goals') }}</h3>
                <textbox-with-preview class="mt-1" :label="$t('ims.goalsLabel')" :text="goalsEditor" required/>

                <h3>{{ $t('ims.scope') }}</h3>
                <textbox-with-preview class="mt-1" :label="$t('ims.scopeLabel')" :text="scopeEditor" :rows="10" required/>

                <h3>{{ $t('ims.requirements') }}</h3>
                <div class="requirements">
                    <table-control v-if="hasRequirements" id="requirements" ref="requirements"
                                   :can-edit="true" :can-remove="true" :action-column="$t('slm.action')"
                                   :header="requirementsHeader" :data="requirementsData"
                                    @edit="editRequirement" @remove="removedRequirement"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                </div>

                <h3>{{ $t('ims.inputOutput') }}</h3>
                <div class="interfaces">
                    <table-control v-if="hasInterfaces" id="interfaces" ref="interfaces"
                                   :can-edit="false" :can-remove="true" :action-column="$t('slm.action')"
                                   :header="interfacesHeader" :data="interfacesData"
                                   @edit="editInterface" @remove="removedInterface"/>
                    <p v-else>{{ $t('ims.notDef') }}</p>
                </div>
            </div>
        </div>
        </form>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import i18n from "@/locales";
import { reactive } from 'vue';
import { store } from "@/store";
import { Status, deepClone, formatDate, isValid, statusPill } from '@/utils'
import { Roles, findUsersWithRole } from "@/roles";
import MarkdownIt from 'markdown-it';
import TextboxWithPreview from "@/components/textboxPreview.vue"
import TableControl, { html } from "@/components/table.vue"

var mdRender = new MarkdownIt();

export default {
    name: 'imsProcessEdit',
    components: { TextboxWithPreview, TableControl },
    props: {
        name: String,
        info: Object,
    },
    data() {
        return {
            processInfo: null, // Version<Process>
            goalsEditor: reactive({ text: isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.goals : "" }),
            scopeEditor: reactive({ text: isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.scope : "" }),
            dpInput: null,
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
                this.$t('ims.source'),
                {
                    name: this.$t('ims.responsible'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                }],
            requirementsData: reactive({ rows: [] }),
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
                    name: this.$t('slm.relevantMaterial'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('ims.description'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                }],
            interfacesData: reactive({ rows: [] }),
        }
    },
    computed: {
        i18n() { return i18n },
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        edited() {
            if(!isValid(this.processInfo) && isValid(this.current)) {
                this.processInfo = deepClone(this.current);
                this.processInfo.entity.changeDescription = "";
                this.goalsEditor.text = this.processInfo.entity.goals;
                this.scopeEditor.text = this.processInfo.entity.scope;
            }

            return this.processInfo;
        },
        processCode() { return isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.code : "SLM"; },
        processName() { return this.$t('home.' + this.processCode); },
        processVersion() { return isValid(this.edited) ? this.edited.version : "?"; },
        processStatus() { return isValid(this.edited) && isValid(this.edited.entity) ? statusPill(this.edited.entity.status, this.$t) : {}; },
        processOwner() {
            return isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.owner) ?
                this.edited.entity.owner.fullName :
                this.$t('ims.notSet');
        },
        processManager() {
            let pms = findUsersWithRole(Roles.SLM.PROCESS_MANAGER, true);
            if(isValid(pms) && pms.length > 0) {
                let pm = pms[0];
                return pm.fullName;
            }
            return this.$t('ims.notSet');
        },
        changeDate() {
            return isValid(this.edited) && isValid(this.edited.changedOn) ?
                   formatDate(this.edited.changedOn) : "?"; },
        approvalStatus() {
            if(!isValid(this.approved) ||
               !isValid(this.approved.entity) ||
               !isValid(this.approved.entity.approver))
                return this.$t('ims.no');

            let prefix = '';
            if(this.current.version !== this.approved.version)
                prefix = `${this.$t("ims.version")} ${this.approved.version} ${this.$t("ims.approvedOn")} `;

            return prefix + `${formatDate(this.approved.entity.approvedOn)} ${this.$t("ims.by")} ${this.approved.entity.approver.fullName}`;
        },
        changeDescription: {
            get() { return isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.changeDescription : ""; },
            set(value) {
                if(isValid(this.edited) && isValid(this.edited.entity))
                    this.edited.entity.changeDescription = value;
            },
        },
        contactEmail: {
            get() { return isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.contact : ""; },
            set(value) {
                if(isValid(this.edited) && isValid(this.edited.entity))
                    this.edited.entity.contact = value;
            },
        },
        urlDiagram: {
            get() { return isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.urlDiagram : ""; },
            set(value) {
                if(isValid(this.edited) && isValid(this.edited.entity))
                    this.edited.entity.urlDiagram = value;
            },
        },
        reviewFrequency: {
            get() { return isValid(this.edited) && isValid(this.edited.entity) ? this.edited.entity.reviewFrequency : 1; },
            set(value) {
                if(isValid(this.edited) && isValid(this.edited.entity))
                    this.edited.entity.reviewFrequency = value;
            },
        },
        reviewFrequencyUnit() {
            if(isValid(this.edited) && isValid(this.edited.entity))
                switch(this.edited.entity.frequencyUnit) {
                    case 'day':
                    case 'year':
                        return this.edited.entity.frequencyUnit;
                }
            return 'month';
        },
        reviewFrequencyUnitName() {
            let unit = this.$t('ims.years');
            if(isValid(this.edited) && isValid(this.edited.entity))
                switch(this.edited.entity.frequencyUnit) {
                    case 'day':
                        unit = this.$t('ims.days');
                        break;
                    case 'month':
                        unit = this.$t('ims.months');
                        break;
                }
            return unit.charAt(0).toUpperCase() + unit.slice(1);
        },
        nextReview: {
            get() {
                if(isValid(this.edited) && isValid(this.edited.entity))
                    return this.edited.entity.nextReview;
                return null;
            },
            set(value) {
                if(isValid(this.edited) && isValid(this.edited.entity))
                    this.edited.entity.nextReview = value;
            },
        },
        hasRequirements() {
            return isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.requirements) &&
                   this.edited.entity.requirements.length > 0;
        },
        requirements() {
            let r = [];
            if(isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.requirements)) {
                this.edited.entity.requirements.forEach(function (req, idx) {
                    let row = [
                        req.id,
                        isValid(req.code) ? req.code : "",
                        isValid(req.requirement) ? req.requirement : "",
                        isValid(req.source) ? req.source : ""
                    ];
                    let responsibles = "";
                    if(isValid(req.responsibles)) {
                        for(let rp of req.responsibles) {
                            if(responsibles.length > 0)
                                responsibles += ",<br/>";
                            responsibles += rp.fullName;
                        }
                    }
                    row.push(responsibles);
                    r.push(row);
                });
            }
            return r;
        },
        hasInterfaces() {
            return isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.interfaces) &&
                this.edited.entity.interfaces.length > 0;
        },
        interfaces() {
            let i = [];
            if(isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.interfaces)) {
                let t = this.$t;
                this.edited.entity.interfaces.forEach(function (itf, idx) {
                    const _from = t("slm.from");
                    const _to = t("slm.to");
                    let prefix = "in" === itf.direction.substr(0,2).toLowerCase() ? _from : _to;
                    let interfacesWith = "";
                    if(isValid(itf.interfacesWith)) {
                        interfacesWith = itf.interfacesWith;
                        const itfw = interfacesWith.toLowerCase();
                        if("internal" !== itfw && "external" !== itfw)
                            interfacesWith = prefix + "<br/>" + interfacesWith;
                    }
                    let row = [
                        itf.id,
                        isValid(itf.direction) ? itf.direction : "",
                        interfacesWith,
                        isValid(itf.relevantMaterial) ? itf.relevantMaterial : "",
                        isValid(itf.description) ? itf.description : "",
                    ];
                    i.push(row);
                });
            }
            return i;
        },
        isDraft() { return isValid(this.edited) && isValid(this.edited.entity) && Status.DRAFT.description === this.edited.entity.status; },
        isApproved() { return isValid(this.edited) && isValid(this.edited.entity) && Status.APPROVED.description === this.edited.entity.status; },
        isReady() { return isValid(this.edited) && isValid(this.edited.entity) && Status.READY_FOR_APPROVAL.description === this.edited.entity.status; },
        isDeprecated() { return isValid(this.edited) && isValid(this.edited.entity) && Status.DEPRECATED.description === this.edited.entity.status; },
        roles() { return store.state.temp.roles; },
    },
    methods: {
        updateReviewFrequencyUnit(value, event) {
            event.preventDefault();
            this.dpUnhookFocus();
            if(isValid(this.edited) && isValid(this.edited.entity))
                this.edited.entity.frequencyUnit = value;

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
        setupValidation() {
            const forms = document.querySelectorAll('.needs-validation')
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    form.classList.add('was-validated');
                }, false);
            })
        },
        editRequirement(id) {
            console.log("Edit requirement " + id);
        },
        removedRequirement(id) {
            console.log("Removed requirement " + id);
            if(isValid(this.edited) && isValid(this.edited.entity) && isValid(this.edited.entity.requirements)) {
                this.edited.entity.requirements = this.edited.entity.requirements.filter(req => id !== req.id.toString());
                if(this.edited.entity.requirements.length > 0) {
                    this.requirementsData.rows = this.requirements;
                    this.$refs.requirements.forceUpdate();
                }
            }
        },
        editInterface(id) {
            console.log("Edit interface " + id);
        },
        removedInterface(id) {
            console.log("Removed interface " + id);
        },
        saveChanges() {

        },
        cancelChanges() {
            this.$router.push('/slm');
        },
    },
    mounted() {
        // Add halo ring on focus to the date picker
        this.dpHookFocus();
        this.setupValidation();

        let t = this;
        const delayedData = setTimeout(function() {
            if(isValid(t.edited) && isValid(t.edited.entity)) {
                clearTimeout(delayedData);
                t.requirementsData.rows = t.requirements;
                t.$refs.requirements.forceUpdate();

                t.interfacesData.rows = t.interfaces;
                t.$refs.interfaces.forceUpdate();
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
.content .process {
    margin: 0 auto;
}
.content .process .header {
    justify-content: center;
    align-content: flex-start;
    margin: 0 auto 1rem;
    position: relative;
}
.process .operations {
    gap: .2rem;
    position: absolute;
    left: 0;
    top: 0;
    padding-top: 1.8rem;
    margin-left: .5rem;
    margin-bottom: 1rem;
}
.entity-type {
    text-align: left;
    font-family: "Barlow Condensed", sans-serif;
}
.process .header h2 {
    padding-top: .5rem;
}
.fade-top-border {
    border: 1px solid;
    border-image: linear-gradient(90deg, rgba(233,236,239,1), rgba(60,74,83,0)) 1;
    border-left: none;
    border-bottom:none;
    border-right:none;
}
.process .info {
    justify-content: center;
    margin: 0 auto;
}
.process .info > div {
    flex-direction: column;
    flex-wrap: nowrap;
}
.process .info > div:nth-child(1) > div {
    color: grey;
    text-align: right;
    margin-right: .2rem;
}
.process .info > div:nth-child(2) > div {
    text-align: left;
    margin-left: .2rem;
}
.process .info > div > div {
    white-space: nowrap;
    font-size: smaller;
}
.process .info .badge {
    padding-bottom: 2px!important;
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
.form-control-fix {
    padding-left: 35px!important;
    padding-right: 30px!important;
}
.process .requirements,
.process .interfaces {
    margin-bottom: 1rem;
}
</style>
