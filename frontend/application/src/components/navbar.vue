<template>
<nav class="navbar sticky-top navbar-expand-md bg-body-tertiary p-0">
    <div class="d-flex flex-nowrap left">
        <!-- Logo Start -->
        <router-link to="/" class="navbar-brand">
            <img alt="EGI logo" src="../assets/egi-logo-color.png">
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
                <button type="button" class="btn-close btn-close" data-bs-dismiss="offcanvas" :aria-label="$t('ims.close')"></button>
            </div>
            <div class="offcanvas-body">
                <ul class="navbar-nav navbar-nav-scroll me-auto" style="--bs-scroll-height: 80vh;">
                    <!-- Management System menu -->
                    <li v-if="canUseTool" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="systemMenu" role="button" data-bs-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false" @click="closeSubMenus" href="#">
                            {{ $t('navbar.manageSys') }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="systemMenu">
                            <li><router-link class="dropdown-item" to="/system">{{ $t('navbar.overview') }}</router-link></li>
                            <li v-if="isAdmin"><router-link class="dropdown-item" to="/system/config">{{ $t('navbar.config') }}</router-link></li>
                            <li><router-link class="dropdown-item" to="/system/roles">{{ $t('navbar.roles') }}</router-link></li>
                            <li><router-link class="dropdown-item" to="/system/plans">{{ $t('navbar.plans') }}</router-link></li>
                        </ul>
                    </li>
                    <!-- Other Processes menu -->
                    <li v-if="canUseTool" class="nav-item dropdown">
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
                                    <li v-if="!('CPM' === moduleName)"><router-link class="dropdown-item" to="/cpm">{{ $t('home.CPM') }}</router-link></li>
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
                    <!-- This Process menu -->
                    <li v-if="canUseTool && isProcess" class="nav-item dropdown">
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
                            <cpm-menu v-if="('CPM' === moduleName)"/>
                            <pkm-menu v-if="('PKM' === moduleName)"/>
                            <ppc-menu v-if="('PPC' === moduleName)"/>
                            <ppm-menu v-if="('PPM' === moduleName)"/>
                            <capm-menu v-if="('CAPM' === moduleName)"/>
                            <chm-menu v-if="('CHM' === moduleName)"/>
                            <confm-menu v-if="('CONFM' === moduleName)"/>
                            <csi-menu v-if="('CSI' === moduleName)"/>
                            <crm-menu v-if="('CRM' === moduleName)"/>
                            <ism-menu v-if="('ISM' === moduleName)"/>
                            <isrm-menu v-if="('ISRM' === moduleName)"/>
                            <pm-menu v-if="('PM' === moduleName)"/>
                            <rdm-menu v-if="('RDM' === moduleName)"/>
                            <rm-menu v-if="('RM' === moduleName)"/>
                            <sacm-menu v-if="('SACM' === moduleName)"/>
                            <suppm-menu v-if="('SUPPM' === moduleName)"/>
                            <slm-menu v-if="('SLM' === moduleName)"/>
                            <spm-menu v-if="('SPM' === moduleName)"/>
                            <srm-menu v-if="('SRM' === moduleName)"/>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Menu End -->
        <!-- User Start -->
        <div class="d-inline-flex flex-nowrap gap-1 user">
            <div class="d-flex flex-nowrap user-info">
                <a class="bg-body-secondary" role="button" href="#" >
                    <span :class="unreadNotificationCount ? 'badge-notif' : ''"></span>
                    <i class="bi bi-bell"/>
                </a>
            </div>
            <div class="d-flex flex-nowrap user-info">
                <a class="bg-body-secondary dropdown" id="userProfile" role="button" aria-expanded="false"
                   data-bs-auto-close="outside" data-bs-display="static" data-bs-toggle="dropdown" href="#">
                    <i class="bi bi-sliders"/>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userProfile">
                    <!-- Profile info -->
                    <li class="px-3">
                        <div class="d-flex align-items-center">
                            <!-- Avatar -->
                            <div class="avatar me-3">
                                <i class="bi bi-person-circle"/>
                                <i :class="highAssurance ? 'bi bi-shield-fill-plus badge-assurance high' : 'bi bi-shield-fill-minus badge-assurance low'"></i>
                            </div>
                            <div>
                                <p class="h5 mb-1 user-details">{{ userFullName }}</p>
                                <p class="small m-0 text-secondary user-details">{{ userEmail }}</p>
                            </div>
                        </div>
                    </li>
                    <!-- Links -->
                    <li class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"/>{{ $t('navbar.settings') }}</a></li>
                    <li><router-link to="/logout" class="dropdown-item"><i class="bi bi-power me-2"/>{{ $t('navbar.logout') }}</router-link></li>
                </ul>
            </div>
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
import { Roles, hasRole } from "@/roles";
import { store } from "@/store"
import baMenu from "@/components/menus/baMenu.vue";
import bdsMenu from "@/components/menus/bdsMenu.vue";
import comMenu from "@/components/menus/comMenu.vue";
import faMenu from "@/components/menus/faMenu.vue";
import hrMenu from "@/components/menus/hrMenu.vue";
import slmMenu from "@/components/menus/slmMenu.vue";
import CpmMenu from "@/components/menus/cpmMenu.vue";
import PkmMenu from "@/components/menus/pkmMenu.vue";
import PpcMenu from "@/components/menus/ppcMenu.vue";
import PpmMenu from "@/components/menus/ppmMenu.vue";
import CapmMenu from "@/components/menus/capmMenu.vue";
import ChmMenu from "@/components/menus/chmMenu.vue";
import ConfmMenu from "@/components/menus/confmMenu.vue";
import CsiMenu from "@/components/menus/csiMenu.vue";
import CrmMenu from "@/components/menus/crmMenu.vue";
import IsmMenu from "@/components/menus/ismMenu.vue";
import IsrmMenu from "@/components/menus/isrmMenu.vue";
import PmMenu from "@/components/menus/pmMenu.vue";
import RdmMenu from "@/components/menus/rdmMenu.vue";
import RmMenu from "@/components/menus/rmMenu.vue";
import SacmMenu from "@/components/menus/sacmMenu.vue";
import SuppmMenu from "@/components/menus/suppmMenu.vue";
import SpmMenu from "@/components/menus/spmMenu.vue";
import SrmMenu from "@/components/menus/srmMenu.vue";

export default {
    name: 'IsmNavbar',
    components: {
        SrmMenu, SpmMenu, SuppmMenu, SacmMenu, RmMenu, RdmMenu, PmMenu, IsrmMenu, IsmMenu,
        CrmMenu, CsiMenu, ConfmMenu, ChmMenu, CapmMenu, PpmMenu, PpcMenu, PkmMenu, CpmMenu,
        baMenu, bdsMenu, comMenu, faMenu, hrMenu, slmMenu },
    props: {
        moduleName: String,
    },
    data() {
        return {
            isAuthenticated: store.state.oidc.is_checked,
            accessToken: store.state.oidc.access_token,
            userInfo: store.state.oidc.user,
            userEmail: store.state.oidc.user ? store.state.oidc.user.email : "",
        }
    },
    computed: {
        roles() { return store.state.temp.roles; },
        loggedIn() { return this.isAuthenticated && null != this.accessToken },
        canUseTool() { return hasRole(this.roles, Roles.VO.MEMBER); },
        userFullName() { return store.getters["ims/userFullName"]; },
        highAssurance() {
            let assurance = false;
            if(isValid(this.userInfo.eduperson_assurance)) {
                let ha = this.userInfo.eduperson_assurance.filter((a) => "https://aai.egi.eu/LoA#Substantial" === a);
                assurance = ha.length > 0;
            }
            return assurance;
        },
        unreadNotificationCount() { return store.getters["ims/unreadNotificationCount"]; },
        isAdmin() { return store.getters["ims/isAdmin"]; },
        isProcess() { return isValid(this.$props.moduleName) && this.$props.moduleName.length > 0; },
    },
    methods: {
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
    align-items: stretch;
}
.navbar .right .user {
    margin: 0 .3rem;
}
.navbar .right .user-info {
    position: relative;
    left: -3px;
}
.navbar .right .user-info > a {
    padding-top: 4px;
    padding-left: .5rem;
    padding-right: .5rem;
    margin-right: .3rem;
    border-radius: .3rem;
    position: relative;
    top: -2px;
}
.avatar {
    font-weight: bold;
    font-size: 4rem;
    max-height: 5rem;
    color: #2790ee;
}
.user-details {
  white-space: nowrap;
}
.navbar .right .user-info > a,
.navbar-toggler {
    font-size: x-large;
    font-weight: bolder;
    color: #707070;
}
.navbar-toggler {
    position: relative;
    top: -2px;
}
.navbar-toggler i {
    position: relative;
    top: 2px;
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
.badge-assurance {
    font-size: 1.5rem;
    position: absolute;
    top: 55px;
    left: 65px;
    z-index: 1;
}
.badge-assurance.high {
    color: #bfd5ab;
}
.badge-assurance.low {
    color: #a16767;
}
.offcanvas.show ul.dropdown-menu {
    text-align: center;
}
.navbar-toggler {
    border: none;
    background-color: var(--bs-secondary-bg);
}
.dropdown-menu,
.offcanvas-body {
    background-color: var(--bs-tertiary-bg);
}
.offcanvas-header {
    background-color: var(--bs-secondary-bg);
}
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
    background-color: var(--bs-secondary-bg);
}
</style>
