import {money_fmt} from "../../services/helpers";
import pencilIcon from "../../assets/icons/pencil_btn.png";
import trashIcon from "../../assets/icons/delete_btn.png";

export const dataTableModel = {
  columns: [
    {Header: "N", accessor: "id", width: '10px'},
    {Header: "Service Name", accessor: "name", width: '22%'},
    {Header: "Service Description", accessor: "description", width: '45%'},
    {Header: "Service Price", accessor: "price", width: '20%'},
    {Header: "", accessor: "actions", width: '8%', disableOrdering: true}
  ],
  rows: [],
};

export const renderTableRow = (item, selectItemEdit, selectItemDelete) => {
  item.price = money_fmt(item.price)
  item.actions = (
  <>
    <img
      alt="..."
      onClick={() => selectItemEdit(item)} style={{cursor: 'pointer'}}
      src={pencilIcon}
    />
    <img
      alt="..."
      onClick={() => selectItemDelete(item)} style={{cursor: 'pointer', marginLeft: 5}}
      src={trashIcon}
    />
  </>
  )
  return item
}