<template>
<div class="process">
    <h2>Service Level Management (SLM)</h2>
    <div class="d-flex flex-nowrap info">
        <div>
            <div>{{ $t('home.procOwner') }} :</div>
            <div>{{ $t('home.procManager') }} :</div>
            <div>{{ $t('home.version') }} :</div>
            <div>{{ $t('home.status') }} :</div>
            <div>{{ $t('home.approved') }} :</div>
            <div>{{ $t('home.reviewFrequency') }} :</div>
            <div>{{ $t('home.reviewNext') }} :</div>
            <div>{{ $t('home.contact') }} :</div>
        </div>
        <div>
            <div>{{ current.entity.owner ? current.entity.owner.fullName : $t('home.notSet') }}</div>
            <div>{{ processManager }}</div>
            <div>{{ processVersion }}</div>
            <div><span :class="processStatus.pillClass">{{ processStatus.label }}</span></div>
            <div>{{ approvalStatus }}</div>
            <div>{{ nextReview.frequency }}</div>
            <div>{{ nextReview.when }}</div>
            <div>{{ contact }}</div>
        </div>
    </div>
    <div class="details">
        <h3>{{ $t('home.goals') }}</h3>
        <vue3-markdown-it :source='goals' />
        <h3>{{ $t('home.scope') }}</h3>
        <vue3-markdown-it :source='scope' />
        <h3>{{ $t('home.requirements') }}</h3>
        <div class="requirements">
            <div id="requirements"/>
            <p v-if="!current.entity.requirements || 0 === current.entity.requirements.length">{{ $t('home.notDef') }}</p>
        </div>
        <h3>{{ $t('home.inputOutput') }}</h3>
        <div class="interfaces">
            <div id="interfaces"/>
            <p v-if="!current.entity.interfaces || 0 === current.entity.interfaces.length">{{ $t('home.notDef') }}</p>
        </div>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import { isValid, formatDate, formatNextEvent } from '@/utils'
import VueMarkdownIt from 'vue3-markdown-it';
import MarkdownIt from 'markdown-it';
import { Grid, html } from "gridjs";
import { Roles, findUsersWithRole } from "@/roles";

var mdRender = new MarkdownIt();

export default {
    name: 'imsProcessInfo',
    components: { VueMarkdownIt, Grid },
    props: {
        info: Object,
    },
    data() {
        return {
            requirementsGrid: new Grid(),
            requirementsHeader: [
                this.$t('home.code'),
                {
                    name: this.$t('home.requirement'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                this.$t('home.source'),
                {
                    name: this.$t('home.responsible'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                }],
            interfacesGrid: new Grid(),
            interfacesHeader: [
                this.$t('home.type'),
                {
                    name: this.$t('home.interface'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(cell) : "",
                    sort: true,
                },
                {
                    name: this.$t('slm.relevantMaterial'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                },
                {
                    name: this.$t('home.description'),
                    formatter: (cell) => (cell && cell.length > 0) ? html(mdRender.render(cell)) : "",
                }],
        }
    },
    computed: {
        current() { return this.$props.info.current; },
        approved() { return this.$props.info.approved; },
        contact() { return isValid(this.current) ? this.current.contact : this.$t('home.notSet'); },
        processVersion() { return isValid(this.current) ? this.current.version : "?"; },
        processStatus() {
            if("READY_FOR_APPROVAL" === this.current.entity.status)
                return { label: this.$t("slm.statusReadyForApproval"), pillClass: "badge rounded-pill bg-info" };
            else if("APPROVED" === this.current.entity.status)
                return { label: this.$t("slm.statusApproved"), pillClass: "badge rounded-pill bg-success" };
            else if("DEPRECATED" === this.current.entity.status)
                return { label: this.$t("slm.statusDeprecated"), pillClass: "badge rounded-pill bg-danger" };

            return { label: this.$t("slm.statusDraft"), pillClass: "badge bg-secondary" };
        },
        processManager() {
            let pms = findUsersWithRole(Roles.SLM.PROCESS_MANAGER, true);
            if(isValid(pms) && pms.length > 0) {
                let pm = pms[0];
                return pm.fullName;
            }
            return this.$t('home.notSet');
        },
        approvalStatus() {
            if(!isValid(this.approved) ||
               !isValid(this.approved.entity) ||
               !isValid(this.approved.entity.approver))
                return 'No';

            let prefix = '';
            if(this.current.version !== this.approved.version)
                prefix = `${this.$t("home.version")} ${this.approved.version} ${this.$t("home.approvedOn")} `;

            return prefix + `${formatDate(this.approved.entity.approvedOn)} ${this.$t("home.by")} ${this.approved.entity.approver.fullName}`;
        },
        nextReview() {
            return formatNextEvent(this.current.entity.reviewFrequency,
                                   this.current.entity.frequencyUnit,
                                   this.current.entity.nextReview,
                                   this.$t);
        },
        goals() {
            return isValid(this.current.entity.goals) ?
                this.current.entity.goals :
                this.$t('home.notSet');
        },
        scope() {
            return isValid(this.current.entity.scope) ?
                this.current.entity.scope :
                this.$t('home.notSet');
        },
        requirements() {
            let r = [];
            if(isValid(this.current.entity.requirements)) {
                for(let req of this.current.entity.requirements) {
                    let row = [
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
                }
            }
            return r;
        },
        interfaces() {
            let i = [];
            if(isValid(this.current.entity.interfaces)) {
                for(let itf of this.current.entity.interfaces) {
                    const _from = this.$t("slm.from");
                    const _to = this.$t("slm.to");
                    let prefix = "in" === itf.direction.substr(0,2).toLowerCase() ? _from : _to;
                    let interfacesWith = "";
                    if(isValid(itf.interfacesWith)) {
                        interfacesWith = itf.interfacesWith;
                        const itfw = interfacesWith.toLowerCase();
                        if("internal" !== itfw && "external" !== itfw)
                            interfacesWith = prefix + "<br/>" + interfacesWith;
                    }
                    let row = [
                        isValid(itf.direction) ? itf.direction : "",
                        interfacesWith,
                        isValid(itf.relevantMaterial) ? itf.relevantMaterial : "",
                        isValid(itf.description) ? itf.description : ""
                    ];
                    i.push(row);
                }
            }
            return i;
        }
    },
    methods: {
        test() {
            return false;
        }
    },
    mounted() {
        // Set up the requirements grid
        this.requirementsGrid.updateConfig({
            columns: this.requirementsHeader,
            data: this.requirements,
            width: '100%',
            resizable: true
        });
        this.requirementsGrid.render(document.getElementById("requirements"));

        // Set up the interfaces grid
        this.interfacesGrid.updateConfig({
            columns: this.interfacesHeader,
            data: this.interfaces,
            width: '100%',
            resizable: true
        });
        this.interfacesGrid.render(document.getElementById("interfaces"));
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.process {
    max-width: 60rem;
    margin: 0 auto 2rem;
}
.process .info {
    justify-content: center;
    margin: 0 auto 1rem;
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
    border-bottom: 1px solid lightgray;
}
.gridjs-td > span > :last-child {
    margin-bottom: 0!important;
}
.process .requirements,
.process .interfaces {
    margin-bottom: 1rem;
}
</style>
