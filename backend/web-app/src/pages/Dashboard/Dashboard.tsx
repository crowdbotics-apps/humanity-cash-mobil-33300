import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import './Dashboard.css';
import { PageWeb } from "../../components";
import { useNavigate } from "react-router-dom";
import { Button, Offcanvas, Spinner, Tab, Tabs, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useStores } from "../../models/root-store/root-store-context";
import { genericApiError } from "../../helpers";
import logo from '../../assets/images/logo_humanity.png';
import { ROUTES } from '../../constants';

export const Dashboard: React.FC = observer(() => {
  // const navigate = useNavigate();
  // const rootStore = useStores()

  const [LeftOpen, setLeftOpen] = useState<any>(true);
  const [RightOpen, setRightOpen] = useState<any>(true);


  const Tab1Content = () => (
    <Table responsive>
      <thead>
        <tr>
          <th>#</th>
          {Array.from({ length: 12 }).map((_, index) => (
            <th key={index}>Table heading</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          {Array.from({ length: 12 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>2</td>
          {Array.from({ length: 12 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>3</td>
          {Array.from({ length: 12 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
      </tbody>
    </Table>
  )

  const Tab2Content = () => (
    <Table responsive>
      <thead>
        <tr>
          <th>#</th>
          {Array.from({ length: 8 }).map((_, index) => (
            <th key={index}>Table heading</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          {Array.from({ length: 8 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>2</td>
          {Array.from({ length: 8 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>3</td>
          {Array.from({ length: 8 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
      </tbody>
    </Table>
  )

  return (
    <div id='layout'>
      <div id='left' className={LeftOpen ? 'open' : 'closed'} >
        <div className='icon'
          onClick={() => setLeftOpen(!LeftOpen)} >
          {/* &equiv; */}
             <img src={logo} alt={"logo"} className={"logo"} />
        </div>
        <div className={`sidebar ${LeftOpen ? 'open' : 'closed'}`} >
          <div className='header'>
          </div>
          <div className='content'>
            <div className='sidebar-content'>
             
              <div className="menu-label"><span>Dashboard</span></div>
              <div className="menu-label"><span>ACH Transactions</span></div>
              <div className="menu-label"><span>Blockchain Transactions</span></div>
              <div className="menu-label"><span>Users</span></div>
              <div className="menu-label"><span>Smart Contracts</span></div>
              <div className="menu-label"><span>Content</span></div>
              <div className="menu-label"><span>Sign out</span></div>
            </div>
          </div>
        </div>
      </div>

      <div id='main'>
        <div className='header'>
          <h3 className={`title
              ${'left-' + LeftOpen ? 'open' : 'closed'}
              ${'right-' + RightOpen ? 'open' : 'closed'}
            `}
          >
            Header
          </h3>
        </div>
        <div className='content'>
          <Tabs defaultActiveKey="completed" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="completed" title="COMPLETED">
              {Tab1Content()}
            </Tab>
            <Tab eventKey="pending" title="PENDING">
              {Tab2Content()}
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
