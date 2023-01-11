/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import {useEffect, useMemo, useState} from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-table components
import {useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable} from "react-table";

// @mui material components
import {Grid, Table, TableBody, TableContainer, TablePagination, TableRow, TableCell} from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 PRO React examples
import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";
import Pagination from "../Pagination/Pagination";

function DataTable({
                     entriesPerPage,
                     table,
                     noEndBorder,
                     onColumnOrdering = null,
                     showHeader = true,
                     showRecords = true,
                     currentPage,
                     numberOfItems,
                     numberOfItemsPage,
                     pageSize,
                     onPageChange,
                     showTotalEntries = true
                   }) {
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);
  const [sortedByColumn, setSortedByColumn] = useState({column: '', order: 'none'})

  const tableInstance = useTable(
    {columns, data, initialState: {pageIndex: 0, pageSize: entriesPerPage.sort((a, b) => a - b).slice(-1)}},
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
  } = tableInstance;

  const getDataSortedByColumn = (column) => {
    if (column.disableOrdering) {
      return
    }
    const columnName = column.id
    if (sortedByColumn.column !== columnName) {
      setSortedByColumn({column: columnName, order: 'asce'})
    } else if (sortedByColumn.order === 'asce') {
      setSortedByColumn({column: columnName, order: 'desc'})
    } else {
      setSortedByColumn({column: '', order: 'none'})
    }
  }

  useEffect(() => {
    if (onColumnOrdering){
      onColumnOrdering(sortedByColumn)
    }
  }, [sortedByColumn])

  return (
    <>
      <TableContainer sx={{boxShadow: "none", background: "transparent"}}>
        <Table {...getTableProps()}>
          {showHeader && (<MDBox key={`tablehead__1`} component="thead">
            {headerGroups.map((headerGroup, idx) => (
              <TableRow key={`tablerow__${idx}`} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx3) => {
                  return (
                    <DataTableHeadCell
                      key={`tablecell__${idx3}`}
                      onClick={() => getDataSortedByColumn(column)}
                      width={column.width ? column.width : "auto"}
                      align={column.align ? column.align : "left"}
                      style={{ alignItems: column.align ? column.align : "center"}}
                      display={'flex'}
                      justifyContent={'space-between'}
                      sorted={onColumnOrdering !== null ?  column?.disableOrdering ? false : 'none' : false}
                    >
                      {column.render("Header")}
                      {column?.component}
                    </DataTableHeadCell>
                  )
                })}
              </TableRow>
            ))}
          </MDBox>)}
          {showRecords && <TableBody key={`tablebody__2`} {...getTableBodyProps()}>
            {page.map((row, key) => {
              prepareRow(row);
              return (
                <>
                  <TableRow key={`tablerow2__${key}`} {...row.getRowProps()}>
                    {row.cells.map((cell, idx2) => (
                      <DataTableBodyCell
                        key={`tablecell__${idx2}`}
                        noBorder={noEndBorder && rows.length - 1 === key}
                        align={cell.column.align ? cell.column.align : "left"}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </DataTableBodyCell>
                    ))}
                  </TableRow>
                  {row?.original?.children &&
                    <TableRow key={`tablerow2__children__${key}`}>
                      <TableCell colSpan={row.cells.length} style={{ "text-align": "center" }}>
                        {row?.original?.children}
                      </TableCell>
                    </TableRow>
                  }
                </>
              );
            })}
          </TableBody>}
        </Table>
      </TableContainer>
      {(rows.length > 0 && showTotalEntries) && <Grid container mt={5}>
        <Grid item>
          <MDBox sx={{ color: '#666666', fontSize: 17, width: 300 }}>Showing <span style={{ color: '#000000' }}>{numberOfItemsPage}</span> from <span style={{ color: '#000000' }}>{numberOfItems}</span> data</MDBox>
        </Grid>
        <Grid item ml={'auto'}>
          <Pagination
            currentPage={currentPage}
            totalCount={numberOfItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </Grid>
      </Grid>}
    </>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: [10, 25, 50, 100],
  canSearch: false,
  showTotalEntries: true,
  pagination: {variant: "gradient", color: "info"},
  isSorted: true,
  noEndBorder: false,
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DataTable;
