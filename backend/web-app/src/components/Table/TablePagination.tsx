import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    PaginateLeftIcon,
    PaginateRightIcon
} from '../icons'

import Pagination from 'react-bootstrap/Pagination';
import Col from 'react-bootstrap/Col';


type PaginateProps = {
    data_paginate: any;
    currentPage: number;
    allPerPage: number;
    setCurrentPage: any;
    countDataAll: number;
    disabledPaginate: boolean;
};


const TablePagination = ({ data_paginate, currentPage, allPerPage, setCurrentPage, countDataAll, disabledPaginate}: PaginateProps) => {

    console.log(disabledPaginate,'diabled')
    if (disabledPaginate) return <></>


    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data_paginate.length / allPerPage); i++) {
        pageNumbers.push(i);
    }

    //console.log(pageNumbers, 'pageNumbers')
    const handleClick = (e: any) => {
        setCurrentPage(e.target.id)
    }

    const renderPageNumbers = pageNumbers.map((number: any) => {
        return <Pagination.Item className='action-item' active={currentPage == number && true} id={number} key={number} onClick={(e: any) => handleClick(e)}>{number}</Pagination.Item>;
    });

    const nextPaginate = () => {
        if (currentPage != 0 && currentPage <= allPerPage) {
            let next = currentPage + 1
            setCurrentPage(next)
        }
    };

    const prevPaginate = () => {
        if (currentPage != 0) {
            if (currentPage < 0 || currentPage > 1) {
                let prev = currentPage - 1
                setCurrentPage(prev)
            }
        }

    };
    return (
        <div className='d-flex paginate'>
            <Col className="d-flex  col-paginate container-count-paginate">
                <h6 className='count-paginate'>
                    Showing <span>{currentPage}</span> from <span>{countDataAll}</span> data
                </h6>
            </Col>
            <Col className="d-flex justify-content-end" >
                <Pagination>
                    <Pagination.Prev className='action-paginate' onClick={() => prevPaginate()}>
                        <PaginateLeftIcon />
                    </Pagination.Prev>
                    {renderPageNumbers}
                    <Pagination.Next className='action-paginate' onClick={() => nextPaginate()}>
                        <PaginateRightIcon />
                    </Pagination.Next>
                </Pagination>
            </Col>
        </div>
    )
}

export default TablePagination;