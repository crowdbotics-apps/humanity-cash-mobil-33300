import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import './Dashboard.css';
import { PageWeb } from "../../components";
import { useNavigate } from "react-router-dom";
import { Button, Offcanvas, Spinner, Tab, Tabs, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useStores } from "../../models/root-store/root-store-context";
import { genericApiError } from "../../helpers";
import logo from '../../assets/images/logo.png';
import { ROUTES } from '../../constants';

export const Dashboard: React.FC = observer(() => {
  // const navigate = useNavigate();
  // const rootStore = useStores()

  const [LeftOpen, setLeftOpen] = useState<any>(true);
  const [RightOpen, setRightOpen] = useState<any>(true);


  const SideMenu = () => (
    <div className='side-menu'>
      <img src={logo} alt={"logo"} className={"logo mt-5 mb-5"} />
    </div>
  )

  const DashContent = () => (
    <div className='dash-content'>

    </div>
  )

  return (
    <div id='layout'>
      <div id='left' className={LeftOpen ? 'open' : 'closed'} >
        <div className='icon'
          onClick={() => setLeftOpen(!LeftOpen)} >
          &equiv;
        </div>
        <div className={`sidebar ${LeftOpen ? 'open' : 'closed'}`} >
          <div className='header'>
          </div>
          <div className='content'>
            <img src={logo} alt={"logo"} className={"logo"} />
            <p className="menu-label">Dashboard</p>
            <p className="menu-label">ACH Transactions</p>
            <p className="menu-label">Blockchain Transactions</p>
            <p className="menu-label">Users</p>
            <p className="menu-label">Smart Contracts</p>
            <p className="menu-label">Content</p>
            <p className="menu-label">Sign out</p>
          </div>
        </div>
      </div>

      <div id='main'>
        <div className='header'>
          <h3 className={`
            title
            ${'left-' + LeftOpen ? 'open' : 'closed'}
            ${'right-' + RightOpen ? 'open' : 'closed'}
        `}>
            Header
          </h3>
        </div>
        <div className='content'>


          <Tabs defaultActiveKey="completed" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="completed" title="COMPLETED">
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
            </Tab>
            <Tab eventKey="pending" title="PENDING">
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
            </Tab>
          </Tabs>




        </div>
      </div>
    </div>
  );
});

export default Dashboard;
