import pencilIcon from "../../assets/icons/pencil_btn.png";
import trashIcon from "../../assets/icons/delete_btn.png";

export const dataTableModel = {
  columns: [
    {Header: "N", accessor: "id", width: '10px'},
    {Header: "Frequency Name", accessor: "title", width: '40%'},
    {Header: "Frequency color", accessor: "color_code", width: '40%'},
    {Header: "", accessor: "actions", width: '8%', disableOrdering: true}
  ],
  rows: [],
};

export const renderTableRow = (item, selectItemEdit, selectItemDelete) => {
  const newItem = {...item}
  item.color_code =  (
    <>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: 30, height: 30, backgroundColor: item.color_code}}></div>
        <span style={{marginLeft: 10}}>{item.color_code}</span>
      </div>
    </>
  )
  item.actions = (
  <>
    <img
      alt="..."
      onClick={() => selectItemEdit(newItem)} style={{cursor: 'pointer'}}
      src={pencilIcon}
    />
    <img
      alt="..."
      onClick={() => selectItemDelete(newItem)} style={{cursor: 'pointer', marginLeft: 5}}
      src={trashIcon}
    />
  </>
  )
  return item
}
