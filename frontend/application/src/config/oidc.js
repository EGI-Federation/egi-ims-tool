
export const oidcSettings = {
  accessTokenExpiringNotificationTime: 3570,
  authority: process.env.EGI_CHECKIN_SERVER || "https://aai-demo.egi.eu/auth/realms/egi",
  clientId: "egi-capacity-registry",
  redirectUri: window.location.origin + "/oidc-callback",
  popupRedirectUri: window.location.origin + "/oidc-callback-popup",
  redirect_uri: window.location.origin + "/oidc-callback-error",
  responseType: "code",
  scope: "openid email profile voperson_id eduperson_entitlement offline_access",
  automaticSilentRenew: true,
  automaticSilentSignin: false,
  silentRedirectUri: window.location.origin + "/oidc-silent-renew",
};
