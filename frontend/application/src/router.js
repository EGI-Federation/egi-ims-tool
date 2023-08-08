import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'

import System from './views/system/system.vue'
import systemConfig from "@/views/system/systemConfig.vue";
import systemPlans from "@/views/system/systemPlans.vue";

import ServiceLevelManagement from './views/slm/slm.vue'
import slmHome from './views/slm/slmHome.vue'
import slmConfig from "@/views/slm/slmConfig.vue";
import slmRoles from './views/slm/slmRoles.vue'
import slmProcedures from "@/views/slm/slmProcedures.vue";
import slmKPIs from "@/views/slm/slmKPIs.vue";
import slmCatalogs from "@/views/slm/slmCatalogs.vue";
import slmSLAs from "@/views/slm/slmSLAs.vue";
import slmOLAs from "@/views/slm/slmOLAs.vue";
import slmUAs from "@/views/slm/slmUAs.vue";
import slmReports from "@/views/slm/slmReports.vue";

import BudgetingAccounting from './views/ba/ba.vue'
import baHome from "@/views/ba/baHome.vue";
import baConfig from "@/views/ba/baConfig.vue";
import baRoles from "@/views/ba/baRoles.vue";
import baProcedures from "@/views/ba/baProcedures.vue";
import baKPIs from "@/views/ba/baKPIs.vue";

import BusinessDevelopmentStakeholders from './views/bds/bds.vue'
import bdsHome from "@/views/bds/bdsHome.vue";
import bdsConfig from "@/views/bds/bdsConfig.vue";
import bdsRoles from "@/views/bds/bdsRoles.vue";
import bdsProcedures from "@/views/bds/bdsProcedures.vue";
import bdsKPIs from "@/views/bds/bdsKPIs.vue";

import CommunicationsManagement from './views/com/com.vue'
import comHome from "@/views/com/comHome.vue";
import comConfig from "@/views/com/comConfig.vue";
import comRoles from "@/views/com/comRoles.vue";
import comProcedures from "@/views/com/comProcedures.vue";
import comKPIs from "@/views/com/comKPIs.vue";

import FinanceAdministration from './views/fa/fa.vue'
import faHome from "@/views/fa/faHome.vue";
import faConfig from "@/views/fa/faConfig.vue";
import faRoles from "@/views/fa/faRoles.vue";
import faProcedures from "@/views/fa/faProcedures.vue";
import faKPIs from "@/views/fa/faKPIs.vue";

import HumanResources from './views/hr/hr.vue'
import hrHome from "@/views/hr/hrHome.vue";
import hrConfig from "@/views/hr/hrConfig.vue";
import hrRoles from "@/views/hr/hrRoles.vue";
import hrProcedures from "@/views/hr/hrProcedures.vue";
import hrKPIs from "@/views/hr/hrKPIs.vue";


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/system',
    name: 'system',
    component: System,
    children: [
      { path: 'config', component: systemConfig },
      { path: 'plans', component: systemPlans },
    ]
  },
  {
    path: '/ba',
    name: 'ba',
    component: BudgetingAccounting,
    children: [
      { path: '', component: baHome },
      { path: 'config', component: baConfig },
      { path: 'roles', component: baRoles },
      { path: 'procedures', component: baProcedures },
      { path: 'kpis', component: baKPIs },
    ]
  },
  {
    path: '/bds',
    name: 'bds',
    component: BusinessDevelopmentStakeholders,
    children: [
      { path: '', component: bdsHome },
      { path: 'config', component: bdsConfig },
      { path: 'roles', component: bdsRoles },
      { path: 'procedures', component: bdsProcedures },
      { path: 'kpis', component: bdsKPIs },
    ]
  },
  {
    path: '/com',
    name: 'com',
    component: CommunicationsManagement,
    children: [
      { path: '', component: comHome },
      { path: 'config', component: comConfig },
      { path: 'roles', component: comRoles },
      { path: 'procedures', component: comProcedures },
      { path: 'kpis', component: comKPIs },
    ]
  },
  {
    path: '/fa',
    name: 'fa',
    component: FinanceAdministration,
    children: [
      { path: '', component: faHome },
      { path: 'config', component: faConfig },
      { path: 'roles', component: faRoles },
      { path: 'procedures', component: faProcedures },
      { path: 'kpis', component: faKPIs },
    ]
  },
  {
    path: '/hr',
    name: 'hr',
    component: HumanResources,
    children: [
      { path: '', component: hrHome },
      { path: 'config', component: hrConfig },
      { path: 'roles', component: hrRoles },
      { path: 'procedures', component: hrProcedures },
      { path: 'kpis', component: hrKPIs },
    ]
  },
  {
    path: '/slm',
    name: 'slm',
    component: ServiceLevelManagement,
    children: [
      { path: '', component: slmHome },
      { path: 'config', component: slmConfig },
      { path: 'roles', component: slmRoles },
      { path: 'procedures', component: slmProcedures },
      { path: 'kpis', component: slmKPIs },
      { path: 'catalogs', component: slmCatalogs },
      { path: 'slas', component: slmSLAs },
      { path: 'olas', component: slmOLAs },
      { path: 'uas', component: slmUAs },
      { path: 'reports', component: slmReports },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
