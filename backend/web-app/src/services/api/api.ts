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

    async getEvents(data: any): Promise<Types.SimpleGetResult> {
        return this.simple_get(API_VERSION_PREFIX+"/event/", data)
    }

    async getProblemResult(reactant: string, reagent: number): Promise<Types.SimpleGetResult> {
        return this.simple_get(`/GenerateProduct.py?PathwayWeb=Yes&reactant=${reactant}&product=*&reagent_id=${reagent}`)
    }

}
