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
import { dataTableModel, renderTableRow } from "./utils";
import DataTable from "../../components/DataTable";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../services/constants";


const Services = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({ ...dataTableModel })
  const searchQueryRef = useRef("");

  const getTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getComplianceBalances(searchData, page, ordering, 8).then((result) => {
      if (result.kind === "ok") {
        const { count, results } = result.data
        const tmp = { ...dataTableModel }
        tmp.rows = []
        setRecordList(tmp)
        setNumberOfItems(0)
        setNumberOfItemsPage(0)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }
  const onColumnOrdering = (ordering) => {
    const { column, order } = ordering
    if (column === '') {
      getTransactions(searchQueryRef?.current)
    } else if (order === 'asce') {
      getTransactions(searchQueryRef?.current, 1, `${column}`)
    } else {
      getTransactions(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setDetailToShow = (item) => {
    navigate(ROUTES.BLOCKCHAIN_TRANSACTION(item.id))
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
          onColumnOrdering={onColumnOrdering}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
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
