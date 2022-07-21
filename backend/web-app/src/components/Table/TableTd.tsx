import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { modifyTdItem } from './utils';


type tdProps = {
    id: any;
    info: any;
    title: any;
    data: any;
    dataId: any;
};





const TableTd = ({ id, info, title, data, dataId }: tdProps) => {

    const location = useLocation();
    const navigate = useNavigate();
    const [pathLocation, setPathLocation] = useState<string>('');

    useEffect(() => {
        if (location) {
            let path = location.pathname
            path = path.slice(1)
            setPathLocation(path)
        }
    }, [location])

    console.log(pathLocation, 'pathLocationpathLocation------------TableTd')

    let span = modifyTdItem(info,data, title);
    




    return <td onClick={(e) => !pathLocation.includes(dataId) && navigate(`/${pathLocation}/${dataId}`)} className={`cell_${info}`} key={info + '_' + id}>{span}</td>
}

export default TableTd;