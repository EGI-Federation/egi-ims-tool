<template>
<div class="d-flex justify-content-center welcome">
    <div><img alt="EGI logo" src="../assets/logo.png"></div>
    <div>
        <div class="greet">{{ $t('welcome.greet') }}</div>
        <div class="display-6 text-nowrap title">{{ $t('welcome.imsTitle') }}</div>
        <div class="explain">
            <a href="#explanation" class="what" @click="explain"
               role="button" data-bs-toggle="collapse" :aria-expanded="explaining" aria-controls="explanation"
               >{{ explainText }} <i :class="explainIcon"/></a>
        </div>
    </div>
</div>

<div class="collapse" id="explanation">
    <p class="mt-3 mb-3">
        {{ $t('welcome.imsPartsIntro') }}:
    </p>
    <div class="d-flex justify-content-center ism-blocks">
        <ism-component
            :title="$t('welcome.cmsTitle')"
            code="CMS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            :description="$t('welcome.cmsDesc')"
            :scope="$t('welcome.cmsScope')"
        />
        <ism-component
            :title="$t('welcome.smsTitle')"
            code="SMS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            :description="$t('welcome.smsDesc')"
            :scope="$t('welcome.smsScope')"
        />
        <ism-component
            :title="$t('welcome.itsmsTitle')"
            code="ITSMS"
            standard="ISO/IEC 20000"
            link="https://www.iso.org/standard/70636.html"
            :description="$t('welcome.itsmsDesc')"
            :scope="$t('welcome.itsmsScope')"
        />
        <ism-component
            :title="$t('welcome.pmisTitle')"
            code="PMIS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            :description="$t('welcome.pmisDesc')"
            :scope="$t('welcome.pmisScope')"
        />
        <ism-component
            :title="$t('welcome.ismsTitle')"
            code="ISMS"
            standard="ISO/IEC 27001"
            link="https://www.iso.org/standard/27001"
            :description="$t('welcome.ismsDesc')"
            :scope="$t('welcome.ismsScope')"
        />
    </div>
    <p class="mt-3">
        {{ $t('welcome.imsBasedOn') }}
        <a href="https://www.fitsm.eu/" target="_blank">FitSM</a> {{ $t('welcome.imsDocumentedIn') }}
        <a href="https://confluence.egi.eu/display/IMS/Integrated+Management+System+%28IMS%29+Home" target="_blank">Confluence</a>.
    </p>
</div>
</template>

<script>
// @ is an alias to /src
import IsmComponent from "@/components/ismComponent.vue";

export default {
    name: 'Welcome',
    components: { IsmComponent },
    data() {
        return {
            explaining: false,
            explainText: this.$t('welcome.whatIs'),
            explainIcon: "bi bi-chevron-down",
        }
    },
    methods: {
        explain(event) {
            this.explaining = !this.explaining;
            if(this.explaining) {
                this.explainText = this.$t('welcome.hideExplain');
                this.explainIcon = "bi bi-chevron-up";
            }
            else {
                this.explainText = this.$t('welcome.whatIs');
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
    font-size: small;
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
