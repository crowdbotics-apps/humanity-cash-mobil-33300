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
  // url: 'http://192.168.100.3:7112/cgibin/api/v1',
  // base_url: 'http://192.168.100.3:7112',

   url: 'https://gkpy.net/cgibin/api/v1/',
   base_url: 'https://gkpy.net/',



  timeout: 50000,
  isDebug: false,
}