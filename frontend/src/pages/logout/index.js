import React, {useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {useStores} from "../../models";
import {ROUTES} from "../../services/constants";


const Logout = () => {
  const rootStore = useStores()
  const {loginStore} = rootStore

  useEffect(() => {
    loginStore.reset()
  } , [])

  return <Navigate to={ROUTES.LOGIN}/>
};

export default Logout;
