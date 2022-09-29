import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";

type Props = {
    title?:string
}
const Header: React.FC<Props>  =  ({ title }) => {

    const location = useLocation();

    return (
        <header>
            <div className='title-h4'>{title} </div>
        </header>
    )

}


export default Header;

