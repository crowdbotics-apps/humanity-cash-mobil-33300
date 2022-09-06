import {ApiConfig, DEFAULT_API_CONFIG} from "./api-config"
import * as Types from "./api.types"
import {ApiBase} from "./api-base";


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

    async getProblemResult(reactant: string, reagent: number): Promise<Types.SimpleGetResult> {
        return this.simple_get(`/GenerateProduct.py?PathwayWeb=Yes&reactant=${reactant}&product=*&reagent_id=${reagent}`)
    }


}
