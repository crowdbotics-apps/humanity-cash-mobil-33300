import {truncate} from "../../services/helpers";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";
import DeleteIcon from '@mui/icons-material/Delete';
import LoopIcon from '@mui/icons-material/Loop';
import EditIcon from '@mui/icons-material/Edit';

export const dataTableModel = {
  columns: [
    {Header: "FULL NAME", accessor: "name"},
    {Header: "USERNAME", accessor: "username"},
    {Header: "GROUP", accessor: "group"},
    {Header: "ACCESS TYPE", accessor: "role"},
    {Header: "ACTION", accessor: "actions", disableOrdering: true}
  ],
  rows: [],
};

const hashBox = (text) => {
  return (
    <MDBox
      sx={{display: 'block', wordWrap: 'break-word', width: 100, color: '#3B88B6', position: 'relative'}}>
      {truncate(text, 22)}
    </MDBox>
  )
}

const badgeBoxType = (item) => {
  if (item.group !== 'BANK') {
    return <MDBadge variant="contained" color="success" badgeContent={item.group} container/>
  } else {
    return <MDBadge variant="contained" color="info" badgeContent={item.group} container/>
  }
}

const badgeBoxRole = (item) => {
  if (item.role === 'EMPLOYEE' || item.role === 'SUPERVISOR') {
    return <MDBadge variant="contained" color="success" badgeContent={item.role} container/>
  } else {
    return <MDBadge variant="contained" color="info" badgeContent={item.role} container/>
  }
}

const buttons = (item, onAction, actionEmail, setEditShow) => {
  return (
    <>
      <MDButton color={"pink"} onClick={() => onAction(item)} iconOnly title={'Delete'}>
        <DeleteIcon/>
      </MDButton>
      <MDButton sx={{marginLeft: 1}} color={"secondary"}  onClick={() => actionEmail(item)} iconOnly title={'Resend password update email'}>
        <LoopIcon />
      </MDButton>
      <MDButton sx={{marginLeft: 1}} color={"primary"}  onClick={() => setEditShow(item)} iconOnly title={'Edit user'}>
        <EditIcon />
      </MDButton>
    </>
  )
}

export const renderTableRow = (item, onAction, actionEmail, setEditShow) => {
  item.name_raw = item.name
  item.role_raw = item.role
  item.group_raw = item.group
  item.name = hashBox(item.name)
  item.role = badgeBoxRole(item)
  item.group = badgeBoxType(item)
  item.actions = buttons(item, onAction, actionEmail, setEditShow)
  return item
}
