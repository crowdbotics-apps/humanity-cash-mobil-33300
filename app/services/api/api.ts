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

  // SIGN UP
  async userRegister(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/dj-rest-auth/registration/", data)
  }

  async verifyUserAuthenticationCode(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/registration/verify-user-account/", data)
  }

  async setUserPassword(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/registration/set-password/", data)
  }

  async sendVerificaitonCode(): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/registration/send-verification-code/")
  }

  // LOGIN
  async login(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/dj-rest-auth/login/", data)
  }

  // SETUP
  async setupConsumer(data: any): Promise<Types.SimplePostResult> {
    return this.multipart_form_data_patch(apiv1 + "/set-up-profile/consumer/", data, ["consumer_profile"])
  }

  async setupConsumerDetail(data: any): Promise<Types.SimplePostResult> {
    return this.simple_patch(apiv1 + "/set-up-profile/consumer-detail/", data)
  }

  async setupMerchant(data: any): Promise<Types.SimplePostResult> {
    return this.multipart_form_data(apiv1 + "/set-up-profile/merchant/", data, ["profile_picture", "background_picture"])
  }

  async setupMerchantDetail(data: any): Promise<Types.SimplePostResult> {
    return this.simple_patch(apiv1 + "/set-up-profile/merchant-detail/", data)
  }

  // BASE
  async getCities(data?: any): Promise<Types.SimpleGetResult> {
    let url = apiv1 + "/base/cities/"
    if (data && data.value) url += `?search=${data.value}`
    return this.simple_get(url)
  }

  async getStates(data?: any): Promise<Types.SimpleGetResult> {
    let url = apiv1 + "/base/states/"
    if (data && data.value) url += `?search=${data.value}`
    return this.simple_get(url)
  }
}