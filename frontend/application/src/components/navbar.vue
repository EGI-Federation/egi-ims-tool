<template>
<messages ref="notifications"/>
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
                            {{ $t('home.IMS') }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="systemMenu">
                            <li><router-link class="dropdown-item" to="/ims">{{ $t('navbar.overview') }}</router-link></li>
                            <li :class="'dropdown-submenu ' + (isProcess ? 'dropend' : 'dropstart')">
                                <a class="dropdown-item dropdown-toggle" id="planSubMenu" aria-haspopup="true" aria-expanded="false"
                                   data-bs-toggle="dropdown" @click="togglePlanSubMenu" href="#">
                                    {{ $t('navbar.plan') }}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="planSubMenu" ref="projectsSubMenu">
                                    <li><router-link class="dropdown-item" to="/ims/plan">{{ $t('navbar.governance') }}</router-link></li>
                                    <li><router-link class="dropdown-item" to="/ims/plan/roles">{{ $t('navbar.roles') }}</router-link></li>
                                </ul>
                            </li>
                            <li><router-link class="dropdown-item" to="/ims/policies">{{ $t('navbar.policies') }}</router-link></li>
                            <li><router-link class="dropdown-item" to="/ims/procedures">{{ $t('navbar.procedures') }}</router-link></li>
                            <li><router-link class="dropdown-item" to="/ims/projects">{{ $t('navbar.projects') }}</router-link></li>
                            <li><router-link class="dropdown-item" to="/ims/events">{{ $t('navbar.events') }}</router-link></li>
                            <li><router-link class="dropdown-item" to="/ims/reports">{{ $t('navbar.reports') }}</router-link></li>
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
                                    <li v-if="!('BA' === moduleName)"><router-link class="dropdown-item" to="/ba"><i :class="Icons.BA"></i>{{ $t('home.BA') }}</router-link></li>
                                    <li v-if="!('BDS' === moduleName)"><router-link class="dropdown-item" to="/bds"><i :class="Icons.BDS"></i>{{ $t('home.BDS') }}</router-link></li>
                                    <li v-if="!('COM' === moduleName)"><router-link class="dropdown-item" to="/com"><i :class="Icons.COM"></i>{{ $t('home.COM') }}</router-link></li>
                                    <li v-if="!('FA' === moduleName)"><router-link class="dropdown-item" to="/fa"><i :class="Icons.FA"></i>{{ $t('home.FA') }}</router-link></li>
                                    <li v-if="!('HR' === moduleName)"><router-link class="dropdown-item" to="/hr"><i :class="Icons.HR"></i>{{ $t('home.HR') }}</router-link></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu dropstart">
                                <a class="dropdown-item dropdown-toggle" id="projectsSubMenu" aria-haspopup="true" aria-expanded="false"
                                   data-bs-toggle="dropdown" @click="toggleProjectsSubMenu" href="#">
                                    {{ $t('navbar.projects') }}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="projectsSubMenu" ref="projectsSubMenu">
                                    <li v-if="!('CPM' === moduleName)"><router-link class="dropdown-item" to="/cpm"><i :class="Icons.CPM"></i>{{ $t('home.CPM') }}</router-link></li>
                                    <li v-if="!('PPC' === moduleName)"><router-link class="dropdown-item" to="/ppc"><i :class="Icons.PPC"></i>{{ $t('home.PPC') }}</router-link></li>
                                    <li v-if="!('PPM' === moduleName)"><router-link class="dropdown-item" to="/ppm"><i :class="Icons.PPM"></i>{{ $t('home.PPM') }}</router-link></li>
                                    <li v-if="!('PKM' === moduleName)"><router-link class="dropdown-item" to="/pkm"><i :class="Icons.PKM"></i>{{ $t('home.PKM') }}</router-link></li>
                                </ul>
                            </li>
                            <li><hr class="dropdown-divider"/></li>
                            <li v-if="!('CAPM' === moduleName)"><router-link class="dropdown-item" to="/capm"><i :class="Icons.CAPM"></i>{{ $t('home.CAPM') }}</router-link></li>
                            <li v-if="!('CHM' === moduleName)"><router-link class="dropdown-item" to="/chm"><i :class="Icons.CHM"></i>{{ $t('home.CHM') }}</router-link></li>
                            <li v-if="!('CONFM' === moduleName)"><router-link class="dropdown-item" to="/confm"><i :class="Icons.CONFM"></i>{{ $t('home.CONFM') }}</router-link></li>
                            <li v-if="!('CSI' === moduleName)"><router-link class="dropdown-item" to="/csi"><i :class="Icons.CSI"></i>{{ $t('home.CSI') }}</router-link></li>
                            <li v-if="!('CRM' === moduleName)"><router-link class="dropdown-item" to="/crm"><i :class="Icons.CRM"></i>{{ $t('home.CRM') }}</router-link></li>
                            <li v-if="!('ISM' === moduleName)"><router-link class="dropdown-item" to="/ism"><i :class="Icons.ISM"></i>{{ $t('home.ISM') }}</router-link></li>
                            <li v-if="!('ISRM' === moduleName)"><router-link class="dropdown-item" to="/isrm"><i :class="Icons.ISRM"></i>{{ $t('home.ISRM') }}</router-link></li>
                            <li v-if="!('PM' === moduleName)"><router-link class="dropdown-item" to="/pm"><i :class="Icons.PM"></i>{{ $t('home.PM') }}</router-link></li>
                            <li v-if="!('RDM' === moduleName)"><router-link class="dropdown-item" to="/rdm"><i :class="Icons.RDM"></i>{{ $t('home.RDM') }}</router-link></li>
                            <li v-if="!('RM' === moduleName)"><router-link class="dropdown-item" to="/rm"><i :class="Icons.RM"></i>{{ $t('home.RM') }}</router-link></li>
                            <li v-if="!('SACM' === moduleName)"><router-link class="dropdown-item" to="/sacm"><i :class="Icons.SACM"></i>{{ $t('home.SACM') }}</router-link></li>
                            <li v-if="!('SUPPM' === moduleName)"><router-link class="dropdown-item" to="/suppm"><i :class="Icons.SUPPM"></i>{{ $t('home.SUPPM') }}</router-link></li>
                            <li v-if="!('SLM' === moduleName)"><router-link class="dropdown-item" to="/slm"><i :class="Icons.SLM"></i>{{ $t('home.SLM') }}</router-link></li>
                            <li v-if="!('SPM' === moduleName)"><router-link class="dropdown-item" to="/spm"><i :class="Icons.SPM"></i>{{ $t('home.SPM') }}</router-link></li>
                            <li v-if="!('SRM' === moduleName)"><router-link class="dropdown-item" to="/srm"><i :class="Icons.SRM"></i>{{ $t('home.SRM') }}</router-link></li>
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
            <!-- Notifications -->
            <div class="d-flex flex-nowrap user-info">
                <a class="bg-body-secondary dropdown" id="userMessages" ref="userMessages" role="button"
                   aria-expanded="false" data-bs-toggle="dropdown"
                   data-bs-auto-close="outside" data-bs-display="static" href="#">
                    <span :class="unreadNotificationCount ?
                        'position-absolute top-2 translate-middle badge rounded-pill bg-danger' : ''">
                        {{ unreadNotificationCount ? (unreadNotificationCount > 99 ? '99+' : unreadNotificationCount) : '' }}
                    </span>
                    <i class="bi bi-bell"/>
                </a>
                <div class="dropdown-menu dropdown-menu-end messages-container" aria-labelledby="userMessages">
                    <!-- Messages Start -->
                    <div class="d-flex flex-column flex-nowrap gap-0">
                        <div class="px-3 messages-head">
                            <div class="d-flex flex-nowrap gap-2 justify-content-between">
                                <p class="text-nowrap h6">{{ $t('navbar.notifications') }}</p>
                                <a v-if="unreadNotificationCount > 0" class="click-action" href="#"
                                   @click="markAllRead($event)">
                                    <p class="text-nowrap">{{ $t('navbar.markAllRead') }}</p>
                                </a>
                            </div>
                        </div>
                        <!-- Messages -->
                        <Simplebar class="messages">
                            <div v-if="unreadNotificationCount > 0" class="px-3 category">
                                {{ $t('navbar.new') }}
                            </div>
                            <div v-for="(message, index) in unreadNotifications" class="message">
                                <a :class="messageInfo(message, index).class" :href="messageInfo(message).url"
                                   @click="handleNotificationLink(message.id, $event)">
                                    <div class="d-flex flex-nowrap gap-1">
                                        <div class="icon" :style="`background-color:${messageInfo(message).iconBackground};color:${messageInfo(message).iconColor}`">
                                            <div>
                                                <span :class="messageInfo(message).iconClass"/>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column gap-1">
                                            <div class="notification">{{ message.message }}</div>
                                            <div class="when">{{ formatSinceEvent(message.sentOn, $t) }}</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div v-if="totalNotificationCount > 0 &&
                                       totalNotificationCount > unreadNotificationCount &&
                                       unreadNotificationCount < maxNotificationsCount" class="px-3 category">
                                {{ $t('navbar.earlier') }}
                            </div>
                            <div v-for="(message, index) in olderNotifications" class="message">
                                <a :class="messageInfo(message, index).class" :href="messageInfo(message).url"
                                   @click="handleNotificationLink(message.id, $event)">
                                    <div class="d-flex flex-nowrap gap-1">
                                        <div class="icon" :style="`background-color:${messageInfo(message).iconBackground};color:${messageInfo(message).iconColor}`">
                                            <div>
                                                <span :class="messageInfo(message).iconClass"/>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column gap-1">
                                            <div class="notification earlier">{{ message.message }}</div>
                                            <div class="when">{{ formatSinceEvent(message.sentOn, $t) }}</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </Simplebar>
                        <!-- Messages End -->
                        <div class="dropdown-divider"></div>
                        <div v-if="totalNotificationCount === 0" class="center pt-3 pb-3">
                            {{ $t('navbar.noMessages') }}
                        </div>
                        <div v-if="totalNotificationCount > 0" class="center pt-1 pb-1">
                            <a class="click-action" href="#" @click="viewAll($event)">
                                {{ $t('navbar.viewAll') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
           <!-- Settings -->
            <div class="d-flex flex-nowrap user-info" id="userInfo">
                <a class="bg-body-secondary dropdown" id="userProfile" role="button" aria-expanded="false"
                   data-bs-auto-close="outside" data-bs-display="static" data-bs-toggle="dropdown" href="#">
                    <i class="bi bi-sliders"/>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userProfile">
                    <!-- Profile info -->
                    <li class="px-3 mb-1">
                        <div class="d-flex align-items-center">
                            <!-- Avatar -->
                            <div class="avatar">
                                <i class="bi bi-person-circle"/>
                                <i :class="highAssurance ? 'bi bi-shield-fill-plus badge-assurance high' : 'bi bi-shield-fill-minus badge-assurance low'"
                                   data-bs-toggle='tooltip' :data-bs-title="$t(highAssurance ? 'navbar.highAssurance' : 'navbar.lowAssurance')" ></i>
                            </div>
                            <div class="ms-3">
                                <p class="h6 mb-1 user-details">{{ userFullName }}</p>
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
import { isValid, isSuccess, formatSinceEvent } from '@/utils'
import { readMessage } from "@/api/readMessage";
import { readAllMessages } from "@/api/readAllMessages";
import { Roles, hasRole } from "@/roles";
import { Icons, IconColors } from "@/notify";
import { store } from "@/store";
import Messages from "@/components/messages.vue";
import BaMenu from "@/components/menus/baMenu.vue";
import BdsMenu from "@/components/menus/bdsMenu.vue";
import ComMenu from "@/components/menus/comMenu.vue";
import FaMenu from "@/components/menus/faMenu.vue";
import HrMenu from "@/components/menus/hrMenu.vue";
import SlmMenu from "@/components/menus/slmMenu.vue";
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
import { Tooltip } from "bootstrap";
import Simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

const maxNotificationsInMenu = 20;

export default {
    name: 'imsNavbar',
    components: {
        Messages, Tooltip, Simplebar,
        SrmMenu, SpmMenu, SuppmMenu, SacmMenu, RmMenu, RdmMenu, PmMenu, IsrmMenu, IsmMenu,
        CrmMenu, CsiMenu, ConfmMenu, ChmMenu, CapmMenu, PpmMenu, PpcMenu, PkmMenu, CpmMenu,
        BaMenu, BdsMenu, ComMenu, FaMenu, HrMenu, SlmMenu },
    props: {
        moduleName: String,
    },
    data() {
        return {
            accessToken: store.state.oidc?.access_token,
            userInfo: store.state.oidc?.user,
            userEmail: store.state.oidc?.user ? store.state.oidc.user?.email : "",
            tooltips: [],
        }
    },
    computed: {
        Icons() { return Icons; },
        roles() { return store.state.temp.roles; },
        msgApi() { return process.env.VUE_APP_IMS_MSG_API; },
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
        maxNotificationsCount() { return maxNotificationsInMenu; },
        totalNotificationCount() {
            const total = store.state.ims?.notifications?.length;
            return isValid(total) ? total : 0;
        },
        unreadNotificationCount() {
            const unread = store.state.ims?.notificationsUnread;
            return isValid(unread) ? unread : 0;
        },
        unreadNotifications() { return store.getters["ims/unreadNotifications"]; },
        olderNotifications() { return store.getters["ims/olderNotifications"]; },
        isProcess() {
            return isValid(this.$props.moduleName) &&
                   this.$props.moduleName.length > 0 &&
                   this.$props.moduleName !== "IMS" ; },
    },
    methods: {
        formatSinceEvent,
        togglePlanSubMenu(event) {
            event.stopPropagation();
            if(isValid(this.$refs.planSubMenu)) {
                const display = this.$refs.planSubMenu.style.display;
                this.$refs.planSubMenu.style.display = "block" === display ? "none" : "block";
            }
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
            if(isValid(this.$refs.planSubMenu))
                this.$refs.planSubMenu.style.display = "none";
            if(isValid(this.$refs.governanceSubMenu))
                this.$refs.governanceSubMenu.style.display = "none";
            if(isValid(this.$refs.projectsSubMenu))
                this.$refs.projectsSubMenu.style.display = "none";
        },
        hideTooltips() {
            for(let tooltip of this.tooltips)
                tooltip.hide();
        },
        messageInfo(message, index) {
            return {
                class: `dropdown-item${isValid(message.url) ? '' : ' nolink'}${isValid(index) && 0 === index ? ' fade-top-border' : ''}`,
                url: isValid(message.url) ? message.url : '#',
                iconClass: Icons[message.category || 'IMS'],
                iconBackground: IconColors[message.category || 'IMS'],
                iconColor: 'white'
            };
        },
        navigateTo(url, event) {
            // Close notifications menu
            if(isValid(this.$refs.userMessages))
                this.$refs.userMessages.click();

            if(isValid(url))
                this.$router.push(url);

            event.preventDefault();
            event.stopPropagation();
        },
        handleNotificationLink(messageId, event) {
            let el = event.target;
            while(el.nodeName !== 'A')
                el = el.parentElement;

            const url = el.getAttribute("href");
            if(isValid(url) && url.charAt(0) !== '#') {
                // Notification has a link, navigate using the router
                let t = this;
                let rmResult = readMessage(this.accessToken, messageId, this.msgApi);
                store.commit('ims/markNotificationsRead', Array.of(messageId));
                rmResult.markRead().then(() => {
                    if(isSuccess(t, rmResult)) {
                        // Success, nothing to do
                        // The page where we are going will reload notifications
                    }
                });

                this.navigateTo(url);
            }
        },
        markAllRead(event) {
            let t = this;
            let n = this.$refs.notifications;
            let rmResult = readAllMessages(this.accessToken, this.msgApi);
            store.commit('ims/markNotificationsRead');
            rmResult.markRead().then(() => {
                if(isSuccess(t, rmResult)) {
                    // Success, reload the notifications
                    if(isValid(n))
                        n.checkNotifications();
                }
            });

            // Close notifications menu
            this.navigateTo(null, event);
        },
        viewAll(event) {
            this.navigateTo('/notifications', event);
        },
    },
    mounted() {
        let t = this;
        const profileDropdown = document.getElementById('userProfile')
        profileDropdown.addEventListener('show.bs.dropdown', event => {
            // User profile shown, init the LoA tooltip
            const tooltipTriggers = document.querySelectorAll(`#userInfo [data-bs-toggle='tooltip']`);
            t.tooltips = [...tooltipTriggers].map(tooltipTrigger =>
                new Tooltip(tooltipTrigger, {
                    delay: { "show": 1000, "hide": 100 },
                    trigger: 'hover'
                }));
        });
        profileDropdown.addEventListener('hide.bs.dropdown', event => {
            // User profile hiding, cleanup LoA tooltip
            t.hideTooltips();
        });
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
:root {
    --navbar-height: 3.5rem;
}
</style>
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
    --avatar-height: calc(5 * var(--font-scale) * var(--bs-body-font-size));
    position: relative;
    font-weight: bold;
    font-size: var(--avatar-height);
    max-height: calc(1.2 * var(--avatar-height));
    color: #2790ee;
}
.user-details {
    white-space: nowrap;
}
.navbar .right .user-info > a,
.navbar-toggler {
    font-size: calc(1.7 * var(--font-scale) * var(--bs-body-font-size));
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
.badge {
    font-size: calc(0.6 * var(--font-scale) * var(--bs-body-font-size));
    left: calc(100% - 3px)!important;
    margin-top: 1px;
}
.messages-container {
    min-width: 25rem;
    max-width: 25rem;
    max-height: calc(var(--content-height) - 1rem);
}
.messages-container > div {
    height: 100%;
    overflow: hidden;
}
.messages {
    height: 100%;
    max-height: calc(var(--content-height) - 6rem)!important;
}
.messages,
.messages-head,
.messages-container .center {
    flex: none;
}
.messages-head {
    height: 2.35rem;
}
.messages-head p {
    padding-top: .7rem;
    margin-bottom: 0!important;
}
.messages .category {
    color: var(--bs-tertiary-color);
    padding-top: .5rem;
}
.message {
    border-bottom: 1px solid rgb(93, 99, 106, .15);
}
.message:last-of-type {
    border-bottom: none;
}
.message .dropdown-item {
    --bs-dropdown-link-active-color: var(--bs-dropdown-link-color)!important;
}
.message .dropdown-item:hover {
    background-color: var(--bs-secondary-bg);
}
.message .dropdown-item.nolink {
    cursor: default;
}
.message .dropdown-item > div {
    padding: .5rem 0;
}
.message .icon {
    --icon-height: calc(2 * var(--font-scale) * var(--bs-body-font-size));
    --icon-diameter: calc(var(--icon-height) + 1rem);
    font-size: var(--icon-height);
    font-weight: bold;
    width: var(--icon-diameter);
    min-width: var(--icon-diameter);
    max-height: var(--icon-diameter);
    margin-right: .4rem;
    -moz-border-radius: calc(var(--icon-diameter) / 2);
    -webkit-border-radius: calc(var(--icon-diameter) / 2);
    border-radius: calc(var(--icon-diameter) / 2);
}
.message .icon > div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: .3rem;
}
.message .notification {
    white-space: normal;
}
.message .notification.earlier {
    color: var(--bs-secondary-color);
    opacity: .75;
}
.message .when {
    font-size: smaller;
    color: var(--bs-secondary-color);
    opacity: .75;
}
.click-action {
    text-decoration: none;
}
.messages-container .center {
    min-height: 1.35rem;
    text-align: center;
}
.messages-container .center a {
    text-decoration: none;
    cursor: pointer;
}
.badge-assurance {
    font-size: calc(1.75 * var(--font-scale) * var(--bs-body-font-size));
    position: absolute;
    bottom: -5px;
    right: -8px;
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
    background-color: var(--menu-item-color);
}
.offcanvas-header {
    background-color: var(--menu-item-color);
}
.offcanvas-body li i.bi {
    padding-right: .5rem;
    padding-top: 2px;
}
.dropdown-menu,
.offcanvas-body {
    background-color: var(--menu-background-color);
    font-size: calc(var(--font-scale) * var(--bs-dropdown-font-size));
}
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus {
    background-color: var(--menu-item-color);
}
</style>
