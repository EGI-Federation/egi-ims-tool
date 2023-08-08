<template>
<nav class="navbar sticky-top navbar-expand-md bg-body-tertiary p-0">
    <div class="d-flex flex-nowrap left">
        <!-- Logo Start -->
        <a class="navbar-brand" href="https://www.egi.eu" target="_blank">
            <img alt="EGI logo" src="../assets/logo.png">
        </a>
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
                            <li><a class="dropdown-item" href="/global/config">{{ $t('navbar.config') }}</a></li>
                            <li><a class="dropdown-item" href="/global/plans">{{ $t('navbar.plans') }}</a></li>
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
                                    <li v-if="!('BA' === processCode)"><a class="dropdown-item" href="/ba">{{ $t('home.BA') }}</a></li>
                                    <li v-if="!('BDS' === processCode)"><a class="dropdown-item" href="/bds">{{ $t('home.BDS') }}</a></li>
                                    <li v-if="!('COM' === processCode)"><a class="dropdown-item" href="/com">{{ $t('home.COM') }}</a></li>
                                    <li v-if="!('FA' === processCode)"><a class="dropdown-item" href="/fa">{{ $t('home.FA') }}</a></li>
                                    <li v-if="!('HR' === processCode)"><a class="dropdown-item" href="/hr">{{ $t('home.HR') }}</a></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu dropstart">
                                <a class="dropdown-item dropdown-toggle" id="projectsSubMenu" aria-haspopup="true" aria-expanded="false"
                                   data-bs-toggle="dropdown" @click="toggleProjectsSubMenu" href="#">
                                    {{ $t('navbar.projects') }}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="projectsSubMenu" ref="projectsSubMenu">
                                    <li v-if="!('CPM' === processCode)"><a class="dropdown-item" href="/cpm">{{ $t('home.CPM') }}</a></li>
                                    <li v-if="!('PPC' === processCode)"><a class="dropdown-item" href="/ppc">{{ $t('home.PPC') }}</a></li>
                                    <li v-if="!('PPM' === processCode)"><a class="dropdown-item" href="/ppm">{{ $t('home.PPM') }}</a></li>
                                    <li v-if="!('PKM' === processCode)"><a class="dropdown-item" href="/pkm">{{ $t('home.PKM') }}</a></li>
                                </ul>
                            </li>
                            <li><hr class="dropdown-divider"/></li>
                            <li v-if="!('CAPM' === processCode)"><a class="dropdown-item" href="/capm">{{ $t('home.CAPM') }}</a></li>
                            <li v-if="!('CHM' === processCode)"><a class="dropdown-item" href="/chm">{{ $t('home.CHM') }}</a></li>
                            <li v-if="!('CONFM' === processCode)"><a class="dropdown-item" href="/confm">{{ $t('home.CONFM') }}</a></li>
                            <li v-if="!('CSI' === processCode)"><a class="dropdown-item" href="/csi">{{ $t('home.CSI') }}</a></li>
                            <li v-if="!('CRM' === processCode)"><a class="dropdown-item" href="/crm">{{ $t('home.CRM') }}</a></li>
                            <li v-if="!('ISM' === processCode)"><a class="dropdown-item" href="/ism">{{ $t('home.ISM') }}</a></li>
                            <li v-if="!('ISRM' === processCode)"><a class="dropdown-item" href="/isrm">{{ $t('home.ISRM') }}</a></li>
                            <li v-if="!('PM' === processCode)"><a class="dropdown-item" href="/pm">{{ $t('home.PM') }}</a></li>
                            <li v-if="!('RDM' === processCode)"><a class="dropdown-item" href="/rdm">{{ $t('home.RDM') }}</a></li>
                            <li v-if="!('RM' === processCode)"><a class="dropdown-item" href="/rm">{{ $t('home.RM') }}</a></li>
                            <li v-if="!('SACM' === processCode)"><a class="dropdown-item" href="/sacm">{{ $t('home.SACM') }}</a></li>
                            <li v-if="!('SUPPM' === processCode)"><a class="dropdown-item" href="/suppm">{{ $t('home.SUPPM') }}</a></li>
                            <li v-if="!('SLM' === processCode)"><a class="dropdown-item" href="/slm">{{ $t('home.SLM') }}</a></li>
                            <li v-if="!('SPM' === processCode)"><a class="dropdown-item" href="/spm">{{ $t('home.SPM') }}</a></li>
                            <li v-if="!('SRM' === processCode)"><a class="dropdown-item" href="/srm">{{ $t('home.SRM') }}</a></li>
                        </ul>
                    </li>
                    <li v-if="isProcess" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="processMenu" role="button" data-bs-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false" @click="closeSubMenus" href="#">
                            {{ $t('navbar.thisProcess') }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="processMenu">
                            <span v-for="item in localMenu">
                                <li v-html="menuItem(item)"></li>
                            </span>
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

export default {
    name: 'IsmNavbar',
    props: {
        processCode: String,
        processMenu: Array // Contains items of the form { isSeparator, text, link }
    },
    data() {
        return {
            test: true,
        }
    },
    computed: {
        isAdmin() { return store.state.isAdmin; },
        isProcess() { return isValid(this.$props.processCode) && this.$props.processCode.length > 0; },
        localMenu() { return isValid(this.$props.processMenu) ? this.$props.processMenu : []; }
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