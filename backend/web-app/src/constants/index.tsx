

export const ROUTES = {
  SPLASH:"/",
  LOGIN:"/start-form",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: '/transactions',
  CONTENTS: '/content',
  EMPLOYEES: '/employees',
  SYNTHESIS_EXPLORER: (params: any) => `/synthesis-explorer/${params}` ,
  TRANSACTIONS_DETAIL: (params: any) => `/transactions/${params}` ,
  RESET_PASSWORD: `/users/reset/:uidb64/:token`
}
