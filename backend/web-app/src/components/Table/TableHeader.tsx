import React, { useState, useEffect } from 'react';
import { moveToUppercase, deleteItems } from './utils'


import RowHeaders from './RowHeaders'

type HeadersProps = {
    headers: any;
    delete_items: boolean;
};



const TableHeader = ({ headers, delete_items }: HeadersProps) => {

    const [headerRows, setHeaderRows] = useState<any>([]);


    useEffect(() => {
        if (headers.length > 0) {
            let headerRow = headers.find((row: object) => (row))
            let header = Object.keys(headerRow)
            header = header.filter((item: any) => deleteItems(item, delete_items) && item)
            header = moveToUppercase(header)
            setHeaderRows(header)
        }
    }, [headers])


    return (
        <thead>
            <tr className='table-header'>
                <RowHeaders headerRows={headerRows} />
            </tr>
        </thead>
    );
}

export default TableHeader;
