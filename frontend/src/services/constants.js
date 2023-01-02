

export const API_VERSION_PREFIX = '/api/v1'

export const ROUTES = {
  ROOT: "/",
  LOGOUT: "/logout",
  LOGIN: "/login",
  ADMIN: process.env.REACT_APP_API_BASE_URL + '/admin/',
  DASHBOARD: "/dashboard",
  CALENDAR: "/calendar",
  FORGOT_PASSWORD: "/forgot-password",
  SET_NEW_PASSWORD: "/set-new-password/*",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
  PRIVACY_POLICY: "/privacy-policy",
  MY_PROFILE: "/my-profile",
  EDIT_PROFILE: "/edit-profile",
}
