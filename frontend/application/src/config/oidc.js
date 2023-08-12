
export const oidcSettings = {
  accessTokenExpiringNotificationTime: 3570,
  authority: process.env.EGI_CHECKIN_SERVER || "https://aai-demo.egi.eu/auth/realms/egi",
  clientId: "egi-capacity-registry",
  redirectUri: "http://localhost:8080/oidc-callback",
  popupRedirectUri: "http://localhost:8080/oidc-callback-popup",
  redirect_uri: "http://localhost:8080/oidc-callback-error",
  responseType: "code",
  scope: "openid email profile voperson_id eduperson_entitlement offline_access",
  automaticSilentRenew: true,
  automaticSilentSignin: false,
  silentRedirectUri: "http://localhost:8080/oidc-silent-renew.html",
};
