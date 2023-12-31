<template>
<div class="dt-flex justify-content-center footer">
    <div class="d-flex justify-content-between info">
        <div class="logo">
            <img alt="EGI logo" src="../assets/egi-logo-color.png"><br/>
            IMS Tools version {{ version }}<br/>
            {{ moduleDetails }}
        </div>
        <div class="d-flex details">
            <div class="d-flex flex-column infocol">
                <div class="title"><a href="https://www.egi.eu/services/" target="_blank">{{ $t('footer.services') }}</a></div>
                <div><a href="https://www.egi.eu/services/research/" target="_blank">{{ $t('footer.forRes') }}</a></div>
                <div><a href="https://www.egi.eu/services/business/" target="_blank">{{ $t('footer.forBus') }}</a></div>
                <div><a href="https://www.egi.eu/services/federation/" target="_blank">{{ $t('footer.forFed') }}</a></div>
            </div>
            <div class="d-flex flex-column infocol">
                <div class="title"><a href="https://www.egi.eu/solutions/" target="_blank">{{ $t('footer.solutions') }}</a></div>
                <div><a href="https://www.egi.eu/solution/batch-computing/" target="_blank">{{ $t('footer.batch') }}</a></div>
                <div><a href="https://www.egi.eu/solution/interactive-computing/" target="_blank">{{ $t('footer.interactive') }}</a></div>
                <div><a href="https://www.egi.eu/solution/federated-access/" target="_blank">{{ $t('footer.fedAccess') }}</a></div>
                <div><a href="https://www.egi.eu/solution/data-spaces/" target="_blank">{{ $t('footer.dataSpaces') }}</a></div>
                <div><a href="https://www.egi.eu/solution/data-federation/" target="_blank">{{ $t('footer.dataFed') }}</a></div>
                <div><a href="https://www.egi.eu/solution/service-hosting/" target="_blank">{{ $t('footer.hosting') }}</a></div>
                <div><a href="https://www.egi.eu/egi-for-eosc/" target="_blank">{{ $t('footer.eosc') }}</a></div>
            </div>
            <div class="d-flex flex-column infocol">
                <div class="title"><a href="https://www.egi.eu/resources/" target="_blank">{{ $t('footer.resources') }}</a></div>
                <div><a href="https://www.egi.eu/news/" target="_blank">{{ $t('footer.news') }}</a></div>
                <div><a href="https://www.egi.eu/publications/" target="_blank">{{ $t('footer.pubs') }}</a></div>
                <div><a href="https://www.egi.eu/training-materials/" target="_blank">{{ $t('footer.training') }}</a></div>
                <div><a href="https://www.egi.eu/event/egi2023/" target="_blank">{{ $t('footer.conf') }}</a></div>
            </div>
            <div class="d-flex flex-column infocol">
                <div class="title"><a href="https://www.egi.eu/about/" target="_blank">{{ $t('footer.about') }}</a></div>
                <div><a href="https://www.egi.eu/egi-foundation/" target="_blank">{{ $t('footer.foundation') }}</a></div>
                <div><a href="https://www.egi.eu/egi-federation/" target="_blank">{{ $t('footer.federation') }}</a></div>
                <div><a href="https://www.egi.eu/egi-infrastructure/" target="_blank">{{ $t('footer.infra') }}</a></div>
                <div><a href="https://www.egi.eu/egi-community/" target="_blank">{{ $t('footer.community') }}</a></div>
                <div><a href="https://www.egi.eu/egi-dih/" target="_blank">{{ $t('footer.dih') }}</a></div>
                <div><a href="https://www.egi.eu/egi-foundation/team/" target="_blank">{{ $t('footer.team') }}</a></div>
                <div><a href="https://www.egi.eu/jobs/" target="_blank">{{ $t('footer.jobs') }}</a></div>
                <div><a href="https://www.egi.eu/contact-us/" target="_blank">{{ $t('footer.contact') }}</a></div>
            </div>
        </div>
    </div>
    <div class="hr"/>
    <div class="d-flex justify-content-between bottom">
        <div class="d-flex copyright">
            <div>Copyright © 2023, EGI Foundation</div>
            <div><a href="https://www.egi.eu/terms-of-use/" target="_blank">{{ $t('footer.termsUse') }}</a></div>
            <div><a href="https://www.egi.eu/privacy-notice/" target="_blank">{{ $t('footer.privPolicy') }}</a></div>
            <div class="language dropup" data-bs-theme="dark">{{ $t('footer.language') }}:
                <a class="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" href="#">{{ languageNames[language] }}</a>
                <ul class="dropdown-menu">
                    <li v-for="lang in languages">
                        <a class="dropdown-item" href="#" @click="changeLanguage(lang, $event)" >{{ languageNames[lang] }}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="d-flex social">
            <div><a href="https://community.egi.eu/" target="_blank"><i class="bi bi-chat-quote-fill"/></a></div>
            <div><a href="https://twitter.com/EGI_eInfra" target="_blank"><i class="bi bi-twitter"/></a></div>
            <div><a href="https://www.linkedin.com/company/egi-foundation/" target="_blank"><i class="bi bi-linkedin"/></a></div>
            <div><a href="https://www.youtube.com/@EGI_eInfra" target="_blank"><i class="bi bi-youtube"/></a></div>
        </div>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import Package from "../../package.json";
