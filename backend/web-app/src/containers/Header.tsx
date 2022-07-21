import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";

const Header = () => {

    const location = useLocation();
    const [pathLocation, setPathLocation] = useState<string>('');


    useEffect(() => {
        if (location) {
            let path = location.pathname
            path = path.slice(1)
            setPathLocation(path)
        }
    }, [location])

    // if (true) return <></>



    return (
        <header>
            <h4 className='title-h4'>{pathLocation}</h4>
        </header>
    )

}


export default Header;

