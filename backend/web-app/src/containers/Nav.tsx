// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import {
//     ShapeIcon,
//     NoteIcon,
//     DocumentIcon,
//     ShearchIcon,
//     LogoutIcon,
//     WalletIcon,
//     SubtAdminIcon,
//     BlockChainIcon,
//     DashboardIcon,
//     CarsRemoveIcon,
//     Eyes,
//     PaginateLeftIcon,
//     PaginateRightIcon,
//     UsersIcons
// } from '../components/icons'

// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';
// import Button from 'react-bootstrap/Button';

// export const Nav: React.FC = () => {
//     let location = useLocation();
//     console.log(location, 'location')
//     return (

//         <div className="nav-container mt-3 mb-3" >
//             <nav className="navbar navbar-expand-lg bg-light">
//                 <div className="collapse navbar-collapse">
//                     <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" >
//                         <li className="nav-item">
//                            
//                         </li>
//                         {/* si quieres agregar mas items */}
//                         {/* <li className="nav-item">
//                             <h4 className="nav-title" >{location.pathname}</h4>
//                         </li> */}

//                     </ul>

//                 </div>
//             </nav>
//         </div>
//     )
// }
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    ShapeIcon,
    NoteIcon,
    DocumentIcon,
    ShearchIcon,
    LogoutIcon,
    WalletIcon,
    SubtAdminIcon,
    BlockChainIcon,
    DashboardIcon,
    CarsRemoveIcon,
    Eyes,
    PaginateLeftIcon,
    PaginateRightIcon,
    UsersIcons
} from '../components/icons'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
type PropsNav = {
    sideBarActions: any;
};


export const TheNav: React.FC<PropsNav> = ({ sideBarActions }) => {
    let location = useLocation();
    console.log(location, 'location')
    return (

        <Navbar bg="light" expand="lg" className='mt-3 mb-3'>
            <Container fluid>
                <Row >
                    <Navbar.Brand href="#home"> <h4 className="nav-title" >{location.pathname}</h4></Navbar.Brand>
                </Row>
                <Row>

                    <div className="me-auto ">
                        <form className="d-flex" role="search">
                            <div className='search-navbar'>
                                <InputGroup className="mb-3">
                                    <Button variant="outline-secondary" id="button-addon2" className='search-buttons'>
                                        <ShearchIcon />
                                    </Button>
                                    <Form.Control
                                        placeholder='Search'
                                        type="search" name="search" className='input-large-search'
                                    />
                                </InputGroup>

                            </div>
                            <div className='filter-navbar'>
                                <button className="btn btn-outline-success btn-filter" style={{ background: '#f7f5f0' }} type="submit"> <ShapeIcon /></button>
                            </div>
                            <div>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => sideBarActions(true)}/>
                            </div>
                        </form>
                    </div>
                </Row>
            </Container>
        </Navbar>
    )
}