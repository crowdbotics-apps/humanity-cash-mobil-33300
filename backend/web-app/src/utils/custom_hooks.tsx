import {useStores} from "../models/root-store/root-store-context";

export const useApi = ()=>{
  const  rootStore = useStores()
  return rootStore.environment.api
}

