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
  async sendVerificaitonCode(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/registration/send-verification-code/", data)
  }
  // LOGIN
  async login(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/dj-rest-auth/login/", data)
  }

  // SETUP
  async setupConsumer(data: any): Promise<Types.SimplePostResult> {
    return this.simple_patch(apiv1 + "/set-up-profile/consumer/", data)
  }
  async setupConsumerDetail(data: any): Promise<Types.SimplePostResult> {
    return this.simple_patch(apiv1 + "/set-up-profile/consumer-detail/", data)
  }
  async setupMerchant(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/set-up-profile/merchant/", data)
  }
  async setupMerchantDetail(data: any): Promise<Types.SimplePostResult> {
    return this.simple_patch(apiv1 + "/set-up-profile/merchant-detail/", data)
  }

}
