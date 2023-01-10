import {money_fmt, truncate} from "../../services/helpers";
import MDBox from "../../components/MDBox";
import moment from "moment";
import MDButton from "../../components/MDButton";
import Icon from "@mui/material/Icon";

export const dataTableModel = {
  columns: [
    { Header: "FULL NAME", accessor: "name" },
    { Header: "EMAIL", accessor: "email" },
    { Header: "USER DWOLLA ID", accessor: "dwolla_id" },
    { Header: "BALANCE", accessor: "balance"},
    {Header: "LAST LOGIN", accessor: "last_login"},
    {Header: "WALLET ADDRESS", accessor: "crypto_wallet_id"},
    {Header: "PHYSICAL ADDRESS", accessor: "address"},
    {Header: "ACCOUNT TYPE", accessor: "account_type"},
    {Header: "ACTION", accessor: "actions", disableOrdering: true}
  ],
  rows: [],
};

const hashBox = (text, to = false) => {
  return (
    <MDBox
      sx={{ display: 'block', wordWrap: 'break-word', width: to ? 120 : 100, color: '#3B88B6', position: 'relative', paddingLeft: to ? '20px': 0}}>
      {to && <Icon sx={{ position: 'absolute', color: '#8D955D', transform: 'scale(1.3)', top: 15, left: -10}}>east</Icon>}
      {truncate(text, 22)}
    </MDBox>
  )
}

const formatBalance = (text) => {
  return (
    <MDBox
      sx={{ display: 'block', wordWrap: 'break-word', width: 100, color: '#8D955D', position: 'relative'}}>
      {/*{truncate(money_fmt(text), 22)}*/}
      $ {text}
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


export const renderTableRow = (item, onAction ) => {
  item.dwolla_id = (hashBox(item.dwolla_id))
  item.crypto_wallet_id = (hashBox(item.crypto_wallet_id))
  item.last_login = (dateBox(item.last_login))
  item.balance = (formatBalance(item.balance))
  item.actions = (
    <MDButton color={"primary"} size={"small"} onClick={() => onAction(item)}>
      Detail
    </MDButton>
  )
  return item
}
