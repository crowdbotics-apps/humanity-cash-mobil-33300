import { ApiConfig, DEFAULT_API_CONFIG } from './api/api-config';
import * as Types from './api/api.types';
import { ApiBase } from './api/api-base';

/**
 * Manages all requests to the API.
 */

const api_v_prefix = '/api/v1';

export class UserApi extends ApiBase {
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config, api_v_prefix)
  }

  async userRegister(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/rest-auth/registration/', data)
  }

  async login(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/rest-auth/login/', data)
  }

  async refreshAccessToken(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/user/token/refresh/', data)
  }

  async forgotPassword(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/user/forgot-password/', data)
  }

  async verifyOtp(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/user/verify-otp/', data)
  }

  async resetPassword(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/user/reset-password/', data)
  }

  async setPasscode(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/user/set-passcode/', data)
  }

  async upadtePersonalInfo(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/user/update-user-information/', data)
  }

  async updateProfileImage(data: any): Promise<Types.SimplePostResult> {
    return this.multipart_form_data('/user/update-profile-image/', data, [
      'profile_image',
    ]);
  }

  async upadtePassword(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post('/user/change-password/', data)
  }

  async getLoginActivity(page: number): Promise<Types.SimpleGetResult> {
    return this.simple_get(`/user/login-activity/?page=${page}`)
  }
}
