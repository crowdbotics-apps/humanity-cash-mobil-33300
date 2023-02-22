import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import DataTableDropdown from "../../components/DataTableDropdown";
import moment from "moment";

const dataTableModel = {
  columns: [
    {Header: "", accessor: "date_title"},
    {Header: "AMOUNT", accessor: "amount"},
    {Header: "TRANSACTION ID", accessor: "transaction_id"},
    {Header: "FROM", accessor: "action_from"},
    {Header: "TO", accessor: "action_to"},
    {Header: "DOCUMENTATION", accessor: "documentation"},
    {Header: "REQUESTED BY", accessor: "created_by"},
    {Header: "ACTION", accessor: "actions", disableOrdering: true}
  ],
  rows: [],
};

const Dashboard = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [recordList, setRecordList] = useState({ ...dataTableModel })


  const getFormatedData = (initialData) => {
    // init columns
    let columns = [{Header: "", accessor: "date_title", disableOrdering: true}]
    let { banks, balances } = initialData

    banks.forEach((b) => {
      // add bank name to columns
      columns.push({Header: b.name, accessor: `bank_${b.id}`, disableOrdering: true})
    })

    let data = []
    // init row
    balances.forEach(d => {
      let row = {
        tokens_burned: d.tokens_burned,
        tokens_minted: d.tokens_minted,
        outstanding: parseFloat(d.tokens_burned) - parseFloat(d.tokens_minted),
        date: d.date,
        date_title: <MDBox style={{ color: "var(--green-dark)", fontWeight: "bold", height: 50, alignItems: 'center', display: 'flex' }}>
          {d.date ? moment(d.date).format('MMMM DD, YYYY'): 'Current'}</MDBox>,
        comments: d.comments,
      }
      // banks net diference
      let banksTotal = 0

      let col_children = [
        { date_title: <MDBox style={{ color: "var(--green)", marginLeft: 20, height: 40, alignItems: 'center', display: 'flex' }}>
          Total Mints settled to date</MDBox> },
        { date_title: <MDBox style={{ color: "var(--blue)", marginLeft: 20, height: 40, alignItems: 'center', display: 'flex' }}>
          Total Burns settled to date</MDBox> },
        { date_title: <MDBox style={{ color: "var(--mustard)", marginLeft: 20, height: 40, alignItems: 'center', display: 'flex' }}>
          Net Mints settled</MDBox> }
      ]
      let totalBanksCredit = 0
      let totalBanksDebit = 0

      banks.forEach((b) => {
        const credits = parseFloat(d.details?.[b.id]?.credits_settled || '0')
        const debits = parseFloat(d.details?.[b.id]?.debits_settled || '0')
        // bank net difference
        row[`bank_${b.id}`] = credits - debits

        // set amount detail by bank
        col_children[0][`bank_${b.id}`] = credits
        col_children[1][`bank_${b.id}`] = debits
        col_children[2][`bank_${b.id}`] = row[`bank_${b.id}`]

        // banks net difference
        totalBanksCredit += credits
        totalBanksDebit += debits
        banksTotal += row[`bank_${b.id}`]
      })
      // finish row
      row['total'] = banksTotal
      row['diference'] = banksTotal - row.outstanding
      row['positive_result'] = row.diference > 0 ? 'Yes' : 'No'

      // col children totals
      col_children[0]['total'] = totalBanksCredit
      col_children[1]['total'] = totalBanksDebit
      col_children[2]['total'] = banksTotal

      row['children'] = col_children

      data.push(row)
    })

    // finish columns
    columns.push({Header: "CASH RESERVE", accessor: "total", disableOrdering: true},
      {Header: "TOKENS ISSUED", accessor: "outstanding", disableOrdering: true},
      {Header: "RESERVE >= TOKENS?", accessor: "positive_result", disableOrdering: true},
      {Header: "DIFFERENCE", accessor: "diference", disableOrdering: true},
      {Header: "COMMENTS", accessor: "comments", disableOrdering: true},
    )

    return { rows: data, columns}
  }

  const getTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getComplianceBalances(searchData, page, ordering, 8).then((result) => {
      if (result.kind === "ok") {

        const data = getFormatedData(result.data)

        setRecordList({...data})
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }


  useEffect(() => {
    getTransactions("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getTransactions}
    >
      {recordList?.rows.length > 0
        ? (<DataTableDropdown
          table={recordList}
          currentPage={currentPage}
          pageSize={8}
          showTotalEntries={false}
          onPageChange={page => {
            getTransactions('', page)
            setCurrentPage(page)
          }}
        />)
        : <p></p>
      }
    </DashboardLayout>
  )
}

export default Dashboard
