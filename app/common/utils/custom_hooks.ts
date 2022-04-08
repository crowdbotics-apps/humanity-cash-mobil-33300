import {useStores} from "../models";

export const useUserApi = ()=>{
    const  rootStore = useStores()
    return rootStore.environment.api.user
}

export const useLoginStore = ()=>{
    const  rootStore = useStores()
    return rootStore.loginStore
}

export const useMarinasApi = ()=>{
    const  rootStore = useStores()
    return rootStore.environment.api.marinas
}