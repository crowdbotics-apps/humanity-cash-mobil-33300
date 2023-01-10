import {money_fmt, truncate} from "../../services/helpers";
import MDBox from "../../components/MDBox";
import moment from "moment";
import MDButton from "../../components/MDButton";
import Icon from "@mui/material/Icon";
import MDBadge from "../../components/MDBadge";

export const dataTableModel = {
  columns: [
    {Header: "CREATED AT", accessor: "created_at"},
    {Header: "DWOLLA ID", accessor: "transaction_id"},
    {Header: "TYPE", accessor: "type"},
    {Header: "AMOUNT", accessor: "amount"},
    {Header: "BANK", accessor: "bank"},
    {Header: "CONFIRMED AT", accessor: "confirmed_at"},
    {Header: "STATUS", accessor: "status"},
    {Header: "ACTION", accessor: "actions", disableOrdering: true}
  ],
  rows: [],
};

const hashBox = (text, to = false) => {
  return (
    <MDBox
      sx={{
        display: 'block',
        wordWrap: 'break-word',
        width: to ? 120 : 100,
        color: '#3B88B6',
        position: 'relative',
        paddingLeft: to ? '20px' : 0
      }}>
      {to &&
        <Icon sx={{position: 'absolute', color: '#8D955D', transform: 'scale(1.3)', top: 15, left: -10}}>east</Icon>}
      {truncate(text, 22)}
    </MDBox>
  )
}

const dateBox = (date) => {
  return (
    <>
      <MDBox sx={{color: '#000000', fontSize: 14, fontWeight: 500}}>
        {moment(date).format('MMMM DD, YYYY')}
      </MDBox>
      <MDBox sx={{color: '#666666', fontSize: 12, fontWeight: 700}}>
        {moment(date).format('H:mm a').toUpperCase()}
      </MDBox>
    </>
  )
}

const badgeBoxType = (item) => {
  if (item.type === 'Withdraw') {
    return <MDBadge variant="contained" color="primary" badgeContent={item.type} container />
  } else {
    return <MDBadge variant="contained" color="info" badgeContent={item.type}  container />
  }
}

const badgeBoxStatus = (item) => {
  if (item.status === 'pending') {
    return <MDBadge variant="contained" color="warning" badgeContent={item.status} container />
  } else {
    return <MDBadge variant="contained" color="success" badgeContent={item.status}  container />
  }
}

export const renderTableRow = (item, onAction) => {
  item.transaction_id = (hashBox(item.transaction_id))
  item.amount = money_fmt(item.amount)
  item.action_from = (hashBox(item.action_from))
  item.action_to = (hashBox(item.action_to, true))
  item.from_address = (hashBox(item.from_address))
  item.type = badgeBoxType(item)
  item.status = badgeBoxStatus(item)
  item.created_at = (dateBox(item.created_at))
  item.confirmed_at = (dateBox(item.confirmed_at))
  item.actions = (
    <MDButton color={"primary"} size={"small"} onClick={() => onAction(item)}>
      Detail
    </MDButton>
  )
  return item
}
