/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  base_url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number

  isDebug: boolean
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  // url: 'http://0.0.0.0:8000',
  // base_url: 'http://0.0.0.0:8000',

  url: "https://humanity-cash-mobil-33300.botics.co",
  base_url: 'https://humanity-cash-mobil-33300.botics.co',



  timeout: 50000,
  isDebug: false,
}
