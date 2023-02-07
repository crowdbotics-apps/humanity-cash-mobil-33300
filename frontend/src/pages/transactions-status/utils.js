import {money_fmt, truncate} from "../../services/helpers";
import MDBox from "../../components/MDBox";
import moment from "moment";
import MDButton from "../../components/MDButton";
import Icon from "@mui/material/Icon";

export const dataTableModel = {
  columns: [
    {Header: "DATE", accessor: "created_time"},
    {Header: "AMOUNT", accessor: "amount"},
    {Header: "TRANSACTION ID", accessor: "transaction_id"},
    {Header: "FROM", accessor: "action_from"},
    {Header: "TO", accessor: "action_to"},
    {Header: "DOCUMENTATION", accessor: "documentation"},
    {Header: "REQUESTED BY", accessor: "created_by"},
    {Header: "SIGNEDOFF BY", accessor: "signoffs"},
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
      {truncate(text, 100)}
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

const renderAction = (item, onAction) => {
  if (item.status === 'Pending' && item.signable) {
    return (
      <MDButton color={"primary"} size={"small"} onClick={() => onAction(item)}>
        Sign Off
      </MDButton>
    )
  } else if (item.status === 'Approved') {
      return (
          <MDButton color={"primary"} size={"small"} onClick={() => onAction(item)}>
              Show error
          </MDButton>
    )
  } else {
    return '---'
  }
}


export const renderTableRow = (item, onAction) => {
  item.transaction_id = (hashBox(item.transaction_id))
  item.amount = money_fmt(item.amount)
  item.action_from = (hashBox(item.action_from))
  item.action_to = (hashBox(item.action_to, true))
  item.from_address = (hashBox(item.from_address))
  item.to_address = (hashBox(item.to_address))
  item.created_time = (dateBox(item.created_time))
  item.actions = renderAction(item, onAction)
  return item
}
