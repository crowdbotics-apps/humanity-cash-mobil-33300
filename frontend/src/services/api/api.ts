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

  // Appointments
  async getDayAcceptedAppointments(date: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/operations/day_calendar/?day=${date}`)
  }

  async getWeekAcceptedAppointments(startDate: string, endDate: string) {
    return this.simple_get(`${API_VERSION_PREFIX}/operations/range_calendar/?date_from=${startDate}&date_to=${endDate}`)
  }

  async getMonthAcceptedAppointments(startDate: string, endDate: string) {
    return this.simple_get(`${API_VERSION_PREFIX}/operations/range_calendar/?date_from=${startDate}&date_to=${endDate}`)
  }

  async editAppointment(id: number, data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(`${API_VERSION_PREFIX}/operations/appointment/${id}/`, data)
  }

  async addAppointment(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/appointment/`, data)
  }

  async deleteAppointment(data: any): Promise<Types.GenericResponse> {
    return this.simple_delete(`${API_VERSION_PREFIX}/operations/appointment/${data.id}/`, data)
  }

  // REQUESTS
  async getPendingRequests(searchData: string, page: number = 1, ordering: string = ''): Promise<Types.SimpleGetResult> {
    const filters = `?page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/operations/pending_requests/${filters}`)
  }

  // NOTES
  async addNote(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/notes_appointment/`, data)
  }

  async editNote(id: number, data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(`${API_VERSION_PREFIX}/operations/notes_appointment/${id}/`, data)
  }

  async editNoteAppointment(id: number, data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(`${API_VERSION_PREFIX}/operations/notes_appointment/${id}/`, data)
  }

  async deleteNote(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(`${API_VERSION_PREFIX}/operations/notes_appointment/${id}/`)
  }

  async getNotesCalendar(data: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(`${API_VERSION_PREFIX}/operations/notes_calendar/`, data)
  }

  // SERVICES
  async addService(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/services/`, data)
  }

  async editService(data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(`${API_VERSION_PREFIX}/operations/services/${data.id}/`, data)
  }

  async deleteService(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(`${API_VERSION_PREFIX}/operations/services/${id}/`)
  }

  async getServices(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/operations/services/${filters}`)
  }

  // TEAMS
  async addTeam(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/team/`, data)
  }

  async editTeam(id: number, data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(`${API_VERSION_PREFIX}/operations/team/${id}/`, data)
  }

  async deleteTeam(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(`${API_VERSION_PREFIX}/operations/team/${id}/`)
  }

  async getTeams(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extra_params = {}): Promise<Types.ListResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/operations/team/${filters}`, extra_params)
  }

  async addTeamMember(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/team/${data.id}/add_team_member/`, data)
  }

  async removeEmployeeFromTeam(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/team/remove_team_member/`, data)
  }

  // CUSTOM TEAMS
  async getCustomTeams(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extra_params = {}): Promise<Types.ListResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/operations/team-custom/${filters}`, extra_params)
  }

  async addTeamCustomMember(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/team-custom/${data.id}/add_team_member/`, data)
  }

  // FREQUENCIES
  async getFrequencies(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/operations/frequency/${filters}`)
  }

  async addFrequency(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/frequency/`, data)
  }

  async editFrequency(data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(`${API_VERSION_PREFIX}/operations/frequency/${data.id}/`, data)
  }

  async deleteFrequency(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(`${API_VERSION_PREFIX}/operations/frequency/${id}/`)
  }

  // USER INFO
  async editUser(data: any, keys: any): Promise<Types.GenericResponse> {
    return this.post_multipart_form_data(`${API_VERSION_PREFIX}/users/user_info/`, data, keys)
  }

  // CUSTOMER
  async getCustomers(q: string, page: number | undefined = 1, is_autocomplete = false): Promise<Types.SimpleGetResult> {
    let url = `${API_VERSION_PREFIX}/users/customer/?q=${q}&search=${q}&page=${page}`
    if (is_autocomplete) {
      url += "&is_autocomplete=1"
    }
    return this.simple_get(url)
  }

  async getCustomersFullData(q: string, page: number | undefined = 1, pageSize = 25): Promise<Types.SimpleGetResult> {
    return this.simple_get(`${API_VERSION_PREFIX}/users/customer/?q=${q}&search=${q}&page=${page}&page_size=${pageSize}`)
  }

  async addCustomer(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/customer/`, data)
  }

  async editCustomer(id: number, data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(`${API_VERSION_PREFIX}/users/customer/${id}/`, data)
  }

  async deleteCustomer(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(`${API_VERSION_PREFIX}/users/customer/${id}/`)
  }

  async setNotificationSetting(id_customer: number, status: boolean): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/customer/${id_customer}/set_notification_status/`, {value: status})
  }

  // NOTIFICATIONS
  async getNotification(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/operations/notification/${filters}`)
  }

  async markAsRead(id: number): Promise<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/notification/${id}/mark_as_read/`)
  }

  async sendNote(id: number, data: string): Promise<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/operations/notification/${id}/send_note/`, data)
  }

  // EMPLOYEES
  async getEmployees(searchData: string = '', page: number = 1, ordering: string = '', page_size: number = 25): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/users/employee/${filters}`)
  }

  async getUnassignedEmployees(searchData: string = ''): Promise<Types.SimpleGetResult> {
    return this.simple_get(`${API_VERSION_PREFIX}/users/employee/unassigned_employees/?search=${searchData}`)
  }

  async getAllEmployees(): Promise<Types.SimpleGetResult> {
    return this.simple_get(`${API_VERSION_PREFIX}/users/employee/all_employees/`)
  }

  async addEmployee(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/employee/`, data)
  }

  async editEmployee(data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(`${API_VERSION_PREFIX}/users/employee/${data.id}/`, data)
  }

  async deleteEmployee(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(`${API_VERSION_PREFIX}/users/employee/${id}/`)
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

  async createEvent(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + "/event/", data)
  }

  async editEvent(id: number, data: any): Promise<Types.GenericResponse> {
    return this.simple_patch(API_VERSION_PREFIX + `/event/${id}/`, data)
  }

  async getEvents(data: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/event/", data)
  }

  async deleteEvent(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete(API_VERSION_PREFIX + `/event/${id}/`)
  }

  async getUsers(data: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/user/", data)
  }

  async getConsumers(data: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/consumer/", data)
  }

  async getUser(id: any): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + `/user/${id}/`, {})
  }

  async createUser(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + "/user/", data)
  }


  // async deleteUser(id: number, callback:Function) {
  //   this.genericDelete(API_VERSION_PREFIX+`/user/${id}/`).then(value => {
  //     callback()
  //   })
  // }

  async getProblemResult(reactant: string, reagent: number): Promise<Types.SimpleGetResult> {
    return this.simple_get(`/GenerateProduct.py?PathwayWeb=Yes&reactant=${reactant}&product=*&reagent_id=${reagent}`)
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

  async deleteAdminUser(id: number): Promise<Types.GenericResponse> {
    return this.simple_delete( `${API_VERSION_PREFIX}/user-admin/${id}/`)
  }

  async getDwollaUser(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post( `${API_VERSION_PREFIX}/dwolla_user/${data.id}/details/`, data)
  }

  async getTransactions(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extraData: any = {}): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(API_VERSION_PREFIX + `/compliance_action/${filters}`, extraData)
  }

  async getDashboardInfo(): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/compliance/dashboard/")
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

  async getAdjustment(searchData: string, page: number = 1, ordering: string = '', page_size: number = 25, extraData: any = {}): Promise<Types.SimpleGetResult> {
    const filters = `?page_size=${page_size}&page=${page}&search=${searchData}&ordering=${ordering}`
    return this.simple_get(`${API_VERSION_PREFIX}/compliance_action/${filters}`, extraData)
  }

  async signoffTransaction(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + `/compliance_action/${data.id}/signoff/`, data)
  }

  async getWalletBalances(): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/compliance_action/balances/")
  }

  async reconcileAndBrnTokens(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + "/compliance_action/", data)
  }

  async addAdjustmentAndMintTokens(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + "/compliance_action/", data)
  }

  async reconcileAndTransferTokens(data: any): Promise<Types.SimplePostResult> {
    return this.simple_post(API_VERSION_PREFIX + "/compliance_action/", data)
  }

  async getComplianceBalances(): Promise<Types.SimpleGetResult> {
    return this.simple_get(API_VERSION_PREFIX + "/compliance/balances/")
  }
}
