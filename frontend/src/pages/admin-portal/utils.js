import {truncate} from "../../services/helpers";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDBadge from "../../components/MDBadge";

export const dataTableModel = {
  columns: [
    {Header: "FULL NAME", accessor: "name"},
    {Header: "GROUP", accessor: "group"},
    {Header: "ACCESS TYPE", accessor: "role"},
    {Header: "ACTION", accessor: "actions", disableOrdering: true}
  ],
  rows: [],
};

const hashBox = (text) => {
  return (
    <MDBox
      sx={{ display: 'block', wordWrap: 'break-word', width: 100, color: '#3B88B6', position: 'relative'}}>
      {truncate(text, 22)}
    </MDBox>
  )
}

const badgeBoxType = (item) => {
  if (item.group !== 'BANK') {
    return <MDBadge variant="contained" color="success" badgeContent={item.group} container />
  } else {
    return <MDBadge variant="contained" color="info" badgeContent={item.group}  container />
  }
}

const badgeBoxRole = (item) => {
  if (item.role === 'EMPLOYEE' || item.role === 'SUPERVISOR') {
    return <MDBadge variant="contained" color="success" badgeContent={item.role} container />
  } else {
    return <MDBadge variant="contained" color="info" badgeContent={item.role}  container />
  }
}

export const renderTableRow = (item, onAction ) => {
  item.name = hashBox(item.name)
  item.role = badgeBoxRole(item)
  item.group = badgeBoxType(item)
  item.actions = (
    <MDButton color={"pink"} size={"small"} onClick={() => onAction(item)}>
      Delete
    </MDButton>
  )
  return item
}
