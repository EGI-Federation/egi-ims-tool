<template>
<welcome/>
<div v-if="store.state.loggedIn" class="d-flex flex-wrap ism-modules">
    <ism-module
        title="Budgeting and Accounting"
        code="BA"
        icon="sliders"
    />
    <ism-module
        title="Business Development and Stakeholders"
        code="BDS"
        icon="stack-overflow"
    />
    <ism-module
        title="Capacity Management"
        code="CAPM"
        icon="sliders"
    />
    <ism-module
        title="Change Management"
        code="CHM"
        icon="sliders"
    />
    <ism-module
        title="Communications Management"
        code="COM"
        icon="stack-overflow"
    />
    <ism-module
        title="Configuration Management"
        code="CONFM"
        icon="sliders"
    />
    <ism-module
        title="Continual Service Improvement"
        code="CSI"
        icon="stack-overflow"
    />
    <ism-module
        title="Customer Relationship Management"
        code="CRM"
        icon="sliders"
    />
    <ism-module
        title="Coordinated Project Management"
        code="CPM"
        icon="stack-overflow"
    />
    <ism-module
        title="Finance Administration"
        code="FA"
        icon="sliders"
    />
    <ism-module
        title="Human Resources"
        code="HR"
        icon="stack-overflow"
    />
    <ism-module
        title="Information Security Management"
        code="ISM"
        icon="sliders"
    />
    <ism-module
        title="Incident and Service Request Management"
        code="ISRM"
        icon="stack-overflow"
    />
    <ism-module
        title="Participated Project Coordination"
        code="PPC"
        icon="sliders"
    />
    <ism-module
        title="Problem Management"
        code="PM"
        icon="stack-overflow"
    />
    <ism-module
        title="Project Knowledge Management"
        code="PKM"
        icon="sliders"
    />
    <ism-module
        title="Project Portfolio Management"
        code="PPM"
        icon="stack-overflow"
    />
    <ism-module
        title="Release and Deployment Management"
        code="RDM"
        icon="sliders"
    />
    <ism-module
        title="Risk Management"
        code="RM"
        icon="stack-overflow"
    />
    <ism-module
        title="Service Availability and Continuity Management"
        code="SACM"
        icon="sliders"
    />
    <ism-module
        title="Supplier Relationship Management"
        code="SUPPM"
        icon="stack-overflow"
    />
    <ism-module
        title="Service Level Management"
        code="SLM"
        icon="sliders"
        active=true
    />
    <ism-module
        title="Service Portfolio Management"
        code="SPM"
        icon="stack-overflow"
    />
    <ism-module
        title="Service Reporting Management"
        code="SRM"
        icon="sliders"
    />
</div>
</template>

<script>
// @ is an alias to /src
import { store } from "@/main"
import Welcome from "@/components/welcome.vue";
import IsmModule from "@/components/ismModule.vue";

export default {
    name: 'Home',
    computed: {
        store() {
            return store
        }
    },
    components: { Welcome, IsmModule },
    data() {
        return {
            test: false,
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.ism-modules {
    gap: .7rem;
    margin: 3rem 5rem 5rem;
    padding: 0;
    justify-content: center;
}
</style>
