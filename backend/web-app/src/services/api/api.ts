import {ApiConfig, DEFAULT_API_CONFIG} from "./api-config"
import * as Types from "./api.types"
import {ApiBase} from "./api-base";
import {API_VERSION_PREFIX} from "../constants";
import {toast} from "react-toastify";
import {genericApiError} from "../../helpers";


/**
 * Manages all requests to the API.
 */
export class Api extends ApiBase {

    constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
        super(config)
    }

    // LOGIN
    async login(data: any): Promise<Types.SimplePostResult> {
        return this.simple_post("/dj-rest-auth/login/", data)
    }
    async forgotPassword(data: any): Promise<Types.SimplePostResult> {
        return this.simple_post("/users/password_reset/", data)
    }

    async resetPassword(data: any): Promise<Types.SimplePostResult> {
        return this.simple_post("/users/reset/", data)
    }

    async createEvent(data: any): Promise<Types.SimplePostResult> {
        return this.simple_post(API_VERSION_PREFIX+"/event/", data)
    }

    async editEvent(id:number, data: any): Promise<Types.GenericResponse> {
        return this.simple_patch(API_VERSION_PREFIX+`/event/${id}/`, data)
    }

    async getEvents(data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/event/", data)
    }

    async deleteEvent(id: number): Promise<Types.GenericResponse> {
        return this.simple_delete(API_VERSION_PREFIX+`/event/${id}/`)
    }

    async getUsers(data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/user/", data)
    }

    async getConsumers(data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/consumer/", data)
    }
    async getDwollaUsers(data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/dwolla_user/", data)
    }

    async getUser(id: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+`/user/${id}/`,{})
    }

    async getDwollaUser(id: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+`/dwolla_user/${id}/`,{})
    }

    async createUser(data: any): Promise<Types.SimplePostResult> {
        return this.simple_post(API_VERSION_PREFIX+"/user/", data)
    }


    async deleteUser(id: number, callback:Function) {
        this.genericDelete(API_VERSION_PREFIX+`/user/${id}/`).then(value => {
            callback()
        })
    }

    async genericDelete(path:string) {
        this.simple_delete(path).then(response => {
            if (response.kind === "not-found") {
                console.log("error deleting event", response)
                toast.error("Object not found", {
                    position: toast.POSITION.TOP_CENTER
                });
            } else {
                toast.success('Deleted successfully', {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }).catch((error: any) => {
            genericApiError()
        })

    }

    async getProblemResult(reactant: string, reagent: number): Promise<Types.SimpleGetResult> {
        return this.simple_get(`/GenerateProduct.py?PathwayWeb=Yes&reactant=${reactant}&product=*&reagent_id=${reagent}`)
    }

    async getBlockchainTransactions(data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/transaction/", data)
    }
    async getDashboardInfo(): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/compliance/dashboard/")
    }

    async getBalances(): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/compliance_action/balances/")
    }

    async getACHTransactions(data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/ach_transaction/", data)
    }

    async getContracts(data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/contract/", data)
    }

    async getBlockchainTransaction(id:number, data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+`/transaction/${id}/`, data)
    }

    async addCompliance(data: any): Promise<Types.SimplePostResult> {
        return this.simple_post(API_VERSION_PREFIX+"/compliance_action/", data)
    }

    async getRecipients(data: any): Promise<Types.ListResult> {
        return this.simple_get(API_VERSION_PREFIX+"/compliance_recipient/", {search: data})
    }

}
