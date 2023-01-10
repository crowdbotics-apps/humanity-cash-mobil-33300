import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import { useEffect, useRef, useState } from "react"
import MDButton from "../../components/MDButton"
import { showMessage, useApi } from "../../services/helpers"
import MDBox from "../../components/MDBox";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { CircularProgress, Grid, Input } from "@mui/material";
import MDInput from "../../components/MDInput";
import Pagination from "../../components/Pagination/Pagination";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import ModalItem from "../../components/ModalItem";
import { renderTableRow } from "./utils";
import DataTable from "../../components/DataTable";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../services/constants";
import moment from "moment";

const dataTableModel = {
  columns: [
    {Header: "", accessor: "date_title"},
    {Header: "AMOUNT", accessor: "amount"},
    {Header: "TRANSACTION ID", accessor: "transaction_id"},
    {Header: "FROM", accessor: "action_from"},
    {Header: "TO", accessor: "action_to"},
    {Header: "DOCUMENTATION", accessor: "documentation"},
    {Header: "REQUESTED BY", accessor: "created_by"},
    {Header: "ACTION", accessor: "actions", disableOrdering: true}
  ],
  rows: [],
};

const Services = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({ ...dataTableModel })
  const searchQueryRef = useRef("");

  const [DetailVisible, setDetailVisible] = useState(false);

  const formatDate = (date_) => {
    let date

    return date
  }

  const getFormatedData = (initialData) => {
    // init columns
    let columns = [{Header: "", accessor: "date_title", disableOrdering: true}]
    
    let data = []
    // init row
    initialData.map(d => {
      let row = {
        tokens_burned: d.tokens_burned,
        tokens_minted: d.tokens_minted,
        outstanding: parseFloat(d.tokens_burned) - parseFloat(d.tokens_minted),
        date: d.date,
        date_title: <MDBox onClick={() => {
          setDetailVisible(!DetailVisible)
          console.log(' aca', DetailVisible)
        }}
          style={{ color: "var(--green-dark)", fontWeight: "bold", height: 50, alignItems: 'center', display: 'flex' }}>
          {moment(d.date).format('MMMM DD, YYYY')}</MDBox>,
        comments: d.comments,
        // children: {
        //   children_columns: ['A', 'B'],
        //   children_rows: [{a: 'asd', b: 'asd'}, {a: 'asd', b: 'asd'}, {a: 'asd', b: 'asd'}]
        // }
        children: <MDBox style={{ height: DetailVisible ? 100 : 1, background: 'red'}} />
      }
      // banks net diference
      let banksTotal = 0
      d.banks.map(b => {
        // add bank name to columns
        columns.push({ Header: b.name, accessor: `bank_${b.id}`, disableOrdering: true })
        // bank net difference
        row[`bank_${b.id}`] = parseFloat(d.details[b.id].credits_settled) - parseFloat(d.details[b.id].debits_settled)
        // banks net difference
        banksTotal += row[`bank_${b.id}`]
      })
      // finish row
      row['total'] = banksTotal
      row['diference'] = banksTotal - row.outstanding
      row['positive_result'] = row.diference > 0 ? 'Yes' : 'No'

      //
      data.push(row)
    })

    // finish columns
    columns.push({Header: "TOTAL", accessor: "total", disableOrdering: true},
      {Header: "B$ Outstanding", accessor: "outstanding", disableOrdering: true},
      {Header: "RESERVE >= TOKENS?", accessor: "positive_result", disableOrdering: true},
      {Header: "DIFERENCE", accessor: "diference", disableOrdering: true},
      {Header: "COMMENTS", accessor: "comments", disableOrdering: true},
    )

    return { rows: data, columns}
  }

  const getTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getComplianceBalances(searchData, page, ordering, 8).then((result) => {
      if (result.kind === "ok") {

        const data = getFormatedData(result.data)

        setRecordList(data)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }


  useEffect(() => {
    getTransactions("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getTransactions}
    >
      {recordList?.rows.length > 0
        ? (<DataTable
          table={recordList}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
          showTotalEntries={false}
          onPageChange={page => {
            getTransactions('', page)
            setCurrentPage(page)
          }}
        />)
        : <p style={{ display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20 }}>No transactions found</p>
      }
    </DashboardLayout>
  )
}

export default Services
