import React from 'react';
import {Navigate} from 'react-router-dom';
import {useStores} from "../../models";


const BaseProtectedComponentPage = ({children, loginRequired}) => {
    const rootStore = useStores()
    const {loginStore} = rootStore
    const isLoggedIn = loginStore.isLoggedIn;

    if (!loginRequired){
        return children;
    }
    if (isLoggedIn) {
        return children;
    } else {
        return <Navigate to='/login'/>;
    }
};

export default BaseProtectedComponentPage;
