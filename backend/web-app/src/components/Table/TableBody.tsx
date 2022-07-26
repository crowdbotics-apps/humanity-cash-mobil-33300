import React, { useState, useEffect } from 'react';
import TableTd from './TableTd'
import { deleteItems } from './utils'
type TableBodyProps = {
    date_rows: any;
    delete_items: boolean;
}


const TableBody = ({ date_rows, delete_items }: TableBodyProps) => {

    const [bodyRows, setBodyRows] = useState<any>([]);

    useEffect(() => {
        if (date_rows.length > 0) {

            setBodyRows(date_rows)
        }
    }, [date_rows])


    return (
        <tbody>
            {bodyRows.length > 0 && bodyRows.map((value: any, keyRows: any) => {
                return (
                    <tr className='table-row' key={keyRows}>
                        {Object.keys(value).map((info: any, key: any) => {
                            if (deleteItems(info,delete_items)) return <TableTd info={info} id={key} data={value} dataId={value.id} title={value[info]} />
                        }
                        )}
                    </tr>
                )
            })}
        </tbody>
    )

}

export default TableBody