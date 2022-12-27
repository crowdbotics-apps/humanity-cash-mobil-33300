import React, {useEffect, useState} from 'react';
import {RootStoreProvider, setupRootStore} from "./models";


const StoreApp = (props) => {
    const [rootStore, setRootStore] = useState(undefined)

    // Kick off initial async loading actions, like loading fonts and RootStore
    useEffect(() => {
        (async () => {
            // await initFonts() // expo
            setupRootStore().then(setRootStore)
        })()
    }, [])

    if (!rootStore) {
        return null
    }

    return (
        <RootStoreProvider value={rootStore}>
            {props.children}
        </RootStoreProvider>
    );
}

export default StoreApp;
