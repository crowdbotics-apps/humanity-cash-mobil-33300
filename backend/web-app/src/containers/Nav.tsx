import React from 'react';
import {useLocation} from 'react-router-dom';
import {SearchIcon, ShapeIcon} from '../components/icons'
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from "./container.module.css"
type PropsNav = {
    sideBarActions: any;
    navbarTitle?:string;
    onclickFilter?():void
    filter?: React.ReactNode;
};


export const TheNav: React.FC<PropsNav> = ({ filter, sideBarActions, navbarTitle }) => {
    let location = useLocation();
    // console.log(location, 'location')
    return (

      <Navbar bg="light" expand="lg" className='mt-3 mb-2'>
          <div style={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'space-between',
              width:'100%'
          }}>
              <div>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => sideBarActions(true)}/>
              </div>
              <Navbar.Brand href="#home"> <h4 className="nav-title" style={{fontWeight:"400"}} >{navbarTitle??location.pathname}</h4></Navbar.Brand>
                <div style={{flex:1}}></div>
              <div className="me-auto ">
                  <form className="d-flex justify-content-center align-items-center" role="search">
                      <div className='' style={{width: 300}}>
                          <InputGroup className="mb-0 search-button-group">
                              <Button variant="outline-secondary" id="button-addon2" className='search-buttons'>
                                  <SearchIcon />
                              </Button>
                              <Form.Control
                                placeholder='Search'
                                type="search" name="search" className='search-button-navbar'
                              />
                          </InputGroup>
                      </div>
                      <div className='filter-navbar mb-1'>
                        {filter?filter:(
                          <button className="btn btn-outline-success btn-filter"
                                  type="button"> <ShapeIcon /></button>
                        )}

                      </div>
                  </form>
              </div>


          </div>
      </Navbar>
    )
}
