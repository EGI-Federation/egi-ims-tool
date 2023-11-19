import { store } from "@/store";
import { isValid, isSuccess } from '@/utils'
import { sendMessage } from "@/api/sendMessage";
import { sendMessageToUsersWithRole } from "@/api/sendMessageToRole";


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

// Send process-specific notification to a user
export const notifyUser = function(t, processCode, user, message, messageLink) {
    let smResult = sendMessage(store.state.oidc?.access_token, processCode, user,
                                   message, messageLink,
                                   process.env.VUE_APP_IMS_MSG_API);
    smResult.notify().then(() => {
        if(isSuccess(t, smResult))
            // Notification sent
            console.log(`Sent notification to ${user.fullName}`);
    });
}

// Send notifications to all users holding a role
export const notifyUsersWithRole = function(t, processCode, role, message, messageLink) {
    let srmResult = sendMessageToUsersWithRole(store.state.oidc?.access_token, processCode, role,
                                                   message, messageLink,
                                                   process.env.VUE_APP_IMS_MSG_API);
    srmResult.notify().then(() => {
        if(isSuccess(t, srmResult)) {
            // Notification sent
            console.log(`Sent notifications to users with role ${processCode}.${role}`);
        }
    });
}

// Send notifications about a change affecting a user
// Sends a notification to the affected user, and notifications to all users holding the specified role
export const notifyUserChanges = function(t, processCode,
                                          user, userMessage, userMessageLink,
                                          role, roleMessage, roleMessageLink) {
    // If the user is the currently logged-in user, do not send the user message
    // We should know what we did, right?
    const userInfo = store.state.oidc?.user;
    if(isValid(userInfo.voperson_id) && userInfo.voperson_id !== user.chekinUserId)
        // Send user notification
        notifyUser(t, processCode, user, userMessage, userMessageLink);

    if(isValid(role) && isValid(roleMessage))
        // Send notification to all users with specified role
        // This will skip the caller, if (s)he has the role
        notifyUsersWithRole(t, processCode, role, roleMessage, roleMessageLink);
}
