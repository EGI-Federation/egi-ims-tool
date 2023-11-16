import { isValid } from '@/utils'
import { Roles, findUsersWithRole } from "@/roles";

export const Icons = Object.freeze({
    IMS: "bi bi-columns-gap",
    BA: "bi bi-calculator",
    BDS: "bi bi-graph-up-arrow",
    CAPM: "bi bi-hdd-rack",
    CHM: "bi bi-building-gear",
    COM: "bi bi-send",
    CONFM: "bi bi-sliders",
    CPM: "bi bi-calendar2-week",
    CRM: "bi bi-headset",
    CSI: "bi bi-ui-checks-grid",
    FA: "bi bi-cash-coin",
    HR: "bi bi-people",
    ISM: "bi bi-building-lock",
    ISRM: "bi bi-shield-shaded",
    PKM: "bi bi-journal-bookmark",
    PM: "bi bi-bug",
    PPC: "bi bi-calendar2-range",
    PPM: "bi bi-briefcase",
    RDM: "bi bi-box-seam",
    RM: "bi bi-patch-exclamation",
    SACM: "bi bi-activity",
    SLM: "bi bi-list-check",
    SPM: "bi bi-puzzle",
    SRM: "bi bi-kanban",
    SUPPM: "bi bi-pc-display",
});

export const IconColors = Object.freeze({
    IMS: "#2790ee",
    BA: "#980070",
    BDS: "#cc0000",
    CAPM: "#0000ff",
    CHM: "#9900ff",
    COM: "#38761d",
    CONFM: "#45818e",
    CPM: "#3d85c6",
    CRM: "#674ea7",
    CSI: "#a64d79",
    FA: "#85200c",
    HR: "#990000",
    ISM: "#b45f06",
    ISRM: "#38761d",
    PKM: "#134f5c",
    PM: "#1155cc",
    PPC: "#0b5394",
    PPM: "#351c75",
    RDM: "#5b0f00",
    RM: "#4c1130",
    SACM: "#783f04",
    SLM: "#660000",
    SPM: "#274e13",
    SRM: "#1c4587",
    SUPPM: "#7f6000",
});

// Send notification to all users holding specified role
export const notifyUsersWithRole = function(role, message) {
}

