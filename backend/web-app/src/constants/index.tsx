

export const ROUTES = {
  SPLASH:"/",
  LOGIN:"/login",
  FORGOT_PASSWORD:"/forgot",
  USERS:"/users",
  USERS_DETAIL: (params: any) => `/users/${params}` ,
  DASHBOARD: "/dashboard",
  TRANSACTIONS: '/transactions',
  BLOCKCHAIN_TRANSACTIONS: '/blockchain-transactions',
  CONTENTS: '/content',
  SOCIAL: '/social',
  WALLET: '/wallet',
  EMPLOYEES: '/employees',
  SYNTHESIS_EXPLORER: (params: any) => `/synthesis-explorer/${params}` ,
  TRANSACTIONS_DETAIL: (params: any) => `/transactions/${params}` ,
  RESET_PASSWORD: `/users/reset/:uidb64/:token`
}
