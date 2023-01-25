import {truncate} from "../../services/helpers";
import MDBox from "../../components/MDBox";
import moment from "moment";
import MDButton from "../../components/MDButton";
import Icon from "@mui/material/Icon";

export const dataTableModel = {
  columns: [
    {Header: "ID", accessor: "id"},
    {Header: "SESSION", accessor: "session_key"},
    {Header: "DATE", accessor: "login"},
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
  item.session_key = (hashBox(item.session_key))
  item.login = (dateBox(item.login))
  item.actions = (
    <MDButton color={"primary"} size={"small"} onClick={() => onAction(item)}>
      Detail
    </MDButton>
  )
  return item
}