import { store } from "@/store"
import i18n, { languages, languageNames } from '@/locales'

export default {
    name: 'imsFooter',
    props: {
        moduleName: String
    },
    data() {
        return {
            version: Package.version,
            languages: languages,
            languageNames: languageNames,
            processInfo: store.state.ims?.processInfo,
        }
    },
    computed: {
        language() { return store.getters["ims/language"]; },
        moduleVersion() { return isValid(this.processInfo) ? this.processInfo.apiVersion : "?"; },
        moduleDetails() {
            if(isValid(this.$props.moduleName))
                return this.$props.moduleName + " version " + this.moduleVersion;

            return "";
        }
    },
    methods: {
        changeLanguage(newLang, event) {
            event.preventDefault();
            store.dispatch('ims/changeLocale', newLang);
        },
        switchProcess() {
            const ims = store.state.ims;
            this.processInfo = ims.processInfo;
        }
    },
    created() {
        const savedLocale = this.language;
        if(!isValid(savedLocale))
            store.dispatch("ims/changeLocale", i18n.global.locale);
        else if(savedLocale !== i18n.global.locale)
            store.dispatch("ims/changeLocale", savedLocale);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
:root {
    --footer-horizontal-width: 765px;
    --footer-horizontal-height: 19.8125rem;
}
</style>
<style scoped>
.footer {
    --footer-background-color: #282a2d;
    --footer-color: #5b5d5b;
    font-size: calc(var(--font-scale) * var(--bs-dropdown-font-size));
    background-color: var(--footer-background-color);
    color: var(--footer-color);
    flex-direction: column;
    margin-top: auto;
}
.footer .info {
    max-width: var(--max-content-width);
    padding: 3rem 1rem 1rem;
    margin: 0 auto;
}
.footer .logo {
    min-width: 8rem;
    text-align: left;
    margin-bottom: 1rem;
    padding-left: .5rem;
}
.footer .logo img {
    max-height: 60px;
    margin-bottom: 1rem;
}
.footer .details {
    gap: 1rem;
}
.footer .infocol {
    text-align: left;
}
.footer .title {
    font-weight: bold;
}

@media screen and (max-width: 765px) {
    .footer .info,
    .footer .details {
        flex-direction: column;
    }
    .footer .logo {
        text-align: center;
        padding-left: 0;
    }
    .footer .infocol {
        text-align: center;
    }
}

.hr {
    border: none;
    background-color: #333538;
    height: 1px!important;
    opacity: 0.5;
    clear: both;
}
.footer .bottom {
    flex-direction: row;
    margin: auto auto 1rem;
    padding: 1rem;
    max-width: var(--max-content-width);
}
.footer .language {
    margin-left: .7rem;
}
.footer .copyright,
.footer .social  {
    gap: .5rem;
}
.footer .social {
    font-size: larger;
}
.dropdown-menu {
    font-size: calc(var(--font-scale) * var(--bs-dropdown-font-size));
}

@media screen and (max-width: 765px) {
    .footer .bottom {
        flex-direction: column;
        gap: .7rem;
    }
    .footer .language {
        margin-left: 0;
    }
    .footer .copyright {
        flex-direction: column;
        gap: 0;
    }
    .footer .social {
        font-size: larger;
        margin-left: auto;
        margin-right: auto;
    }
}

a {
    text-decoration: none;
    color: #7d807d;
}
.footer .title a {
    color: white;
}
a:hover,
.footer .title a:hover {
    color: #b0c2d2;
}
</style>
