import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";

type Props = {
    title?:string | React.ReactNode
}
const Header: React.FC<Props>  =  ({ title }) => {

    const location = useLocation();

    return (
        <header>
            {typeof title === "string" && (
              <div className='title-h4'>{title} </div>
            )||(
              title
            )}

        </header>
    )

}


export default Header;

