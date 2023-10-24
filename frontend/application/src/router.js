import { createRouter, createWebHistory } from 'vue-router'
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc'
import { store } from "@/store"

import OidcCallback from "@/views/auth/OidcCallback.vue";
import OidcCallbackPopup from "@/views/auth/OidcCallbackPopup.vue";
import OidcCallbackError from "@/views/auth/OidcCallbackError.vue";

import Home from './views/Home.vue'
import Logout from "@/views/Logout.vue";

import System from './views/system/system.vue'
import systemHome from "@/views/system/systemHome.vue";
import systemConfig from "@/views/system/systemConfig.vue";
import systemPlan from "@/views/system/systemPlan.vue";
import systemRoles from "@/views/system/systemRoles.vue";
import systemRole from './views/system/systemRole.vue'
import systemRoleEdit from './views/system/systemRoleEdit.vue'
import systemPolicies from "@/views/system/systemPolicies.vue";
import systemReports from "@/views/system/systemReports.vue";
import systemProcedures from "@/views/system/systemProcedures.vue";
import systemProjects from "@/views/system/systemProjects.vue";
import systemEvents from "@/views/system/systemEvents.vue";

import ServiceLevelManagement from './views/slm/slm.vue'
import slmHome from './views/slm/slmHome.vue'
import slmConfig from "@/views/slm/slmConfig.vue";
import slmReview from "@/views/slm/slmReview.vue";
import slmRoles from './views/slm/slmRoles.vue'
import slmRole from './views/slm/slmRole.vue'
import slmRoleEdit from './views/slm/slmRoleEdit.vue'
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

import CoordinatedProjectManagement from './views/cpm/cpm.vue'
import cpmHome from "@/views/cpm/cpmHome.vue";
import cpmConfig from "@/views/cpm/cpmConfig.vue";
import cpmRoles from "@/views/cpm/cpmRoles.vue";
import cpmProcedures from "@/views/cpm/cpmProcedures.vue";
import cpmKPIs from "@/views/cpm/cpmKPIs.vue";

import ProjectKnowledgeManagement from './views/pkm/pkm.vue'
import pkmHome from "@/views/pkm/pkmHome.vue";
import pkmConfig from "@/views/pkm/pkmConfig.vue";
import pkmRoles from "@/views/pkm/pkmRoles.vue";
import pkmProcedures from "@/views/pkm/pkmProcedures.vue";
import pkmKPIs from "@/views/pkm/pkmKPIs.vue";

import ParticipatedProjectCoordination from './views/ppc/ppc.vue'
import ppcHome from "@/views/ppc/ppcHome.vue";
import ppcConfig from "@/views/ppc/ppcConfig.vue";
import ppcRoles from "@/views/ppc/ppcRoles.vue";
import ppcProcedures from "@/views/ppc/ppcProcedures.vue";
import ppcKPIs from "@/views/ppc/ppcKPIs.vue";

import ProjectPortfolioManagement from './views/ppm/ppm.vue'
import ppmHome from "@/views/ppm/ppmHome.vue";
import ppmConfig from "@/views/ppm/ppmConfig.vue";
import ppmRoles from "@/views/ppm/ppmRoles.vue";
import ppmProcedures from "@/views/ppm/ppmProcedures.vue";
import ppmKPIs from "@/views/ppm/ppmKPIs.vue";

import CapacityManagement from './views/capm/capm.vue'
import capmHome from "@/views/capm/capmHome.vue";
import capmConfig from "@/views/capm/capmConfig.vue";
import capmRoles from "@/views/capm/capmRoles.vue";
import capmProcedures from "@/views/capm/capmProcedures.vue";
import capmKPIs from "@/views/capm/capmKPIs.vue";

import ChangeManagement from './views/chm/chm.vue'
import chmHome from "@/views/chm/chmHome.vue";
import chmConfig from "@/views/chm/chmConfig.vue";
import chmRoles from "@/views/chm/chmRoles.vue";
import chmProcedures from "@/views/chm/chmProcedures.vue";
import chmKPIs from "@/views/chm/chmKPIs.vue";

import ConfigurationManagement from './views/confm/confm.vue'
import confmHome from "@/views/confm/confmHome.vue";
import confmConfig from "@/views/confm/confmConfig.vue";
import confmRoles from "@/views/confm/confmRoles.vue";
import confmProcedures from "@/views/confm/confmProcedures.vue";
import confmKPIs from "@/views/confm/confmKPIs.vue";

