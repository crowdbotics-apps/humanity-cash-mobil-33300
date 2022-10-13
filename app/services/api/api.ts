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

  // FACEBOOK LOGIN
  async loginFacebook(accessToken: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/social/fb-login/", { accessToken: accessToken })
  }

  async loginApple(identityToken: any, fullName: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/social/apple-login/", { identityToken, fullName })
  }


  async loginGoogle(data: any, token: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/social/google-login/", { data, token })
  }

  // SETUP
  async setupConsumer(data: any): Promise<Types.SimplePostResult> {
    return this.multipart_form_data_patch(apiv1 + "/set-up-profile/consumer/", data, ["consumer_profile"])
  }

  async setupConsumerFirstStep(data: any, keys: any = []): Promise<Types.SimplePostResult> {
    return this.multipart_form_data(apiv1 + "/set-up-profile/consumer/first-step/", data, keys)
  }

  async setupConsumerSecondStep(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/set-up-profile/consumer/second-step/", data)
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

  // MY PROFILE
  async getProfileConsumer(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/my-profile/consumer/")
  }

  async getProfileMerchant(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/my-profile/merchant/")
  }

  async updateProfileConsumer(data: any): Promise<Types.SimplePostResult> {
    return this.multipart_form_data_patch(apiv1 + "/my-profile/consumer/", data, ["consumer_profile"])
  }

  async updateProfileMerchant(data: any): Promise<Types.SimplePostResult> {
    return this.multipart_form_data_patch(apiv1 + "/my-profile/merchant/", data, ["profile_picture", "background_picture"])
  }

  async getCoupons(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/coupons/")
  }

  async postCoupons(data: any): Promise<Types.SimplePostResult> {
    return this.multipart_form_data(apiv1 + "/coupons/", data, ["promo_image"])
  }

  async getConsumerCoupons(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/consumer-coupons/")
  }

  // SECURITY
  async updateSecurity(data: any): Promise<Types.SimplePostResult> {
    return this.simple_patch(apiv1 + "/security/change-password/", data)
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

  async getEvents(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/event/")
  }

  async getBusiness(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/where-to-spend/")
  }

  async getBusinessDetail(id: number): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/business-details/" + id + "/")
  }

  async getUsers(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/user/")
  }

  // DWOLLA
  async getDwollaToken(data?: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/dwolla/create-iav-token/", data)
  }

  async getFundingSources(data?: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/dwolla/my-funding-sources/", data)
  }

  async getCommunityChestData(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/community-chest/")
  }

  // BILLING
  async sendMoney(data?: any): Promise<Types.SimplePostResult> {
  // data example
  //   {
  //     "from" : 1,
  //     "to": 2,
  //     "from_is_consumer": true,
  //     "to_is_consumer": false,
  //     "password" : "pass2022",
  //     "amount" : 13.40,
  //     "roundup" : 0.60,
  // }
    return this.simple_post(apiv1 + "/send-money/", data)
  }

  async getBalanceData(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/balances/")
  }

  async postDeposit(data?: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/deposit/", data)
  }

  async postCashOut(data?: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/deposit/", data)
  }

  async getACHTransactions(data: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/ach_transaction/", data)
  }

  async getTransactions(data: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/transaction/", data)
  }
}
