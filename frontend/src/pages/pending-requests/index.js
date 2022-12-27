import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import React, {useEffect, useState} from "react"
import {date_fmt, showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import {CircularProgress, Grid, Input} from "@mui/material";
import {ReactComponent as Search} from '../../assets/svg/search.svg'
import Pagination from "../../components/Pagination/Pagination";
import moment from "moment";
import DataTable from "../../components/DataTable";
import {useStores} from '../../models';
import {observer} from "mobx-react";
import {ReactComponent as FiltroIcon} from "../../assets/svg/FunnelSimple.svg";


const dataTableModel = {
  columns: [
    {Header: "N", accessor: "id", width: '5%'},
    {Header: "Appointment Date", accessor: "appointment_date", width: '20%'},
    {Header: "Client Name", accessor: "client", width: '20%'},
    {Header: "Notes", accessor: "notes", width: '35%'},
    {Header: "Service", accessor: "service", width: '20%'}
  ],
  rows: [],
};

const renderTableRow = (item) => {
  item.appointment_date_bkp = item.appointment_date
  const dateTime = item.appointment_date + ' ' + item.start_time
  const date = moment(dateTime, 'YYYY-MM-DD HH:mm:ss')
  item.appointment_date = date_fmt(date, 'MM/DD/YYYY - hh:mm a')
  item.client_bkp = item?.client
  item.client = item?.client?.name
  item.service_bkp = item?.service
  item.service = item?.service?.name
  return item
}

const PendingRequests = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordList, setRecordList] = useState({...dataTableModel})
  const {loginStore} = useStores();

  const getPendingRequests = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getPendingRequests(searchData, page, ordering).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        setNumberOfItems(count);
        loginStore.setPendingRequests(count);
        const tmp = {...dataTableModel};
        tmp.rows = results.map(e => renderTableRow(e));
        setRecordList(tmp);
      }
    })
      .catch(err => {
        showMessage()
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getPendingRequests(searchQuery)
  }, [searchQuery])

  const onColumnOrdering = (ordering) => {
    const {column, order} = ordering
    if (column === '') {
      getPendingRequests(searchQuery)
    } else if (order === 'asce') {
      getPendingRequests(searchQuery, 1, `${column}`)
    } else {
      getPendingRequests(searchQuery, 1, `-${column}`)
    }
  }

  return (
    <DashboardLayout showCard loginRequired>
      <Grid container>
        <Grid item xs={8}>
          <MDBox sx={{backgroundColor: '#EBEBEB', borderRadius: 20, position: 'relative'}} px={5}>
            <Search style={{position: 'absolute', bottom: 7, left: 10}}/>
            <Input
              fullWidth
              placeholder="Search Request"
              type="text"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </MDBox>
        </Grid>
        <Grid item xs={1} display="flex" alignItems="center" justifyContent="center">
          {loading ? <CircularProgress size={24} color="primary"/> : <FiltroIcon/>}
        </Grid>
        <Grid item xs={3} justifyContent={'flex-end'} display={'flex'}>
        </Grid>
      </Grid>

      {recordList.rows.length > 0
        ? <DataTable table={recordList} onColumnOrdering={onColumnOrdering}/>
        : <p style={{display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No pending requests found</p>
      }

      <Pagination
        currentPage={currentPage}
        totalCount={numberOfItems}
        pageSize={5}
        onPageChange={page => {
          getPendingRequests('', page)
          setCurrentPage(page)
        }}
      />
    </DashboardLayout>
  )
}

export default observer(PendingRequests)