import ContinualServiceImprovement from './views/csi/csi.vue'
import csiHome from "@/views/csi/csiHome.vue";
import csiConfig from "@/views/csi/csiConfig.vue";
import csiRoles from "@/views/csi/csiRoles.vue";
import csiProcedures from "@/views/csi/csiProcedures.vue";
import csiKPIs from "@/views/csi/csiKPIs.vue";

import CustomerRelationshipManagement from './views/crm/crm.vue'
import crmHome from "@/views/crm/crmHome.vue";
import crmConfig from "@/views/crm/crmConfig.vue";
import crmRoles from "@/views/crm/crmRoles.vue";
import crmProcedures from "@/views/crm/crmProcedures.vue";
import crmKPIs from "@/views/crm/crmKPIs.vue";

import InformationSecurityManagement from './views/ism/ism.vue'
import ismHome from "@/views/ism/ismHome.vue";
import ismConfig from "@/views/ism/ismConfig.vue";
import ismRoles from "@/views/ism/ismRoles.vue";
import ismProcedures from "@/views/ism/ismProcedures.vue";
import ismKPIs from "@/views/ism/ismKPIs.vue";

import IncidentServiceRequestManagement from './views/isrm/isrm.vue'
import isrmHome from "@/views/isrm/isrmHome.vue";
import isrmConfig from "@/views/isrm/isrmConfig.vue";
import isrmRoles from "@/views/isrm/isrmRoles.vue";
import isrmProcedures from "@/views/isrm/isrmProcedures.vue";
import isrmKPIs from "@/views/isrm/isrmKPIs.vue";

import ProblemManagement from './views/pm/pm.vue'
import pmHome from "@/views/pm/pmHome.vue";
import pmConfig from "@/views/pm/pmConfig.vue";
import pmRoles from "@/views/pm/pmRoles.vue";
import pmProcedures from "@/views/pm/pmProcedures.vue";
import pmKPIs from "@/views/pm/pmKPIs.vue";

import ReleaseDeploymentManagement from './views/rdm/rdm.vue'
import rdmHome from "@/views/rdm/rdmHome.vue";
import rdmConfig from "@/views/rdm/rdmConfig.vue";
import rdmRoles from "@/views/rdm/rdmRoles.vue";
import rdmProcedures from "@/views/rdm/rdmProcedures.vue";
import rdmKPIs from "@/views/rdm/rdmKPIs.vue";

import RiskManagement from './views/rm/rm.vue'
import rmHome from "@/views/rm/rmHome.vue";
import rmConfig from "@/views/rm/rmConfig.vue";
import rmRoles from "@/views/rm/rmRoles.vue";
import rmProcedures from "@/views/rm/rmProcedures.vue";
import rmKPIs from "@/views/rm/rmKPIs.vue";

import ServiceAvailabilityContinuityManagement from './views/sacm/sacm.vue'
import sacmHome from "@/views/sacm/sacmHome.vue";
import sacmConfig from "@/views/sacm/sacmConfig.vue";
import sacmRoles from "@/views/sacm/sacmRoles.vue";
import sacmProcedures from "@/views/sacm/sacmProcedures.vue";
import sacmKPIs from "@/views/sacm/sacmKPIs.vue";

import SupplierRelationshipManagement from './views/suppm/suppm.vue'
import suppmHome from "@/views/suppm/suppmHome.vue";
import suppmConfig from "@/views/suppm/suppmConfig.vue";
import suppmRoles from "@/views/suppm/suppmRoles.vue";
import suppmProcedures from "@/views/suppm/suppmProcedures.vue";
import suppmKPIs from "@/views/suppm/suppmKPIs.vue";

import ServicePortfolioManagement from './views/spm/spm.vue'
import spmHome from "@/views/spm/spmHome.vue";
import spmConfig from "@/views/spm/spmConfig.vue";
import spmRoles from "@/views/spm/spmRoles.vue";
import spmProcedures from "@/views/spm/spmProcedures.vue";
import spmKPIs from "@/views/spm/spmKPIs.vue";

