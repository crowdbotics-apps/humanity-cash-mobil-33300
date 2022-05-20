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

    async getSynthesisProblems(): Promise<Types.SimpleGetResult> {
        return this.simple_get(`/ReactionSynthesisList.py`)
    }

    async getTextbooks(): Promise<Types.SimpleGetResult> {
        return this.simple_get(`/TextbookList.py`)
    }

    async getReactionSubjectCategories(): Promise<Types.SimpleGetResult> {
        return this.simple_get(`/ReactionCategoryList.py`)
    }

    async getProblem(reaction_synthesis_id: number): Promise<Types.SimpleGetResult> {
        return this.simple_get(`/GenerateProblem.py?reaction_synthesis_id=${reaction_synthesis_id}&userID=null&user_class_id=&ProductWeb=Yes`)
    }

    async getProblemResult(reactant: string, reagent: number): Promise<Types.SimpleGetResult> {
        return this.simple_get(`/GenerateProduct.py?PathwayWeb=Yes&reactant=${reactant}&product=*&reagent_id=${reagent}`)
    }


}
