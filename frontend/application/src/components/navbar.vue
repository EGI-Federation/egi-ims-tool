<template>
<nav class="navbar sticky-top navbar-expand-md bg-body-tertiary p-0">
    <div class="d-flex flex-nowrap left">
        <!-- Logo Start -->
        <router-link to="/" class="navbar-brand">
            <img alt="EGI logo" src="../assets/logo.png">
        </router-link>
        <!-- Logo End -->
        <!-- Search Start -->
        <form class="d-flex" role="search">
            <input class="form-control me-2" type="search"
                   :placeholder="$t('navbar.search')"
                   :aria-label="$t('navbar.search')">
        </form>
        <!-- Search End -->
    </div>
    <div class="d-flex flex-nowrap right">
        <!-- Menu Start -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="navbarIMS" aria-labelledby="navbarIMSLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="navbarIMSLabel">{{ $t('navbar.offcanvas') }}</h5>
                <button type="button" class="btn-close btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <ul class="navbar-nav navbar-nav-scroll me-auto" style="--bs-scroll-height: 80vh;">
                    <li v-if="isAdmin" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="systemMenu" role="button" data-bs-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false" @click="closeSubMenus" href="#">
                            {{ $t('navbar.manageSys') }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="systemMenu">
                            <li><router-link class="dropdown-item" to="/system/config">{{ $t('navbar.config') }}</router-link></li>
                            <li><router-link class="dropdown-item" to="/system/plans">{{ $t('navbar.plans') }}</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="modulesMenu" role="button" data-bs-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false" @click="closeSubMenus" href="#">
                            {{ isProcess ? $t('navbar.otherProcesses') : $t('navbar.processes') }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="modulesMenu">
                            <li class="dropdown-submenu dropstart">
                                <a class="dropdown-item dropdown-toggle" id="governanceSubMenu" aria-haspopup="true" aria-expanded="false"
                                   data-bs-toggle="dropdown" @click="toggleGovernanceSubMenu" href="#">
                                    {{ $t('navbar.gov') }}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="governanceSubMenu" ref="governanceSubMenu">
                                    <li v-if="!('BA' === moduleName)"><router-link class="dropdown-item" to="/ba">{{ $t('home.BA') }}</router-link></li>
                                    <li v-if="!('BDS' === moduleName)"><router-link class="dropdown-item" to="/bds">{{ $t('home.BDS') }}</router-link></li>
                                    <li v-if="!('COM' === moduleName)"><router-link class="dropdown-item" to="/com">{{ $t('home.COM') }}</router-link></li>
                                    <li v-if="!('FA' === moduleName)"><router-link class="dropdown-item" to="/fa">{{ $t('home.FA') }}</router-link></li>
                                    <li v-if="!('HR' === moduleName)"><router-link class="dropdown-item" to="/hr">{{ $t('home.HR') }}</router-link></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu dropstart">
                                <a class="dropdown-item dropdown-toggle" id="projectsSubMenu" aria-haspopup="true" aria-expanded="false"
                                   data-bs-toggle="dropdown" @click="toggleProjectsSubMenu" href="#">
                                    {{ $t('navbar.projects') }}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="projectsSubMenu" ref="projectsSubMenu">
                                    <li v-if="!('CPM' === moduleName)"><router-link class="dropdown-item" to="cpm">{{ $t('home.CPM') }}</router-link></li>
                                    <li v-if="!('PPC' === moduleName)"><router-link class="dropdown-item" to="/ppc">{{ $t('home.PPC') }}</router-link></li>
                                    <li v-if="!('PPM' === moduleName)"><router-link class="dropdown-item" to="/ppm">{{ $t('home.PPM') }}</router-link></li>
                                    <li v-if="!('PKM' === moduleName)"><router-link class="dropdown-item" to="/pkm">{{ $t('home.PKM') }}</router-link></li>
                                </ul>
                            </li>
                            <li><hr class="dropdown-divider"/></li>
                            <li v-if="!('CAPM' === moduleName)"><router-link class="dropdown-item" to="/capm">{{ $t('home.CAPM') }}</router-link></li>
                            <li v-if="!('CHM' === moduleName)"><router-link class="dropdown-item" to="/chm">{{ $t('home.CHM') }}</router-link></li>
                            <li v-if="!('CONFM' === moduleName)"><router-link class="dropdown-item" to="/confm">{{ $t('home.CONFM') }}</router-link></li>
                            <li v-if="!('CSI' === moduleName)"><router-link class="dropdown-item" to="/csi">{{ $t('home.CSI') }}</router-link></li>
                            <li v-if="!('CRM' === moduleName)"><router-link class="dropdown-item" to="/crm">{{ $t('home.CRM') }}</router-link></li>
                            <li v-if="!('ISM' === moduleName)"><router-link class="dropdown-item" to="/ism">{{ $t('home.ISM') }}</router-link></li>
                            <li v-if="!('ISRM' === moduleName)"><router-link class="dropdown-item" to="/isrm">{{ $t('home.ISRM') }}</router-link></li>
                            <li v-if="!('PM' === moduleName)"><router-link class="dropdown-item" to="/pm">{{ $t('home.PM') }}</router-link></li>
                            <li v-if="!('RDM' === moduleName)"><router-link class="dropdown-item" to="/rdm">{{ $t('home.RDM') }}</router-link></li>
                            <li v-if="!('RM' === moduleName)"><router-link class="dropdown-item" to="/rm">{{ $t('home.RM') }}</router-link></li>
                            <li v-if="!('SACM' === moduleName)"><router-link class="dropdown-item" to="/sacm">{{ $t('home.SACM') }}</router-link></li>
                            <li v-if="!('SUPPM' === moduleName)"><router-link class="dropdown-item" to="/suppm">{{ $t('home.SUPPM') }}</router-link></li>
                            <li v-if="!('SLM' === moduleName)"><router-link class="dropdown-item" to="/slm">{{ $t('home.SLM') }}</router-link></li>
                            <li v-if="!('SPM' === moduleName)"><router-link class="dropdown-item" to="/spm">{{ $t('home.SPM') }}</router-link></li>
                            <li v-if="!('SRM' === moduleName)"><router-link class="dropdown-item" to="/srm">{{ $t('home.SRM') }}</router-link></li>
                        </ul>
                    </li>
                    <li v-if="isProcess" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="processMenu" role="button" data-bs-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false" @click="closeSubMenus" href="#">
                            {{ $t('navbar.thisProcess') }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="processMenu">
                            <ba-menu v-if="('BA' === moduleName)"/>
                            <bds-menu v-if="('BDS' === moduleName)"/>
                            <com-menu v-if="('COM' === moduleName)"/>
                            <fa-menu v-if="('FA' === moduleName)"/>
                            <hr-menu v-if="('HR' === moduleName)"/>
                            <slm-menu v-if="('SLM' === moduleName)"/>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Menu End -->
        <!-- User Start -->
        <div class="d-inline-flex flex-nowrap gap-1 user">
            <a href="#" class="user-info bg-body-secondary" role="button"><span class="badge-notif animation-blink"></span><i class="bi bi-bell"></i></a>
            <a href="#" class="user-info bg-body-secondary" role="button"><i class="bi bi-person-square"></i></a>
        </div>
        <!-- User End -->
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#navbarIMS" aria-controls="navbarIMS"
                aria-expanded="false" :aria-label="$t('navbar.toggle')">
            <i class="bi bi-list"></i>
        </button>
    </div>
</nav>
</template>

<script>
// @ is an alias to /src
import { isValid } from '@/utils'
import { store } from "@/store"
import baMenu from "@/components/baMenu.vue";
import bdsMenu from "@/components/bdsMenu.vue";
import comMenu from "@/components/comMenu.vue";
import faMenu from "@/components/faMenu.vue";
import hrMenu from "@/components/hrMenu.vue";
import slmMenu from "@/components/slmMenu.vue";

export default {
    name: 'IsmNavbar',
    components: { baMenu, bdsMenu, comMenu, faMenu, hrMenu, slmMenu },
    props: {
        moduleName: String,
    },
    data() {
        return {
            test: true,
        }
    },
    computed: {
        isAdmin() { return store.state.isAdmin; },
        isProcess() { return isValid(this.$props.moduleName) && this.$props.moduleName.length > 0; },
    },
    methods: {
        menuItem(item) {
            if(item.isSeparator)
                return "<hr class='dropdown-divider'/>";

            return "<a class='dropdown-item' href='" + item.link + "'>" + item.text + "</a>";
        },
        toggleGovernanceSubMenu(event) {
            event.stopPropagation();
            if(isValid(this.$refs.projectsSubMenu))
                this.$refs.projectsSubMenu.style.display = "none";
            if(isValid(this.$refs.governanceSubMenu)) {
                const display = this.$refs.governanceSubMenu.style.display;
                this.$refs.governanceSubMenu.style.display = "block" === display ? "none" : "block";
            }
        },
        toggleProjectsSubMenu(event) {
            event.stopPropagation();
            if(isValid(this.$refs.governanceSubMenu))
                this.$refs.governanceSubMenu.style.display = "none";
            if(isValid(this.$refs.projectsSubMenu)) {
                const display = this.$refs.projectsSubMenu.style.display;
                this.$refs.projectsSubMenu.style.display = "block" === display ? "none" : "block";
            }
        },
        closeSubMenus(event) {
            if(isValid(this.$refs.governanceSubMenu))
                this.$refs.governanceSubMenu.style.display = "none";
            if(isValid(this.$refs.projectsSubMenu))
                this.$refs.projectsSubMenu.style.display = "none";
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
    flex-wrap: nowrap;
    justify-content: space-between;
}
.navbar .left {
    margin: 8px .5rem 8px 1rem;
    justify-content: center;
}
.navbar-brand img {
    max-height: 30px;
}
.navbar input {
    min-width: 3rem;
}
.navbar .right {
    margin-right: .5rem;
    padding-top: 12px;
    padding-bottom: 4px;
}
.navbar .right .user {
    margin: 0 .3rem;
}
.navbar .right .user-info,
.navbar .right .navbar-toggler {
    font-size: x-large;
    font-weight: bolder;
    position: relative;
    top: -4px;
    padding-top: 5px;
}
.navbar .right .user-info {
    color: #707070;
    margin-right: .3rem;
    border-radius: .3rem;
    width: 2.5rem;
}
.badge-notif {
    width: 8px;
    height: 8px;
    background: #d6293e;
    border-radius: 50%;
    position: absolute;
    top: 0;
    right: -3px;
    z-index: 1;
}
.offcanvas.show .dropdown-menu.show {
    text-align: center;
}
</style>