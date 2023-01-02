import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import MDButton from "../../components/MDButton"
import {getErrorMessages, showMessage, useApi, wrapHash} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import MDInput from "../../components/MDInput";
import Pagination from "../../components/Pagination/Pagination";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import ModalItem from "../../components/ModalItem";
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";


const BlockchainTransactions = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [CurrentItem, setCurrentItem] = useState(null)
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");
  const lastKeyPressedRef = useRef(null);
  const [Items, setItems] = useState([])


  const getBlockchainTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    // api.getBlockchainTransactions(searchData, page, ordering, 8).then((result) => {
    //   if (result.kind === "ok") {
    //     const {count, results} = result.data
    //     const tmp = {...dataTableModel}
    //     tmp.rows = results.map(e => renderTableRow(e))
    //     setRecordList(tmp)
    //     setNumberOfItems(count)
    //   }
    // })
    //   .catch(err => showMessage())
    //   .finally(() => setLoading(false))

    let params = {}
    // if (ShowUsername) {
    //   params["show_username"] = true
    //   params["password"] = Password
    // }

    api.getBlockchainTransactions(params).then((result) => {
      console.log(result)
      if (result.kind === "ok") {
        const tableRows = []
        let index = 0
        for (let data of result.data.results) {
          let row = {
            id: data.id,
            hash: wrapHash(data.transaction_id),
            fromUsername: wrapHash(data.from_username),
            toUsername: <div>
              <div style={{marginRight: 8}}>a</div>
              {wrapHash(data.to_username)}</div>,
            fromAddress: wrapHash(data.from_address),
            toAddress: wrapHash(data.to_address),
            type: data.type,
            createdAt: data.created,
            amount: data.amount,
            confirmedBlocks: data.confirmations
          }
          // if (userStore.group === UserGroup.BANK.code) {
          //   row["show"] = (<div>
          //     <Button type={"button"} onClick={() => {
          //       setShowUsername(true)
          //       setShowPasswordModal(true)
          //       setCurrentItem(row)
          //       setCurrentIndex(index)
          //
          //     }} className={styles.showButton}>show</Button>
          //   </div>)
          // }
          index++;
          tableRows.push(row)
        }
        setItems(tableRows)
      } else {
        showMessage(getErrorMessages(result.errors))
      }
    })
  }
  const onColumnOrdering = (ordering) => {
    const {column, order} = ordering
    if (column === '') {
      getBlockchainTransactions(searchQueryRef?.current?.value)
    } else if (order === 'asce') {
      getBlockchainTransactions(searchQueryRef?.current?.value, 1, `${column}`)
    } else {
      getBlockchainTransactions(searchQueryRef?.current?.value, 1, `-${column}`)
    }
  }

  const prepareCall = (evt) => {
    lastKeyPressedRef.current = (new Date()).getTime()
    setTimeout(() => {
      const now = (new Date()).getTime()
      if (loading || now - lastKeyPressedRef.current < 1000) {
        return
      }
      getBlockchainTransactions(searchQueryRef?.current?.value)
    }, 1000)
  }

  useEffect(() => {
    getBlockchainTransactions()
  }, [])

  return (
    <DashboardLayout showCard loginRequired>
      {recordList?.rows.length > 0
        ? (<DataTable table={recordList} onColumnOrdering={onColumnOrdering}/>)
        : <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No
          blockchain transactions found</p>
      }

      <Pagination
        currentPage={currentPage}
        totalCount={numberOfItems}
        pageSize={8}
        onPageChange={page => {
          getBlockchainTransactions('', page)
          setCurrentPage(page)
        }}
      />
    </DashboardLayout>
  )
}

export default BlockchainTransactions
