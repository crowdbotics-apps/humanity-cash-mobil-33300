import {money_fmt} from "../../services/helpers";
import pencilIcon from "../../assets/icons/pencil_btn.png";
import trashIcon from "../../assets/icons/delete_btn.png";

export const dataTableModel = {
  columns: [
    {Header: "HASH", accessor: "id", width: '10px'},
    {Header: "FROM", accessor: "name", width: '22%'},
    {Header: "TO", accessor: "description", width: '45%'},
    {Header: "FROM ADDRESS", accessor: "price", width: '20%'},
    {Header: "TO ADDRESS", accessor: "price", width: '20%'},
    {Header: "TYPE", accessor: "price", width: '20%'},
    {Header: "CREATED AT", accessor: "price", width: '20%'},
    {Header: "AMOUNT", accessor: "price", width: '20%'},
    {Header: "BLOCKS CONFIRMED", accessor: "price", width: '20%'},
  ],
  rows: [],
};

export const renderTableRow = (item) => {
  item.price = money_fmt(item.price)
  return item
}
