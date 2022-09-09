import React, { useState, useEffect } from 'react';
import {Table} from "react-bootstrap";
import styles from "./AdvancedTable.module.css";

export const ADV_DELETE_FIELD_NAME:string = "deleteCol"

type HeadersProps = {
  headers: any;
  deletable?: boolean;
};

const AdvancedTableHeader = ({ headers, deletable }: HeadersProps) => {
  return (
    <thead>
    <tr className='table-header'>
      {Object.keys(headers).map((k, index) => {
        return ( <th className={`${styles['tableHead']} adv-table-th`} id={"adv-table-th-"+k} key={index}>{headers[k]}</th>)
      })}
      {deletable && (<th className={'cell-header-delete'}></th>)}
    </tr>
    </thead>

  );
}


type AdvancedTableBodyProps = {
  rows: any;
  deletable?: boolean; // hide/show delete item
  hasDetail?: boolean; // navigate to the currentpath/:id
  onClickRow?(data:any): any
}

const AdvancedTableBody = ({ rows, deletable, onClickRow, hasDetail }: AdvancedTableBodyProps) => {

  const [pathLocation, setPathLocation] = useState<string>('');

  const renderTR = (row:any, index:number)=>{
    return (
      <tr className='table-row' key={'table-row-'+index}
          onClick={(row)=>{
            if(hasDetail){

            }else if(onClickRow){
              onClickRow(row)
            }
          }}
      >
        {Object.keys(row).map((k, index2) => renderTD(k, row[k], index, index2) )}
      </tr>
    )
  }

  const renderTD = (fieldName:string, field:any, index1:number, index2:number)=>{
    let className = `adv-table-td  adv-table-td-${fieldName}`
    if(fieldName === ADV_DELETE_FIELD_NAME){
      className += ` ${styles.deleteTD}`
    }
    return (
      <>
        {fieldName === "id"? null : (
          <td key={`body-td-${index1}-${index2}`} className={className}>
            {field}
          </td>
        )}
      </>
    )
  }

  return (
    <tbody>
    {rows.map((row:any, index:number)=>renderTR(row, index))}
    </tbody>
  )
}


type AdvancedTableProps = {
  rows: any[]
  headerRow:any
  paginate?: boolean;
  deletable?: boolean;
};


const AdvancedTable = ({ rows, paginate, deletable , headerRow}: AdvancedTableProps) => {
  return (
    <>
      <Table responsive>
        <AdvancedTableHeader headers={headerRow} deletable={deletable}/>
        <AdvancedTableBody rows={rows} deletable={deletable} />
      </Table>
      {/*<TablePagination*/}
      {/*  data_paginate={rows}*/}
      {/*  allPerPage={allPerPage}*/}
      {/*  currentPage={currentPage}*/}
      {/*  setCurrentPage={setCurrentPage}*/}
      {/*  countDataAll={countDataAll}*/}
      {/*  disabledPaginate={disabledPaginate}*/}
      {/*/>*/}
    </>
  )
}

export default AdvancedTable
