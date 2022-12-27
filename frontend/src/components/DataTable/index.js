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
import {Table, TableBody, TableContainer, TablePagination, TableRow} from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 PRO React examples
import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";

function DataTable({
                     entriesPerPage,
                     table,
                     noEndBorder,
                     recordsCount,
                     canSearch = false,
                     externalPagination = true,
                     controller,
                     setController,
                     setFilters,
                     setWaitSearchTyping,
                     onColumnOrdering,
                     showHeader = true,
                     showRecords = true
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
    setGlobalFilter,
    state: {globalFilter},
  } = tableInstance;
  // Search input value state
  const [search, setSearch] = useState(globalFilter);

  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  const handleSearch = (search) => {
    setWaitSearchTyping(true)
    setFilters(f => {
      const newFilter = {...f}
      newFilter.search = search
      return newFilter
    })
  }

  const handlePageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage
    });
  }

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  }

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
    onColumnOrdering(sortedByColumn)
  }, [sortedByColumn])

  return (
    <TableContainer sx={{boxShadow: "none", background: "transparent"}}>
      {showHeader && showRecords && (entriesPerPage || canSearch) ? (
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          {canSearch && (
            <MDBox width="12rem" ml="auto">
              <MDInput
                placeholder="Buscar..."
                value={search}
                size="small"
                fullWidth
                onChange={({currentTarget}) => {
                  if (handleSearch) {
                    handleSearch(currentTarget.value)
                  } else {
                    setSearch(search);
                    onSearchChange(currentTarget.value);
                  }
                }}
              />
            </MDBox>
          )}
        </MDBox>
      ) : null}
      <Table {...getTableProps()}>
        {showHeader && (<MDBox key={`tablehead__1`} component="thead">
          {headerGroups.map((headerGroup, idx) => (
            <TableRow key={`tablerow__${idx}`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx3) => (
                <DataTableHeadCell
                  key={`tablecell__${idx3}`}
                  onClick={() => getDataSortedByColumn(column)}
                  width={column.width ? column.width : "auto"}
                  align={column.align ? column.align : "left"}
                  sorted={false}
                  withBorders={false}
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>)}
        {showRecords && <TableBody key={`tablebody__2`} {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);
            return (
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
            );
          })}
        </TableBody>}
      </Table>

      {!externalPagination && <TablePagination
        labelRowsPerPage={"Registros por página"}
        labelDisplayedRows={
          ({from, to, count}) => {
            return `${from} — ${to} de ${count}`
          }
        }
        component="div"
        onPageChange={handlePageChange}
        page={controller ? controller.page : 0}
        count={controller ? recordsCount : 0}
        rowsPerPage={controller ? controller.rowsPerPage : 25}
        rowsPerPageOptions={entriesPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />}
    </TableContainer>
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
