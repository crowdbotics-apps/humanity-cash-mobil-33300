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
    countDataAll: number;
    disabledPaginate: boolean;
    onNext():void
    onPrevious():void
    onClickPage(page:number):void
};


const BackendPagination = ({ data_paginate, currentPage, onClickPage,onNext, onPrevious,allPerPage, countDataAll, disabledPaginate}: PaginateProps) => {

    // console.log(disabledPaginate,'diabled')
    if (disabledPaginate) return <></>


    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(countDataAll / allPerPage); i++) {
        pageNumbers.push(i);
    }


    const renderPageNumbers = pageNumbers.map((number: any) => {
        return <Pagination.Item className='action-item' active={currentPage == number && true} id={number}
                                key={number} onClick={(e: any) => onClickPage(number)}>{number}</Pagination.Item>;
    });


    return (
        <div className='d-flex paginate'>
            <Col className="d-flex  col-paginate container-count-paginate">
                <h6 className='count-paginate'>
                    Showing <span>{allPerPage}</span> from <span>{countDataAll}</span> data
                </h6>
            </Col>
            <Col className="d-flex justify-content-end" >
                <Pagination>
                    <Pagination.Prev className='action-paginate' onClick={() => onPrevious()}>
                        <PaginateLeftIcon />
                    </Pagination.Prev>
                    {renderPageNumbers}
                    <Pagination.Next className='action-paginate' onClick={() => onNext()}>
                        <PaginateRightIcon />
                    </Pagination.Next>
                </Pagination>
            </Col>
        </div>
    )
}

export default BackendPagination;
