import {
    ListResult,
    NoResponseGetResult,
    NoResponsePostResult,
    SimpleGetResult,
    SimplePostResult,
    SingleResult
} from "./api.types"
import {getGeneralApiProblem} from "./api-problem"
import * as Types from "./api.types"
import {ApiResponse, ApisauceInstance, create} from "apisauce"
import {ApiConfig, DEFAULT_API_CONFIG} from "./api-config"


/**
 * Manages all requests to the API.
 */
export class ApiBase {
    /**
     * The underlying apisauce instance which performs the requests.
     */
    public apisauce: ApisauceInstance | undefined

    /**
     * Configurable options.
     */
    config: ApiConfig

    /**
     * Creates the api.
     *
     * @param config The configuration to use.
     */
    constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
        this.config = config
    }

    /**
     * Sets up the API.  This will be called during the bootup
     * sequence and will happen before the first React component
     * is mounted.
     *
     * Be as quick as possible in here.
     */
    setup() {
        // construct the apisauce instance
        this.apisauce = create({
            baseURL: this.config.url,
            timeout: this.config.timeout,
            headers: {
                Accept: "application/json"
            }
        })
    }



    // ###### generics / helpers desde aca, agregar vistas nuevas arriba de este punto
    // ###### generics / helpers desde aca, agregar vistas nuevas arriba de este punto
    // ###### generics / helpers desde aca, agregar vistas nuevas arriba de este punto
    // ###### generics / helpers desde aca, agregar vistas nuevas arriba de este punto

    async paginated_list_view<T extends ListResult>(path: string, page?: number, perPage?: number, order?: any, search?: string, extra_params?: any): Promise<T> {
        const params = Object.assign({
            page,
            perPage,
            ordering: order,
            search
        }, extra_params)
        return this.simple_get(path, params)
    }

    async single_casted_get_view<T extends SingleResult>(path: string, extra_params: {}, field: string): Promise<T> {
        const respuesta = await this.simple_get(path,extra_params)
        // casteo a T
        if (respuesta.kind === "ok") {
            const ret = {kind: "ok"}
            ret[field] = respuesta.data
            return ret as T
        } else
        {return respuesta as T}

    }

    async single_get_view<T extends SingleResult>(path: string, extra_params?: any, axios?: any): Promise<T> {
        return this.simple_get(path,extra_params, axios)
    }

    async single_list_view<T extends ListResult>(path: string, extra_params?: any): Promise<T> {
        return this.simple_get(path,extra_params)
    }

    async noresult_get<T extends NoResponseGetResult>(path: string, extra_params?: any): Promise<T> {
        const respuesta = await this.simple_get(path,extra_params)
        // casteo a NoResponseGetResult
        return ((respuesta.kind === "ok") ? { kind: "ok" } : respuesta) as T
    }

    async simple_get<T extends SimpleGetResult>(path: string, extra_params?: any, axios?: any): Promise<T> {
        if (!this.apisauce) {
            return {kind: "unknown", temporary: true} as T
        }

        const response: ApiResponse<any> = await this.apisauce.get(path, extra_params, axios)

        if (!response.ok) {
            if (response.status === 400) {
                return {kind: "bad-data", errors: response.data} as T
            } else {
                const problem = getGeneralApiProblem(response)
                if (problem) {return problem as T}
            }
        }

        try {
            return {kind: "ok", data: response.data} as T
        } catch {
            return {kind: "bad-data"} as T
        }
    }

    async noresult_post<T extends NoResponsePostResult>(path: string, params?: any): Promise<T> {
        const respuesta = await this.simple_post(path,params)
        // casteo a NoResponseGetResult
        return ((respuesta.kind === "ok") ? { kind: "ok" } : respuesta) as T
    }

    async simple_post<T extends SimplePostResult>(path: string, params?: any, axios?: any): Promise<T> {
        if (!this.apisauce) {
            return {kind: "unknown", temporary: true} as T
        }

        const response: ApiResponse<any> = await this.apisauce.post(path, params, axios)

        if (!response.ok) {
            if (response.status === 400) {
                return {kind: "bad-data", errors: response.data} as T
            } else {
                const problem = getGeneralApiProblem(response)
                if (problem) {return problem as T}
            }
        }

        try {
            return {kind: "ok", response: response.data} as T
        } catch {
            return {kind: "bad-data"} as T
        }
    }

    async simple_id_save_or_create<T extends SimplePostResult>(pathBase: string, datos: { id?: number}): Promise<T> {
        if (datos.id) {
            return this.simple_patch(`${pathBase}/${datos.id}/`, datos)
        } else {
            return this.simple_post(`${pathBase}/`, datos)
        }
    }

    async simple_put<T extends SimplePostResult>(path: string, data?: any): Promise<T> {
        if (!this.apisauce) {
            return {kind: "unknown", temporary: true} as T
        }

        const response: ApiResponse<any> = await this.apisauce.put(path, data)

        if (!response.ok) {
            if (response.status === 400) {
                return {kind: "bad-data", errors: response.data} as T
            } else {
                const problem = getGeneralApiProblem(response)
                if (problem) {return problem as T}
            }
        }

        try {
            return {kind: "ok", response: response.data} as T
        } catch {
            return {kind: "bad-data"} as T
        }
    }

    async simple_patch<T extends SimplePostResult>(path: string, data?: any): Promise<T> {
        if (!this.apisauce) {
            return {kind: "unknown", temporary: true} as T
        }

        const response: ApiResponse<any> = await this.apisauce.patch(path, data)

        if (!response.ok) {
            if (response.status === 400) {
                return {kind: "bad-data", errors: response.data} as T
            } else {
                const problem = getGeneralApiProblem(response)
                if (problem) {return problem as T}
            }
        }

        try {
            return {kind: "ok", response: response.data} as T
        } catch {
            return {kind: "bad-data"} as T
        }
    }

    async simple_delete(path: string): Promise<Types.GenericResponse> {
        if (!this.apisauce) {
            return {kind: "unknown", temporary: true}
        }

        const response: ApiResponse<any> = await this.apisauce.delete(path)

        if (!response.ok) {
            if (response.status === 400) {
                return {kind: "bad-data", errors: response.data}
            } else {
                const problem = getGeneralApiProblem(response)
                if (problem) {return problem}
            }
        }

        try {
            return {kind: "ok"}
        } catch {
            return {kind: "bad-data"}
        }
    }

    async multipart_form_data(path: string, data: any, keys: any): Promise<Types.SimplePostResult> {
        if (!this.apisauce) {
            return {kind: "unknown", temporary: true}
        }

        let fdata = new FormData()
        for (const key in data) {
            if (keys.includes(key) && (!data[key] || typeof data[key] === "string")) {
                continue
            }
            if (keys.includes(key)) {
                fdata.append(key, data[key], "image.png")
            } else {
                if (Array.isArray(data[key])) {
                    fdata.append(key, data[key].join(","))
                } else {
                    fdata.append(key, data[key] || "")
                }
            }

        }
        let response
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": this.apisauce.headers.Authorization
        }
        try {
            if (data.id) {
                path += data.id + "/"
                response = await this.apisauce.axiosInstance.patch(path, fdata, {headers})
            } else {
                response = await this.apisauce.axiosInstance.post(path, fdata, {headers})
            }
        } catch (e) {
            if (e.message.indexOf("status code 400") !== -1) {
                return {kind: "bad-data", errors: e.response.data}
            }
            response = {status: 500}
        }

        if (response.status === 400) {
            // @ts-ignore
            return {kind: "bad-data", errors: response.data}
        } else {
            // @ts-ignore
            const problem = getGeneralApiProblem(response)
            if (problem) {return problem}
        }

        try {
            // @ts-ignore
            return {kind: "ok", response: response.data}
        } catch {
            return {kind: "bad-data"}
        }
    }

    async multipart_form_data_patch(path: string, data: any, keys: any): Promise<Types.SimplePostResult> {
        if (!this.apisauce) {
            return {kind: "unknown", temporary: true}
        }

        let fdata = new FormData()
        for (const key in data) {
            if (keys.includes(key) && (!data[key] || typeof data[key] === "string")) {
                continue
            }
            if (keys.includes(key)) {
                fdata.append(key, data[key], "image.png")
            } else {
                if (Array.isArray(data[key])) {
                    fdata.append(key, data[key].join(","))
                } else {
                    fdata.append(key, data[key] || "")
                }
            }

        }
        let response
        console.log(' header -> ', this.apisauce.headers.Authorization)
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": this.apisauce.headers.Authorization
        }
        try {
            response = await this.apisauce.axiosInstance.patch(path, fdata, {headers})
        } catch (e) {
            if (e.message.indexOf("status code 400") !== -1) {
                return {kind: "bad-data", errors: e.response.data}
            }
            response = {status: 500}
        }

        console.log(' response multipart_form_data_patch ===>>> ', response)

        if (response.status === 400) {
            // @ts-ignore
            return {kind: "bad-data", errors: response.data}
        } else {
            // @ts-ignore
            const problem = getGeneralApiProblem(response)
            if (problem) {return problem}
        }

        try {
            // @ts-ignore
            return {kind: "ok", response: response.data}
        } catch {
            return {kind: "bad-data"}
        }
    }

    // ###### generics / helpers hasta aca, agregar vistas nuevas arriba de esta seccion
    // ###### generics / helpers hasta aca, agregar vistas nuevas arriba de esta seccion
    // ###### generics / helpers hasta aca, agregar vistas nuevas arriba de esta seccion
    // ###### generics / helpers hasta aca, agregar vistas nuevas arriba de esta seccion

}
