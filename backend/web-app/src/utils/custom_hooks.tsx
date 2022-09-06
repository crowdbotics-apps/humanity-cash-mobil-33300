import {useStores} from "../models/root-store/root-store-context";

export const useApi = ()=>{
  const  rootStore = useStores()
  return rootStore.environment.api
}

export const useUserStore = ()=>{
  const  rootStore = useStores()
  return rootStore.userStore
}
