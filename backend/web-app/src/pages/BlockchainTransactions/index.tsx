import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import SimpleTable from '../../components/Table'
import {Badge, Button, Form, Row, Tab, Tabs} from "react-bootstrap";
import AdminPanelContainer from "../../containers";
import InputGroup from "react-bootstrap/InputGroup";
import {ArrowRightIcon, Eyes, SearchIcon} from "../../components/icons";
import {Filter} from "../Employees/Filter";
import AdvancedTable, {ADV_DELETE_FIELD_NAME} from "../../components/Table/AdvancedTable";
import {useApi, useUserStore} from "../../utils";
import {UserGroup} from "../../components/Table/constants";
import {genericApiError} from "../../helpers";
import {getErrorMessages, truncate} from "../../utils/functions";
import moment from 'moment'
import styles from './BlockchainTransactions.module.css'
import Modal from "react-bootstrap/Modal";
import ModalAlerts from "../../components/Modal/ModalAlerts";
import Stack from "react-bootstrap/Stack";
import {toast} from "react-toastify";


const wrapHash = (txt: string,) => {
  txt = truncate(txt, 23)
  const middle: number = Math.round(txt.length / 2) - 1
  return <div className={styles.textTD}>{txt.slice(0, middle)}<br/>{txt.slice(middle, txt.length)}</div>
}

const COLUMN_TITLES = ['HASH', 'FROM', 'TO', 'FROM ADDRESS', 'TO ADDRESS', 'TYPE', 'CREATED AT', 'AMOUNT', 'BLOCKS CONFIRMED']

