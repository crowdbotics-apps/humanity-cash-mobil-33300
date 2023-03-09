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

  // DELETE
  async deleteAccount(): Promise<Types.GenericResponse> {
    return this.simple_delete(apiv1 + `/security/delete-account/`)
  }

  // LOGIN
  async login(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/dj-rest-auth/login/", data)
  }

  async forgotPassword(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/users/password_reset_mobile/", data)
  }

  async verifyUserResetCode(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/users/verify_reset_code/", data)
  }

  async passwordSet(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post("/users/password_set_mobile/", data)
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
  async setupConsumer(data: any, keys: any = []): Promise<Types.SimplePostResult> {
    return this.post_multipart_form_data(apiv1 + "/set-up-profile/consumer/", data, keys)
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

  async setupMerchant(data: any, keys: any = []): Promise<Types.SimplePostResult> {
    return this.post_multipart_form_data(apiv1 + "/set-up-profile/merchant/", data, keys)
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

  async updateProfileConsumer(data: any, keys: any = []): Promise<Types.SimplePostResult> {
    return this.patch_multipart_form_data(apiv1 + "/my-profile/consumer/", data, keys)
  }

  async updateProfileMerchant(data: any, keys: any = []): Promise<Types.SimplePostResult> {
    return this.patch_multipart_form_data(apiv1 + "/my-profile/merchant/", data, keys)
  }

  async getCoupons(data: any = {}): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/coupons/", data)
  }

  async postCoupons(data: any, keys: any = []): Promise<Types.SimplePostResult> {
    return this.multipart_form_data(apiv1 + "/coupons/", data, keys)
  }

  async getConsumerCoupons(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/consumer-coupons/")
  }

  async postConsumerCoupon(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/consumer-coupons/", data)
  }

  async deleteConsumerCoupon(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(apiv1 + `/consumer-coupons/${id}/`)
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
    return this.simple_get(apiv1 + "/user/?limit=999&ordering=email")
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
    return this.simple_post(apiv1 + "/send-money/", data)
  }

  async sendReturn(data?: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/send-return/", data)
  }

  async getBalanceData(): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/balances/")
  }

  async postDeposit(data?: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/deposit/", data)
  }

  async postCashOut(data?: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/withdraw/", data)
  }

  async getACHTransactions(data?: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/ach_transaction/", data)
  }

  async getMobileTransactions(data?: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/transaction_mobile/", data)
  }

  async getTransactions(data?: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(apiv1 + "/transaction/", data)
  }

  async sendReport(data?: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/send-report/", data)
  }

  async sendQR(data?: any): Promise<Types.SimplePostResult> {
    return this.simple_post(apiv1 + "/send-qr/", data)
  }
}
