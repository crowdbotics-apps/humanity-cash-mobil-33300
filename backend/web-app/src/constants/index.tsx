

export const ROUTES = {
  SPLASH:"/",
  LOGIN:"/start-form",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: '/transactions',
  CONTENTS: '/content',
  SYNTHESIS_EXPLORER: (params: any) => `/synthesis-explorer/${params}` ,
  TRANSACTIONS_DETAIL: (params: any) => `/transactions/${params}` ,
}