const BlockTransactionsPage: React.FC = observer(() => {

  const [LeftOpen, setLeftOpen] = useState<any>(true);
  //const [RightOpen, setRightOpen] = useState<any>(true);
  const [Items, setItems] = useState<any>([])
  const [TotalItems, setTotalItems] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Previous, setPrevious] = useState<string | null>(null)
  const [Next, setNext] = useState<string | null>(null)
  const [ShowUsername, setShowUsername] = useState<boolean>(true)
  const [ShowPasswordModal, setShowPasswordModal] = useState<boolean>(false)
  const [CurrentIndex, setCurrentIndex] = useState<number | null>(null)
  const [CurrentItem, setCurrentItem] = useState<any | null>(null)
  const [Password, setPassword] = useState<string>("holamundo")
  const [ColumnsTitles, setColumnsTitles] = useState(COLUMN_TITLES)
  const api = useApi()
  const userStore = useUserStore()


  useEffect(() => {
    console.log("useEffect", userStore.access_token, userStore.group, userStore.role)
    userStore.setUp()
    if (userStore.group === UserGroup.BANK.code) {
      setColumnsTitles(COLUMN_TITLES.concat(['USERNAME']))
    }
    getItems()
  }, [])

  useEffect(() => {
    if (ShowUsername) {
      setPassword("holamundo")
    }
  }, [ShowUsername])

  const CreatedColumn = (opts: any) => {
    return (
      <div>
        <span className={styles.createdTitle}>{moment(opts.created).format('MMMM DD, YYYY')}</span>
        <br/>
        <span className={styles.createdSubtitle}>{moment(opts.created).format('H:mm a').toUpperCase()}</span>
      </div>
    )
  }


  const getItem = () => {
    if (CurrentItem === null) {
      return
    }
    let params: any = {}
    if (ShowUsername) {
      params["show_username"] = true
      params["password"] = Password
    }

    api.getBlockchainTransaction(CurrentItem.id, params).then((result: any) => {
      console.log(result)
      if (result.kind === "ok") {
        const data = result.data
        const newArray = []
        for (let obj of Items) {
          if (obj.id === CurrentItem.id) {

            let row: any = {
              id: data.id,
              hash: wrapHash(data.transaction_id),
              fromUsername: wrapHash(data.from_username),
              toUsername: <div className={styles.toColumn}>
                <div style={{marginRight: 8}}><ArrowRightIcon/></div>
                {wrapHash(data.to_username)}</div>,
              fromAddress: wrapHash(data.from_address),
              toAddress: wrapHash(data.to_address),
              type: data.type,
              createdAt: <CreatedColumn created={data.created}/>,
              amount: data.amount,
              confirmedBlocks: data.confirmations
            }
            newArray.push(row)
          } else {
            newArray.push(obj)
          }
        }
        setItems(newArray)
        setShowPasswordModal(false)
      } else {
        toast.error(getErrorMessages(result.errors), {
          position: toast.POSITION.TOP_CENTER
        });
      }
    })

  }


  const getItems = () => {
    let params: any = {page: CurrentPage}
    // if (ShowUsername){
    //   params["show_username"] = true
    //   params["password"] = Password
    // }
    api.getBlockchainTransactions(params).then((response: any) => {
      if (response.kind === "ok") {
        setPrevious(response.data.previous)
        setNext(response.data.next)
        setTotalItems(response.data.count)
        const tableRows = []
        let index = 0
        for (let data of response.data.results) {
          let row: any = {
            id: data.id,
            hash: wrapHash(data.transaction_id),
            fromUsername: wrapHash(data.from_username),
            toUsername: <div className={styles.toColumn}>
              <div style={{marginRight: 8}}><ArrowRightIcon/></div>
              {wrapHash(data.to_username)}</div>,
            fromAddress: wrapHash(data.from_address),
            toAddress: wrapHash(data.to_address),
            type: data.type,
            createdAt: <CreatedColumn created={data.created}/>,
            amount: data.amount,
            confirmedBlocks: data.confirmations
          }
          if (userStore.group === UserGroup.BANK.code) {
            row["show"] = (<div>
              <Button type={"button"} onClick={() => {
                setShowUsername(true)
                setShowPasswordModal(true)
                setCurrentItem(row)
                setCurrentIndex(index)

              }} className={styles.showButton}>show</Button>
            </div>)
          }
          index++;
          tableRows.push(row)
        }
        setItems(tableRows)
      }
    }).catch((error: any) => {
      console.log(error)
      genericApiError()
    })
  }


  const onClickFilter = () => {

  }

  const applyFilter = (data: any) => {
    console.log(data)


  }

  const cancelFilter = () => {


  }

  const onClickPage = (page: number) => {
    console.log("onclick page", page)
    setCurrentPage(page)
  }

  const onPreviousPage = () => {
    console.log("onPreviousPage page", Previous)
    if (Previous) {
      setCurrentPage(prevState => prevState - 1)
    }
  }


  const onNextPage = () => {
    console.log("onNextPage page", Next)
    if (Next) {
      setCurrentPage(prevState => prevState + 1)
    }
  }

  const SearchInput = () => {
    return (
      <InputGroup className="mb-0 search-button-group">
        <Button variant="outline-secondary" id="button-addon2" className='search-buttons'>
          <SearchIcon/>
        </Button>
        <Form.Control
          placeholder='Search'
          type="search" name="search" className='search-button-navbar'
        />
      </InputGroup>)
  }

  const onSubmit = () => {
    console.log("onsubmit")
  }

  const handleClose = () => {
    console.log("handle close")
    setShowPasswordModal(false)
  }

  return (
    <AdminPanelContainer
      search={<SearchInput/>}
      onclickFilter={onClickFilter}
      title={"Blockchain Transactions"}
      // filter={   <Filter
      //   bank={BankFilter}
      //   support={SupportFilter}
      //   superAdmin={SuperAdminFilter}
      //   apply={applyFilter}
      //   cancel={cancelFilter}
      //   clearAll={clearFilter}/>}
      navbarTitle={""}

    >

      <Row className={'main-row'}>
        <div className='content'>
          <AdvancedTable
            onClickPage={onClickPage}
            currentPage={CurrentPage}
            totalItems={TotalItems} headerRow={ColumnsTitles}
            deletable={true} paginate={false} rows={Items}
            onNext={onNextPage}
            onPrevious={onPreviousPage}/>
        </div>
      </Row>

      <Modal
        show={ShowPasswordModal}
        onHide={handleClose}
        className={''}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >


        <>
          <Modal.Header closeButton>
            <Modal.Title className='title-modal m-2'>Privacy Requirement</Modal.Title>
          </Modal.Header>
          <form onSubmit={onSubmit}>
            <Modal.Body style={{paddingLeft: 30, paddingRight: 30}}
            >
              <div>
                <h6 className='title-h6'>Please enter your password to confirm</h6>
              </div>


              <Form.Group className="mb-3">
                <Form.Label className='form-label'>PASSWORD</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="password" name="password" value={Password} className='input-large'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button variant="outline-secondary" id="button-addon2" className='eyes-buttons'>
                    <Eyes/>
                  </Button>
                </InputGroup>
              </Form.Group>


            </Modal.Body>
            <Modal.Footer>
              <Stack gap={2} className="col-md-5 mx-auto modal-button mb-4">
                <Button variant="primary" onClick={getItem} type="button">
                  Confirm
                </Button>
              </Stack>

            </Modal.Footer>
          </form>
        </>
      </Modal>


    </AdminPanelContainer>
  )
})

export default BlockTransactionsPage;