import ServiceReportingManagement from './views/srm/srm.vue'
import srmHome from "@/views/srm/srmHome.vue";
import srmConfig from "@/views/srm/srmConfig.vue";
import srmRoles from "@/views/srm/srmRoles.vue";
import srmProcedures from "@/views/srm/srmProcedures.vue";
import srmKPIs from "@/views/srm/srmKPIs.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      isPublic: true
    }
  },
  {
    path: '/oidc-callback', // Needs to match redirectUri in oidcSettings
    name: 'oidc',
    component: OidcCallback,
    meta: {
      isPublic: true
    }
  },
  {
    path: '/oidc-callback-popup', // Needs to match popupRedirectUri in oidcSettings
    name: 'oidc-popup',
    component: OidcCallbackPopup,
    meta: {
      isPublic: true
    }
  },
  {
    path: '/oidc-callback-error',
    name: 'oidc-error',
    component: OidcCallbackError,
    meta: {
      isPublic: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  },
  {
    path: '/ims',
    name: 'system',
    component: System,
    children: [
      { path: '', name:'system-home', component: systemHome },
      { path: 'config', component: systemConfig },
      { path: 'plan', component: systemPlan },
      { path: 'plan/roles', component: systemRoles },
      { path: 'plan/roles/:role', component: systemRole, props: route => ({ version: route.query.v }) },
      { path: 'plan/roles/:role/edit', component: systemRoleEdit },
      { path: 'policies', component: systemPolicies },
      { path: 'procedures', component: systemProcedures },
      { path: 'reports', component: systemReports },
      { path: 'projects', component: systemProjects },
      { path: 'events', component: systemEvents },
    ]
  },
  {
    path: '/ba',
    name: 'ba',
    component: BudgetingAccounting,
    children: [
      { path: '', name:'ba-home', component: baHome },
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
      { path: '', name:'bds-home', component: bdsHome },
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
      { path: '', name:'com-home', component: comHome },
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
      { path: '', name:'fa-home', component: faHome },
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
      { path: '', name:'hr-home', component: hrHome },
      { path: 'config', component: hrConfig },
      { path: 'roles', component: hrRoles },
      { path: 'procedures', component: hrProcedures },
      { path: 'kpis', component: hrKPIs },
    ]
  },
  {
    path: '/cpm',
    name: 'cpm',
    component: CoordinatedProjectManagement,
    children: [
      { path: '', name:'cpm-home', component: cpmHome },
      { path: 'config', component: cpmConfig },
      { path: 'roles', component: cpmRoles },
      { path: 'procedures', component: cpmProcedures },
      { path: 'kpis', component: cpmKPIs },
    ]
  },
  {
    path: '/pkm',
    name: 'pkm',
    component: ProjectKnowledgeManagement,
    children: [
      { path: '', name:'pkm-home', component: pkmHome },
      { path: 'config', component: pkmConfig },
      { path: 'roles', component: pkmRoles },
      { path: 'procedures', component: pkmProcedures },
      { path: 'kpis', component: pkmKPIs },
    ]
  },
  {
    path: '/ppc',
    name: 'ppc',
    component: ParticipatedProjectCoordination,
    children: [
      { path: '', name:'ppc-home', component: ppcHome },
      { path: 'config', component: ppcConfig },
      { path: 'roles', component: ppcRoles },
      { path: 'procedures', component: ppcProcedures },
      { path: 'kpis', component: ppcKPIs },
    ]
  },
  {
    path: '/ppm',
    name: 'ppm',
    component: ProjectPortfolioManagement,
    children: [
      { path: '', name:'ppm-home', component: ppmHome },
      { path: 'config', component: ppmConfig },
      { path: 'roles', component: ppmRoles },
      { path: 'procedures', component: ppmProcedures },
      { path: 'kpis', component: ppmKPIs },
    ]
  },
  {
    path: '/capm',
    name: 'capm',
    component: CapacityManagement,
    children: [
      { path: '', name:'capm-home', component: capmHome },
      { path: 'config', component: capmConfig },
      { path: 'roles', component: capmRoles },
      { path: 'procedures', component: capmProcedures },
      { path: 'kpis', component: capmKPIs },
    ]
  },
  {
    path: '/chm',
    name: 'chm',
    component: ChangeManagement,
    children: [
      { path: '', name:'chm-home', component: chmHome },
      { path: 'config', component: chmConfig },
      { path: 'roles', component: chmRoles },
      { path: 'procedures', component: chmProcedures },
      { path: 'kpis', component: chmKPIs },
    ]
  },
  {
    path: '/confm',
    name: 'confm',
    component: ConfigurationManagement,
    children: [
      { path: '', name:'confm-home', component: confmHome },
      { path: 'config', component: confmConfig },
      { path: 'roles', component: confmRoles },
      { path: 'procedures', component: confmProcedures },
      { path: 'kpis', component: confmKPIs },
    ]
  },
  {
    path: '/csi',
    name: 'csi',
    component: ContinualServiceImprovement,
    children: [
      { path: '', name:'csi-home', component: csiHome },
      { path: 'config', component: csiConfig },
      { path: 'roles', component: csiRoles },
      { path: 'procedures', component: csiProcedures },
      { path: 'kpis', component: csiKPIs },
    ]
  },
  {
    path: '/crm',
    name: 'crm',
    component: CustomerRelationshipManagement,
    children: [
      { path: '', name:'srm-home', component: crmHome },
      { path: 'config', component: crmConfig },
      { path: 'roles', component: crmRoles },
      { path: 'procedures', component: crmProcedures },
      { path: 'kpis', component: crmKPIs },
    ]
  },
  {
    path: '/ism',
    name: 'ism',
    component: InformationSecurityManagement,
    children: [
      { path: '', name:'ism-home', component: ismHome },
      { path: 'config', component: ismConfig },
      { path: 'roles', component: ismRoles },
      { path: 'procedures', component: ismProcedures },
      { path: 'kpis', component: ismKPIs },
    ]
  },
  {
    path: '/isrm',
    name: 'isrm',
    component: IncidentServiceRequestManagement,
    children: [
      { path: '', name:'isrm-home', component: isrmHome },
      { path: 'config', component: isrmConfig },
      { path: 'roles', component: isrmRoles },
      { path: 'procedures', component: isrmProcedures },
      { path: 'kpis', component: isrmKPIs },
    ]
  },
  {
    path: '/pm',
    name: 'pm',
    component: ProblemManagement,
    children: [
      { path: '', name:'pm-home', component: pmHome },
      { path: 'config', component: pmConfig },
      { path: 'roles', component: pmRoles },
      { path: 'procedures', component: pmProcedures },
      { path: 'kpis', component: pmKPIs },
    ]
  },
  {
    path: '/rdm',
    name: 'rdm',
    component: ReleaseDeploymentManagement,
    children: [
      { path: '', name:'rdm-home', component: rdmHome },
      { path: 'config', component: rdmConfig },
      { path: 'roles', component: rdmRoles },
      { path: 'procedures', component: rdmProcedures },
      { path: 'kpis', component: rdmKPIs },
    ]
  },
  {
    path: '/rm',
    name: 'rm',
    component: RiskManagement,
    children: [
      { path: '', name:'rm-home', component: rmHome },
      { path: 'config', component: rmConfig },
      { path: 'roles', component: rmRoles },
      { path: 'procedures', component: rmProcedures },
      { path: 'kpis', component: rmKPIs },
    ]
  },
  {
    path: '/sacm',
    name: 'sacm',
    component: ServiceAvailabilityContinuityManagement,
    children: [
      { path: '', name:'sacm-home', component: sacmHome },
      { path: 'config', component: sacmConfig },
      { path: 'roles', component: sacmRoles },
      { path: 'procedures', component: sacmProcedures },
      { path: 'kpis', component: sacmKPIs },
    ]
  },
  {
    path: '/suppm',
    name: 'suppm',
    component: SupplierRelationshipManagement,
    children: [
      { path: '', name:'suppm-home', component: suppmHome },
      { path: 'config', component: suppmConfig },
      { path: 'roles', component: suppmRoles },
      { path: 'procedures', component: suppmProcedures },
      { path: 'kpis', component: suppmKPIs },
    ]
  },
  {
    path: '/spm',
    name: 'spm',
    component: ServicePortfolioManagement,
    children: [
      { path: '', name:'spm-home', component: spmHome },
      { path: 'config', component: spmConfig },
      { path: 'roles', component: spmRoles },
      { path: 'procedures', component: spmProcedures },
      { path: 'kpis', component: spmKPIs },
    ]
  },
  {
    path: '/srm',
    name: 'srm',
    component: ServiceReportingManagement,
    children: [
      { path: '', name:'srm-home', component: srmHome },
      { path: 'config', component: srmConfig },
      { path: 'roles', component: srmRoles },
      { path: 'procedures', component: srmProcedures },
      { path: 'kpis', component: srmKPIs },
    ]
  },
  {
    path: '/slm',
    name: 'slm',
    component: ServiceLevelManagement,
    children: [
      { path: '', name:'slm-home', component: slmHome, props: route => ({ version: route.query.v }) },
      { path: 'config', component: slmConfig },
      { path: 'review', component: slmReview },
      { path: 'roles', component: slmRoles },
      { path: 'roles/:role', component: slmRole, props: route => ({ version: route.query.v }) },
      { path: 'roles/:role/edit', component: slmRoleEdit },
      { path: 'procedures', component: slmProcedures },
      { path: 'kpis', component: slmKPIs },
      { path: 'catalogs', component: slmCatalogs },
      { path: 'slas', component: slmSLAs },
      { path: 'olas', component: slmOLAs },
      { path: 'uas', component: slmUAs },
      { path: 'reports', component: slmReports },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Do not allow navigation to any page, unless authenticated
router.beforeEach(vuexOidcCreateRouterMiddleware(store, 'oidc'));


export default router
