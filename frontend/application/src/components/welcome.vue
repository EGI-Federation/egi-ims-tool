<template>
<div class="d-flex justify-content-center welcome">
    <div class="me-3 sizer"><img alt="EGI logo" src="../assets/egi-logo-color.png"></div>
    <div class="sizer">
        <div class="greet">{{ $t('welcome.greet') }}</div>
        <div class="text-nowrap title fade-top-border">{{ $t('welcome.imsTitle') }}</div>
        <div class="explain">
            <a href="#explanation" class="what" @click="explain"
               role="button" data-bs-toggle="collapse" :aria-expanded="explaining" aria-controls="explanation"
               >{{ explainText }} <i :class="explainIcon"/></a>
        </div>
    </div>
</div>

<div class="collapse pt-3" id="explanation">
    <p class="mt-3 mb-3">
        {{ $t('welcome.imsPartsIntro') }}:
    </p>
    <div class="d-flex justify-content-center ism-blocks">
        <ims-component
            :title="$t('welcome.cmsTitle')"
            code="CMS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            :description="$t('welcome.cmsDesc')"
            :scope="$t('welcome.cmsScope')"
        />
        <ims-component
            :title="$t('welcome.smsTitle')"
            code="SMS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            :description="$t('welcome.smsDesc')"
            :scope="$t('welcome.smsScope')"
        />
        <ims-component
            :title="$t('welcome.itsmsTitle')"
            code="ITSMS"
            standard="ISO/IEC 20000"
            link="https://www.iso.org/standard/70636.html"
            :description="$t('welcome.itsmsDesc')"
            :scope="$t('welcome.itsmsScope')"
        />
        <ims-component
            :title="$t('welcome.pmisTitle')"
            code="PMIS"
            standard="ISO 9000"
            link="https://www.iso.org/standard/45481.html"
            :description="$t('welcome.pmisDesc')"
            :scope="$t('welcome.pmisScope')"
        />
        <ims-component
            :title="$t('welcome.ismsTitle')"
            code="ISMS"
            standard="ISO/IEC 27001"
            link="https://www.iso.org/standard/27001"
            :description="$t('welcome.ismsDesc')"
            :scope="$t('welcome.ismsScope')"
        />
    </div>
    <p class="mt-3 mb-0">
        {{ $t('welcome.imsBasedOn') }} <a href="https://www.fitsm.eu/" target="_blank">FitSM</a>.
    </p>
</div>
</template>

<script>
// @ is an alias to /src
import imsComponent from "@/components/imsComponent.vue";

export default {
    name: 'Welcome',
    components: { imsComponent },
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
    padding-top: 2rem;
    margin: 0 auto 3rem auto;
    max-width: fit-content;
    align-items: stretch;
    height: 5rem;
}
.welcome .sizer {
    flex: 1;
}
.welcome .sizer:first-of-type {
    display: flex;
    max-width: 100px;
}
.welcome img {
    height: 100%;
    padding-top: 2px;
    padding-bottom: 6px;
}
.welcome .greet {
    text-align: left;
    font-family: "Barlow Condensed", sans-serif;
}
.welcome .title {
    font-family: Anton, sans-serif;
    font-size: calc(2.7 * var(--bs-body-font-size));
}
.fade-top-border {
    border: 1px solid;
    border-image: linear-gradient(90deg, rgba(233,236,239,1), rgba(60,74,83,0)) 1;
    border-left: none;
    border-bottom:none;
    border-right:none;
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

@media screen and (max-width: 880px) {
    .welcome .sizer:first-of-type {
        display: none;
    }
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
