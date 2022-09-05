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
  url: process.env.REACT_APP_API_URL!,
  base_url:  process.env.REACT_APP_API_BASE_URL!,
  timeout: 50000,
  isDebug: false,
}
