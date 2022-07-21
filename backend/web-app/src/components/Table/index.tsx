import React, { useState, useEffect } from 'react';
import { Button, Offcanvas, Spinner, Tab, Tabs, Table, Pagination, Row, Col, Container } from "react-bootstrap";
import TablePagination from './TablePagination'
import TableHeader from './TableHeader'
import TableBody from './TableBody'


type TableProps = {
    rows: any;
    disabledPaginate: boolean;
    delete_items: boolean;
};


const SimpleTable = ({ rows, disabledPaginate, delete_items }: TableProps) => {



    const [currentPage, setCurrentPage] = useState<any>(1);
    const [allPerPage, setAllPerPage] = useState<number>(3);

    if (rows.length < 1) rows = [];
    /// else if (itemDelete) rows = deleteItems(rows);


    const indexOfLastTodo = currentPage * allPerPage;
    const indexOfFirstTodo = indexOfLastTodo - allPerPage;
    const currentAll = rows.slice(indexOfFirstTodo, indexOfLastTodo);
    const countDataAll = rows.length


    return (
        <>
            <Table responsive>
                <TableHeader headers={rows} delete_items={delete_items}/>
                <TableBody date_rows={currentAll} delete_items={delete_items} />
            </Table>
            <TablePagination
                data_paginate={rows}
                allPerPage={allPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                countDataAll={countDataAll}
                disabledPaginate={disabledPaginate}
            />
        </>
    )
}


SimpleTable.defaultProps = {
    disabledPaginate: false,
    delete_items: true
};



export default SimpleTable