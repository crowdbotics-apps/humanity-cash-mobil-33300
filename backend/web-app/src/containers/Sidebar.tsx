import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import {
    ShapeIcon,
    NoteIcon,
    DocumentIcon,
    LogoutIcon,
    WalletIcon,
    SubtAdminIcon,
    UsersIcons,
    BlockChainIcon,
    DashboardIcon,
    CarsRemoveIcon,
    CloseIcons
} from '../components/icons'
import logo_admin from '../assets/images/logo_admin.png';
import logo_mini from '../assets/images/logo-mini.png';
type PropsSide = {
    sideBarStatus: boolean;
    sideBarActions: any;
};


export const Sidebar: React.FC<PropsSide> = ({ sideBarStatus, sideBarActions }) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(true);
    const toggle2 = () => setIsOpen(false);

    const menuItem = [
        {
            path: "/dashboard",
            name: "Dashboard",
            icons: <DashboardIcon />,
            style: 'pt-3'
        },
        {
            path: "/transactions",
            name: "ACH Transactions",
            icons: <CarsRemoveIcon />,
            style: 'pt-3'
        },
        {
            path: "/blockchain-transactions",
            name: "Blockchain Transactions",
            icons: <BlockChainIcon />,
            style: 'pt-3'
        },
        {
            path: "/users",
            name: "Users",
            icons: <UsersIcons />,
            style: 'pt-3'
        },
        {
            path: "/smart_contracts",
            name: "Smart Contracts",
            icons: <NoteIcon />,
            style: 'pt-3'
        },
        {
            path: "/content",
            name: "Content",
            icons: <DocumentIcon />,
            style: 'pt-3'
        },
        {
            path: "/admin_employees",
            name: "Admin employees / Sub - Admins",
            icons: <SubtAdminIcon />,
            style: 'pt-3'
        },
        {
            path: "/admin_wallet",
            name: "Admin Wallet Control",
            icons: <WalletIcon />,
            style: 'pt-3'
        },
        {
            path: "/logout",
            name: "Sign out ",
            icons: <LogoutIcon />,
            style: 'logount-buttons'
        }

    ]

    return (
        <div className={`sidebar ${sideBarStatus ? "sidebar-container" : ""} ${isOpen ? 'sidebar-container' : ''} ${sideBarStatus ? "sidebar-control-2" : "sidebar-control"}`} onMouseEnter={toggle}
            onMouseLeave={toggle2} >
            <div className="top_section">
                <img src={isOpen || sideBarStatus ? logo_admin : logo_mini} alt={!isOpen || sideBarStatus ? "logo_admin" : "logo_mine"} className={`${sideBarStatus || isOpen ? '' : 'logo'} img-fluid`} />
            </div>

            <div className="bars" onClick={() => sideBarActions(false)}>
                <div><CloseIcons/></div>
            </div>
            {menuItem.map((item, index) => (
                <NavLink to={item.path} key={index} className={`link ${item.style}`}  >
                    <div className='icon-nav'>{item.icons}</div>
                    <div className={`link_text ${isOpen ? '' : 'open-sidebar'}`}>{item.name}</div>
                </NavLink>
            ))}
        </div>
    );
}

