import React, { useState, useEffect } from 'react';
import {Table} from "react-bootstrap";
import styles from "./AdvancedTable.module.css";
import TablePagination from "./TablePagination";
import BackendPagination from "./BackendPagination";
import {PAGE_SIZE} from "./constants";

export const ADV_DELETE_FIELD_NAME:string = "deleteCol"

type HeadersProps = {
  headers: any;
  deletable?: boolean;
};

const AdvancedTableHeader = ({ headers, deletable }: HeadersProps) => {
  return (
    <thead>
    <tr className={styles.tableHeader}>
      {Object.keys(headers).map((k, index) => {
        return ( <th className={`${styles.tableHead} adv-table-th`} id={"adv-table-th-"+k} key={index}>{headers[k]}</th>)
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
      <tr className={styles.tableRow} key={'table-row-'+index}
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
    let className = `${styles.tableData} adv-table-td  adv-table-td-${fieldName} `
    if(fieldName === ADV_DELETE_FIELD_NAME){
      className += ` ${styles.deleteTD}`
    }
    if (typeof field === "string"){
      field = <div className={styles.textTD}>{field}</div>
    }
    return (
      <>
        {fieldName === "id"? null : (
          <td key={`body-td-${index1}-${index2}`} className={className}>
            {field }
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
  totalItems:number
  currentPage:number
  paginate?: boolean;
  deletable?: boolean;
  onPrevious(): void
  onNext(): void
  onClickPage(page:number): void
};


const AdvancedTable = ({ rows, onPrevious, onClickPage, onNext, deletable , headerRow, totalItems, currentPage}: AdvancedTableProps) => {

  return (
    <div style={{height:"100%",display:'flex', flexDirection:'column'}}>
      <Table responsive className={styles.table}>
        <AdvancedTableHeader headers={headerRow} deletable={deletable}/>
        <AdvancedTableBody rows={rows} deletable={deletable} />
        <tfoot style={{ borderStyle:"none"}}>
          <tr>
            <td colSpan={headerRow.length}>
              <BackendPagination
                resultsQty={rows.length}
                onPrevious={onPrevious}
                onNext={onNext}
                allPerPage={PAGE_SIZE}
                currentPage={currentPage}
                onClickPage={onClickPage}
                countDataAll={totalItems}
                disabledPaginate={false}
              />
            </td>
          </tr>
        </tfoot>
      </Table>

    </div>
  )
}

export default AdvancedTable
