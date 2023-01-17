import {ApiConfig, DEFAULT_API_CONFIG} from "./api-config"
import * as Types from "./api.types"
import {ApiBase} from "./api-base";
import {API_VERSION_PREFIX} from "../constants";


/**
 * Manages all requests to the API.
 */
export class Api extends ApiBase {

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config)
  }

  async login(username: string, password: string): Promise<Types.SimplePostResult> {
    return this.simple_post(`/dj-rest-auth/login/`, {
      email: username,
      password,
    })
  }

  async forgotPassword(email: string): Promise<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/reset-password/`, {email: email})
  }

  async resetPassword(data: any): Promise<Types.GenericResponse> {
    return this.simple_post(`/users/reset/`, data)
  }

  // TERMS AND CONDITIONS
  async getTermsConditions(): Promise<Types.SimpleGetResult> {
    return this.simple_get(`${API_VERSION_PREFIX}/terms_and_conditions/`)
  }

  async getPrivacyPolicy(): Promise<Types.SimpleGetResult> {
    return this.simple_get(`${API_VERSION_PREFIX}/privacy_policy/`)
  }

  // DJANGO CITIES
  async getRegions() {
    return this.simple_get(`${API_VERSION_PREFIX}/regions/`)
  }

  async getCities(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/cities/`, data)
  }

  // ===========>

  async createEvent(data: any, keys: any): Promise<Types.SimplePostResult> {
    return this.post_multipart_form_data(API_VERSION_PREFIX + "/event/", data, keys)
  }

  async editEvent(id: number, data: any, keys: any): Promise<Types.GenericResponse> {
    return this.patch_multipart_form_data(API_VERSION_PREFIX + `/event/${id}/`, data, keys)
  }

  async getEvents(data: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/event/", data)
  }

  async deleteEvent(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(API_VERSION_PREFIX + `/event/${id}/`)
  }

  async getBlockchainTransactions(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extraData: any = {}): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/transaction/${filters}`, extraData)
  }

  async getBlockchainTransaction(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + `/transaction/${data.id}/show_detail_data/`, data)
  }

  async getDwollaUsers(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extraData: any = {}): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/dwolla_user/${filters}`, extraData)
  }

  async getAdminUsers(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extraData: any = {}): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/user-admin/${filters}`, extraData)
  }

  async createAdminUser(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post( `${API_VERSION_PREFIX}/user-admin/`, data)
  }

  async editadminUser(data: any): Promise<Types.SimplePostResult> {
    return this.simple_patch( `${API_VERSION_PREFIX}/user-admin/${data.id}/`, data)
  }

  async deleteAdminUser(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete( `${API_VERSION_PREFIX}/user-admin/${id}/`)
  }

  async reSendAdminUserEmail(id: number): Promise<Types.GenericResponse> {
    return this.simple_post( `${API_VERSION_PREFIX}/user-admin/${id}/email/`)
  }

  async getDwollaUser(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post( `${API_VERSION_PREFIX}/dwolla_user/${data.id}/details/`, data)
  }

  async getTransactions(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extraData: any = {}): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(API_VERSION_PREFIX + `/compliance_action/${filters}`, extraData)
  }

  async getACHTransactions(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extraData: any = {}): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(  `${API_VERSION_PREFIX}/ach_transaction/${filters}`, extraData)
  }

  async getContracts(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extraData: any = {}): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(API_VERSION_PREFIX + `/contract/${filters}`, extraData)
  }

  async addAdjustment(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + "/compliance_action/", data)
  }

  async signoffTransaction(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + `/compliance_action/${data.id}/signoff/`, data)
  }

  async getWalletBalances(): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/compliance_action/balances/")
  }

  async getComplianceBalances(): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/compliance/balances/")
  }
}
