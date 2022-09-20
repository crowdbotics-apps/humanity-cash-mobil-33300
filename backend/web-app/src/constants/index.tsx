

export const ROUTES = {
  SPLASH:"/",
  LOGIN:"/login",
  FORGOT_PASSWORD:"/forgot",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: '/transactions',
  BLOCKCHAIN_TRANSACTIONS: '/blockchain-transactions',
  CONTENTS: '/content',
  EMPLOYEES: '/employees',
  SYNTHESIS_EXPLORER: (params: any) => `/synthesis-explorer/${params}` ,
  TRANSACTIONS_DETAIL: (params: any) => `/transactions/${params}` ,
  RESET_PASSWORD: `/users/reset/:uidb64/:token`
}
