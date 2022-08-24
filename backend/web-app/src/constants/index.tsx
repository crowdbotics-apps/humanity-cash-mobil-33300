

export const ROUTES = {
  SPLASH:"/",
  LOGIN:"/start-form",
  DASHBOARD: "/dashboard",
  AchTransactions: '/transactions',
  CONTENTS: '/content',
  SYNTHESIS_EXPLORER: (params: any) => `/synthesis-explorer/${params}` ,
  TRANSACTIONS: (params: any) => `/transactions/${params}` ,
}
