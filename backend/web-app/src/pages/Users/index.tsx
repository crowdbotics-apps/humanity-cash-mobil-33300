import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Form, Row} from "react-bootstrap";
import AdminPanelContainer from "../../containers";
import InputGroup from "react-bootstrap/InputGroup";
import {ArrowRightIcon, Eyes, SearchIcon} from "../../components/icons";
import AdvancedTable from "../../components/Table/AdvancedTable";
import {useApi, useUserStore} from "../../utils";
import {UserGroup} from "../../components/Table/constants";
import {genericApiError} from "../../helpers";
import {getErrorMessages, truncate} from "../../utils/functions";
import moment from 'moment'
import styles from './Users.module.css'
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import {toast} from "react-toastify";
import {ROUTES} from "../../constants";
import {useNavigate} from "react-router-dom";


const wrapHash = (txt:string, )=>{
  if (txt === null) return ''
  txt  = truncate(txt, 23)
  const  middle:number = Math.round(txt.length/2) - 1
  return <div className={styles.textTD}>{txt.slice(0, middle)}<br/>{txt.slice(middle, txt.length)}</div>
}

const COLUMN_TITLES = [
  'FULL NAME', 'EMAIL', 'USER DWOLLA ID',
  'BALANCE', 'LAST LOG IN', 'WALLET ADDRESS',
  'PHYSICAL ADDRESS', 'ACCOUNT TYPE'
]

const UsersPage: React.FC = observer(() => {

    const [LeftOpen, setLeftOpen] = useState<any>(true);
    //const [RightOpen, setRightOpen] = useState<any>(true);
  const [Items, setItems] = useState<any>([])
  const [TotalItems, setTotalItems] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Previous, setPrevious] = useState<string|null>(null)
  const [Next, setNext] = useState<string|null>(null)
  const [ShowUsername, setShowUsername] = useState<boolean>(true)
  const [ShowPasswordModal, setShowPasswordModal] = useState<boolean>(false)
  const [CurrentIndex, setCurrentIndex] = useState<number|null>(null)
  const [CurrentItem, setCurrentItem] = useState<any|null>(null)
  const [Password, setPassword] = useState<string>("")
  const [Title, setTitle] = useState<string>("Users")
  const [ColumnsTitles, setColumnsTitles] = useState(COLUMN_TITLES)
  const api = useApi()
  const userStore = useUserStore()
  const navigate = useNavigate()


  useEffect(() => {
    
    userStore.setUp()
    if (userStore.group === UserGroup.BANK.code){
      setColumnsTitles(COLUMN_TITLES.concat(['USERNAME']))
    }
    getItems()
  },[])

  useEffect(() => {
    if(ShowUsername){
      setPassword("holamundo")

    }
  }, [ShowUsername])

  const CreatedColumn = (opts:any)=>{
    return  ( opts.created !== null?<div>
              <span className={styles.createdTitle}>{moment(opts.created).format('MMMM DD, YYYY')}</span>
              <br/>
              <span className={styles.createdSubtitle}>{moment(opts.created).format('H:mm a').toUpperCase()}</span>
            </div>: null)
  }


  const getItem = ()=>{
    navigate(ROUTES.USERS_DETAIL(CurrentItem.id), {state:{user:CurrentItem}})
  }





  const getItems = ()=>{
    let params:any = {page:CurrentPage}
    // if (ShowUsername){
    //   params["show_username"] = true
    //   params["password"] = Password
    // }
    api.getDwollaUsers(params).then((response: any) => {
      
      if (response.kind === "ok") {
        setPrevious(response.data.previous)
        setNext(response.data.next)
        setTotalItems(response.data.count)
        const tableRows = []
        let index = 0
        for(let data of response.data.results){
          let row:any = {
            id: data.id,
            fullName: data.name,
            email: data.email,
            userDwollaId: wrapHash(data.dwolla_id),
            balance: data.balance,
            lastLogin:<CreatedColumn created={data.last_login}/>,
            walletAddress: wrapHash(data.crypto_wallet_id),
            address: data.address,
            accountType: data.account_type,
            show:  (<div >
              <Button type={"button"} onClick={()=>{
                setShowUsername(true)
                setShowPasswordModal(true)
                setCurrentItem(row)
                setCurrentIndex(index)

              }} className={styles.showButton}>show</Button>
            </div>)
          }

          index ++;
          tableRows.push(row)
        }
        setItems(tableRows)
      }
    }).catch((error: any) => {
      
      genericApiError()
    })
  }


    const onClickFilter = ()=>{

    }

    const applyFilter = (data:any)=>{
        


    }

    const cancelFilter = ()=>{



    }

  const onClickPage = (page:number)=>{
    
    setCurrentPage(page)
  }

  const onPreviousPage = ()=>{
    
    if(Previous){
      setCurrentPage(prevState => prevState-1)
    }
  }




  const onNextPage = ()=>{
    
    if(Next){
      setCurrentPage(prevState => prevState+1)
    }
  }

    const SearchInput = ()=>{
        return (
          <InputGroup className="mb-0 search-button-group">
              <Button variant="outline-secondary" id="button-addon2" className='search-buttons'>
                  <SearchIcon />
              </Button>
              <Form.Control
                placeholder='Search'
                type="search" name="search" className='search-button-navbar'
              />
          </InputGroup>)
    }

    const onSubmit = ()=>{
      
    }

    const handleClose = ()=>{
      
      setShowPasswordModal(false)
    }

    return (
      <AdminPanelContainer
        search={<SearchInput />}
        onclickFilter={onClickFilter}
        title={Title}
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
                  <Modal.Body style={{paddingLeft:30, paddingRight:30}}>
                    <div>
                      <h6 className='title-h6'>Please enter your password to confirm</h6>
                    </div>


                    <Form.Group className="mb-3" >
                      <Form.Label className='form-label'>PASSWORD</Form.Label>
                      <InputGroup className="mb-3">
                        <Form.Control
                          type="password" name="password" value={Password} className='input-large' onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button variant="outline-secondary" id="button-addon2" className='eyes-buttons'>
                          <Eyes />
                        </Button>
                      </InputGroup>
                    </Form.Group>


                  </Modal.Body>
                  <Modal.Footer>
                    <Stack gap={2} className="col-md-5 mx-auto modal-button mb-4">
                      <Button variant="primary" onClick={getItem} type="button" >
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

export default UsersPage;
