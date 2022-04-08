import { ApiConfig, DEFAULT_API_CONFIG } from './api-config'
// import * as Types from './api.types';
import { ApiBase } from './api-base'
import { UserApi } from '../user_api'
// import {MarinasApi} from "../marinas_api";
import {create} from "apisauce";

/**
 * Manages all requests to the API.
 */

const apiv1 = '/api/v1'

export class Api extends ApiBase {
  user: UserApi
  // marinas: MarinasApi

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config)
    // this.userApi
    this.user = new UserApi(config)
    // this.marinas = new MarinasApi(config)

  }

  setHeader(key:string, value:string){
    if(this.apisauce){
      this.apisauce.setHeader(key, value)
    }
    if(this.user.apisauce){
      this.user.apisauce.setHeader(key, value)
    }
    // if(this.marinas.apisauce){
    //   this.marinas.apisauce.setHeader(key, value)
    // }
  }

  deleteHeader(key:string){
    if(this.apisauce){
      this.apisauce.deleteHeader(key)
    }
    if(this.user.apisauce){
      this.user.apisauce.deleteHeader(key)
    }
    // if(this.marinas.apisauce){
    //   this.marinas.apisauce.deleteHeader(key)
    // }
  }

  async setup() {
    await super.setup()
    await this.user.setup()
    // await this.marinas.setup()
  }

  // async userRegister(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post("/rest-auth/registration/", data)
  // }
  //
  // async login(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post("/rest-auth/login/", data)
  // }
  //
  // async refreshAccessToken(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/token/refresh/", data)
  // }
  //
  // async forgotPassword(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/forgot-password/", data)
  // }
  //
  // async verifyOtp(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/verify-otp/", data)
  // }
  //
  // async resetPassword(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/reset-password/", data)
  // }
  //
  // async setPasscode(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/set-passcode/", data)
  // }
  //
  // async upadtePersonalInfo(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/update-user-information/", data)
  // }
  //
  // async updateProfileImage(data: any): Promise<Types.SimplePostResult> {
  //   return this.multipart_form_data(apiv1 + "/user/update-profile-image/", data, ["profile_image"])
  // }
  //
  // async upadtePassword(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/change-password/", data)
  // }
  //
  // async getLoginActivity(page: number): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + `/user/login-activity/?page=${page}`)
  // }
  //
  // async verifyContacts(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/verify-existing-users/", { user_list: data })
  // }
  //
  // async createFeedback(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/create-feedback/", { feedback_data: data })
  // }
  //
  // async sendInvitation(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/send-invitation-email/", { user: data })
  // }
  //
  // async getUserData(): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + "/user/detail/")
  // }
  //
  // async reSendVerificationEmail(): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/send-email-confirmation/")
  // }
  //
  // async getPlaidLinkToken(): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + "/financial/plaid/", { public_token: true })
  // }
  //
  // async setAccessTokenPlaid(
  //   public_token: string,
  //   metadata_json: string
  // ): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/plaid/", {
  //     public_token: public_token,
  //     metadata_json: metadata_json
  //   })
  // }
  //
  // async getPlaidAccounts(): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + "/financial/plaid/", { accounts: true })
  // }
  //
  // async getUserInstitutions(): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + "/financial/institution/")
  // }
  // async getUserVerifiedContacts(): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + "/user-contacts/")
  // }
  //
  // async createFinplan(data: any): Promise<Types.SimplePostResult> {
  //   return this.multipart_form_data(apiv1 + "/financial/finplan/", data, ["finplan_image"])
  // }
  //
  // async getUserFinplans(data: any): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + "/financial/finplan/", { filter: data })
  // }
  //
  // async getUserFinplan(id: string): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + `/financial/finplan/${id}/`)
  // }
  //
  // async getNotifications(): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + "/user/notification/")
  // }
  //
  // async getTransactions(data: any): Promise<Types.SimpleGetResult> {
  //   return this.simple_get(apiv1 + "/financial/transaction/", { filter: data })
  // }
  //
  // async sendMoneyP2P(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/send-money-p2p/", data)
  // }
  //
  // async setDevice(
  //   userId: string,
  //   pushToken: string,
  //   active: boolean
  // ): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/set-device/", {
  //     user_id: userId,
  //     push_token: pushToken,
  //     active
  //   })
  // }
  //
  // async joinRejectFinplan(
  //   finplan_id: number,
  //   join: boolean,
  //   notification_id: number
  // ): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/join-reject-finplan/", {
  //     finplan_id,
  //     join,
  //     notification_id
  //   })
  // }
  //
  // async finplanAction(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/finplan-action/", data)
  // }
  //
  // async patchNotification(id: number, data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_patch(apiv1 + `/user/notification/${id}/`, data)
  // }
  //
  // async verifyPasscode(passcode: number): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/user/verify-passcode/", {passcode: passcode})
  // }
  //
  // async removeUserFinplan(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/finplan-remove-user/", data)
  // }
  //
  // async stripePayment(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/stripe-payment/", data)
  // }
  //
  // async stripeGetCards(): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/stripe-cards/")
  // }
  //
  // async stripeDeleteCard(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/stripe-delete-card/", data)
  // }
  //
  // async addMoney(data: any): Promise<Types.SimplePostResult> {
  //   return this.simple_post(apiv1 + "/financial/add-money/", data)
  // }
}
