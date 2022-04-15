import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { ApiBase } from "./api-base"

/**
 * Manages all requests to the API.
 */

const apiv1 = "/api/v1"

export class Api extends ApiBase {
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config)
  }

  async userRegister(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/dj-rest-auth/registration/", data)
  }

  async login(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/dj-rest-auth/login/", data)
  }

  async refreshAccessToken(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/user/token/refresh/", data)
  }

  async forgotPassword(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/user/forgot-password/", data)
  }

  async verifyOtp(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/user/verify-otp/", data)
  }

  async resetPassword(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/user/reset-password/", data)
  }

  async setPasscode(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/user/set-passcode/", data)
  }

  async upadtePersonalInfo(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/user/update-user-information/", data)
  }

  async updateProfileImage(data: any): Promise<Types.SimplePostResult> {
    return this.multipart_form_data(apiv1 + "/user/update-profile-image/", data, ["profile_image"])
  }

  async upadtePassword(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/user/change-password/", data)
  }

  async getLoginActivity(page: number): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + `/user/login-activity/?page=${page}`)
  }

  async verifyContacts(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/verify-existing-users/", { user_list: data })
  }

  async createFeedback(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/create-feedback/", { feedback_data: data })
  }

  async sendInvitation(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/send-invitation/", { user: data })
  }

  async getUserData(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/user/detail/")
  }

  async reSendVerificationEmail(): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/send-email-confirmation/")
  }


}
