
export const oidcSettings = {
  accessTokenExpiringNotificationTime: 3570,
  authority: process.env.EGI_CHECKIN_AUTH_SERVER || "https://aai-demo.egi.eu/auth/realms/egi",
  clientId: "egi-capacity-registry",
  redirectUri: "http://localhost:8080/login",
  //popupRedirectUri: "http://localhost:5002/oidc-popup-callback",
  responseType: "code",
  scope: "openid email profile voperson_id eduperson_entitlement offline_access",
  automaticSilentRenew: true,
  automaticSilentSignin: false,
  silentRedirectUri: "http://localhost:5002/silent-renew-oidc.html",
};
