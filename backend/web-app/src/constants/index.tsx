

export const ROUTES = {
  SPLASH:"/",
  LOGIN:"/start-form",
  DASHBOARD: "/dashboard",
  AchTransactions: '/transactions',
  SYNTHESIS_EXPLORER: (params: any) => `/synthesis-explorer/${params}` ,
  TRANSACTIONS: (params: any) => `/transactions/${params}` ,
}
