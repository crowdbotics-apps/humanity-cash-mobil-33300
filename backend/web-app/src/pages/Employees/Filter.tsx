import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Overlay} from "react-bootstrap";
import styles from "./Employee.module.css";
import {ShapeIcon} from "../../components/icons";

type FilterProps = {
  apply(data:any):void
  cancel():void
  clearAll():void
  bank:boolean
  support:boolean
  superAdmin:boolean
};


export const Filter: React.FC<FilterProps> = ({ apply, cancel, clearAll, bank, support, superAdmin }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [Bank, setBank] = useState(false)
  const [Support, setSupport] = useState(false)
  const [SuperAdmin, setSuperAdmin] = useState(false)

  useEffect(() => {
    if(bank){
      setBank(true)
    }
    if(support){
      setSupport(true)
    }
    if(superAdmin){
      setSuperAdmin(true)
    }

  },[])

  return (
    <>
      <button className="btn btn-outline-success btn-filter"
              ref={target}
              onClick={()=>{
                  setShow(true)
              }}
              type="button"> <ShapeIcon /></button>
      <Overlay target={target.current} show={show} placement="bottom">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              border:"var(--blue) solid 2px",
              borderWidth:1,
              borderRadius:14,
              padding:20,
              // color: 'white',
              ...props.style,
            }}
          >
            <div style={{borderWidth:2, borderColor:"blue", width:"400px"}}>
              <div className={'d-flex flex-row navbar-filter-block'}>
                <div className={'d-flex flex-row'}>
                  <div className={styles.filterLabel} >Super Admin</div>
                  <Form.Check
                    className={'ms-2 navbar-filter-checkbox'}
                    type={'checkbox'}
                    checked={SuperAdmin}
                    id={`filter-super-admin-checkbox`}
                    onChange={(e:any)=>{
                      setSuperAdmin(e.target.checked)
                    }}
                  />
                </div>
                <div className={'d-flex flex-row ms-4'}>
                  <div className={styles.filterLabel} >Bank</div>
                  <Form.Check
                    className={'ms-2 navbar-filter-checkbox'}
                    type={'checkbox'}
                    checked={Bank}
                    id={`filter-bank-checkbox`}
                    onChange={(e:any)=>{
                      setBank(e.target.checked)
                    }}
                  />
                </div>
                <div className={'d-flex flex-row ms-4'}>
                  <div className={styles.filterLabel} >App Support</div>
                  <Form.Check
                    onChange={(e:any)=>{
                      setSupport(e.target.checked)
                    }}
                    checked={Support}
                    className={'ms-2 navbar-filter-checkbox'}
                    type={'checkbox'}
                    id={`filter-app-support-checkbox`}
                  />
                </div>
              </div>
              <div className={styles.navbarFilterDivider} />
              <div className={'d-flex flex-row justify-content-between mt-3'}>
                <div className={`${styles.clearFilters} text-left`}
                     onClick={()=>{
                       setShow(false)
                       setBank(false)
                       setSupport(false)
                       setSuperAdmin(false)
                       clearAll()
                     }}
                >
                  Clear all filters
                </div>
                <div className={'d-flex flex-row justify-content-between '}>
                  <div className={`${styles.cancelFilter} text-center`}
                       onClick={()=>{
                         setShow(false)
                         cancel()
                       }}
                  >
                    Cancel
                  </div>
                  <div className={`${styles.applyFilter} text-center ms-3`}
                       onClick={()=>{
                         setShow(false)
                         apply({bank:Bank, support:Support, superAdmin:SuperAdmin})
                       }}
                  >
                    Apply
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}
      </Overlay>
    </>
  );
}