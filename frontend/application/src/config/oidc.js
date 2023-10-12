
export const oidcSettings = function() {
    return {
        accessTokenExpiringNotificationTime: 3570,
        authority: process.env.VUE_APP_EGI_CHECKIN_SERVER,
        clientId: "egi-capacity-registry",
        redirectUri: window.location.origin + "/oidc-callback",
        popupRedirectUri: window.location.origin + "/oidc-callback-popup",
        responseType: "code",
        scope: "openid email profile voperson_id eduperson_entitlement offline_access",
        automaticSilentRenew: true,
        automaticSilentSignin: true,
        silentRedirectUri: window.location.origin + "/oidc-silent-renew",
        post_logout_redirect_uri: window.location.origin,
    };
}
