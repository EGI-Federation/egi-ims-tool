<template>
<div class="d-flex justify-content-center welcome">
    <div><img alt="EGI logo" src="../assets/logo.png"></div>
    <div>
        <div class="greet">Welcome to the</div>
        <div class="display-6 text-nowrap title">EGI Integrated Management System</div>
        <div class="explain">
            <a href="#explanation" class="what" @click="explain"
               role="button" data-bs-toggle="collapse" :aria-expanded="explaining" aria-controls="explanation"
               >{{ explainText }} <i :class="explainIcon"/></a>
        </div>
    </div>
</div>

<div class="collapse" id="explanation">
    <p class="mt-3 mb-3">
        Integrated Management System (IMS) is an umbrella term that encompasses the following parts:
    </p>
    <div class="d-flex ism-blocks">
        <ism-component
            title="Core Management System"
            code="CMS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            description="Plan, implement, monitor and continually improve all services and processes under the responsibility of the EGI Foundation."
            scope="All processes, services, and projects"
        />
        <ism-component
            title="General Service Management"
            code="SMS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            description="Deliver all services covered by the service catalogue of the EGI Foundation."
            scope="All services"
        />
        <ism-component
            title="IT Service Management"
            code="ITSMS"
            standard="ISO/IEC 20000"
            link="https://www.iso.org/standard/70636.html"
            description="Deliver all IT services covered by the service catalogue of the EGI Foundation."
            scope="IT services"
        />
        <ism-component
            title="Project Management Information System"
            code="PMIS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            description="Support all aspects of portfolio and project management. It provides the logical organization of the information required for an organization to enter into and execute projects successfully."
            scope="Externally funded projects"
        />
        <ism-component
            title="Information Security Management System"
            code="ISMS"
            standard="ISO/IEC 27001"
            link="https://www.iso.org/standard/27001"
            description="Helps maintain an adequate level of information security and address risks to information security"
            scope="Processes, activities, tools, and technology to deliver infrastructure and business support services"
        />
    </div>
    <p class="mt-3">
        The EGI IMS is based on
        <a href="https://www.fitsm.eu/" target="_blank">FitSM</a> and is documented in
        <a href="https://confluence.egi.eu/display/IMS/Integrated+Management+System+%28IMS%29+Home" target="_blank">Confluence</a>.
    </p>
</div>
</template>

<script>
// @ is an alias to /src
import IsmComponent from "@/components/ismComponent.vue";

const explainWhat = "What is it?";
const explainHide = "Hide explanation";

export default {
    name: 'Welcome',
    components: { IsmComponent },
    data() {
        return {
            explaining: false,
            explainText: explainWhat,
            explainIcon: "bi bi-chevron-down",
        }
    },
    methods: {
        explain(event) {
            this.explaining = !this.explaining;
            if(this.explaining) {
                this.explainText = explainHide;
                this.explainIcon = "bi bi-chevron-up";
            }
            else {
                this.explainText = explainWhat;
                this.explainIcon = "bi bi-chevron-down";
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.welcome {
    gap: 1rem;
    margin: 2rem auto 0 auto;
    max-width: fit-content;
}
.welcome img {
    margin-top: 5px;
    max-height: 60px;
}
.welcome .greet {
    text-align: left;
    font-family: "Barlow Condensed", sans-serif;
}
.welcome .title {
    border-top: 1px solid lightgrey;
    font-family: Anton, sans-serif;
}
.explain {
    text-align: right;
}
.what {
    cursor: pointer;
    text-decoration: none;
    color: lightgray;
}
.what:hover {
    color: #797979;
}
.ism-blocks {
    gap: .7rem;
    margin: 0 6rem;
    padding: 0;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
