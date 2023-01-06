import {truncate} from "../../services/helpers";
import MDBox from "../../components/MDBox";
import moment from "moment";
import MDButton from "../../components/MDButton";
import Icon from "@mui/material/Icon";

export const dataTableModel = {
  columns: [
    {Header: "NAME", accessor: "contract_name"},
    {Header: "VERSION", accessor: "version"},
    {Header: "ADDRESS", accessor: "deployed_address"},
    {Header: "DEPLOYED AT", accessor: "created"},
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
  item.contract_name = (hashBox(item.contract_name))
  item.deployed_address = (hashBox(item.deployed_address))
  item.created = (dateBox(item.created))
  item.actions = (
    item.active ? <MDButton color={"primary"} size={"small"} onClick={() => onAction(item)}>
      Active
    </MDButton> : <MDButton color={"pink"} size={"small"} onClick={() => onAction(item)}>
      Paused
    </MDButton>
  )
  return item
}
