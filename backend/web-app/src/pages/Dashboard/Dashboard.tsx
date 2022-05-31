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

  const dataCompleted: any = [
    {
      id: 1,
      bank_name: 'Bank Name',
      deposits: '$3,635.22',
      withdrawls: '$31',
      ot_token_balance: 'B$0.34'
    },
    {
      id: 2,
      bank_name: 'Bank Name',
      deposits: '$3,643',
      withdrawls: '$21.11',
      ot_token_balance: 'B$0.34'
    },
    {
      id: 3,
      bank_name: 'Bank Name',
      deposits: '$3,635.22',
      withdrawls: '$31',
      ot_token_balance: 'B$0.34'
    },
    {
      id: 4,
      bank_name: 'Bank Name',
      deposits: '$3,643',
      withdrawls: '$21.11',
      ot_token_balance: 'B$0.34'
    },
    {
      id: 5,
      bank_name: 'Bank Name',
      deposits: '$3,635.22',
      withdrawls: '$31',
      ot_token_balance: 'B$20.00'
    },
    {
      id: 6,
      bank_name: 'Bank Name',
      deposits: '$3,643',
      withdrawls: '$21.11',
      ot_token_balance: 'B$0.34'
    },
    {
      id: 7,
      bank_name: 'Bank Name',
      deposits: '$3,635.22',
      withdrawls: '$31',
      ot_token_balance: 'B$20.00'
    },
    {
      id: 8,
      bank_name: 'Bank Name',
      deposits: '$3,643',
      withdrawls: '$21.11',
      ot_token_balance: 'B$0.34'
    },
  ]


  const Tab1Content = () => (
    <Table responsive>
      <thead>
        <tr className='table-header'>
          <th className='table-head'>BANK NAME</th>
          <th className='table-head'>DEPOSITS</th>
          <th className='table-head'>WHITHDRAWALS</th>
          <th className='table-head'>OUTSTANDING TOKEN BALANCE</th>
        </tr>
      </thead>
      <tbody className='table-body'>
        {dataCompleted.map((d: any, key: any) => (
          <tr className='table-row' key={key}>
            {Object.keys(d).map((info, key) => {
              if (info !== 'id') return <td className={`cell_${info}`} key={info + '_' + key}>{d[info]}</td>
            })}
          </tr>
        ))}
        <tr className='table-row-pagination'>
          <td className='table-total'>Showing 7 from 100 data</td>
          <td />
          <td />
          <td className='table-pagination'>
            <div className='table-page'><span>1</span></div>
            <div className='table-page'><span>2</span></div>
            <div className='table-page'><span>3</span></div>
          </td>
        </tr>
      </tbody>
    </Table>
  )

  const Tab2Content = () => (
    <Table responsive>
      <thead>
        <tr className='table-header'>
          <th className='table-head'>BANK NAME</th>
          <th className='table-head'>DEPOSITS</th>
          <th className='table-head'>WHITHDRAWALS</th>
          <th className='table-head'>OUTSTANDING TOKEN BALANCE</th>
        </tr>
      </thead>
      <tbody className='table-body'>
        {dataCompleted.map((d: any, key: any) => (
          <tr className='table-row' key={key}>
            {Object.keys(d).map((info, key) => {
              if (info !== 'id') return <td className={`cell_${info}`} key={info + '_' + key}>{d[info]}</td>
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  )

  return (
    <div id='layout'>
      <div id='left' className={LeftOpen ? 'open' : 'closed'} >
        <div className='icon'
          onClick={() => setLeftOpen(!LeftOpen)} >
          &equiv;
        </div>
        <div className={`sidebar ${LeftOpen ? 'open' : 'closed'}`} >
          <div className='content'>
            <div className='sidebar-content'>
              {/* <div className='header'>
          </div> */}
              <img src={logo} className={`logo${LeftOpen ? '' : '-closed'}`} alt={"logo"} />
              <div className="menu-label-active"><span>Dashboard</span></div>
              <div className="menu-label"><span>ACH Transactions</span></div>
              <div className="menu-label"><span>Blockchain Transactions</span></div>
              <div className="menu-label"><span>Users</span></div>
              <div className="menu-label"><span>Smart Contracts</span></div>
              <div className="menu-label"><span>Content</span></div>
            </div>
            <div className="menu-label"><span>Sign out</span></div>
          </div>
        </div>
      </div>

      <div id='main' className={`main${LeftOpen ? '' : '-closed'}`}>
        <div className='header'>
          <h3 className={`title
              ${'left-' + LeftOpen ? 'open' : 'closed'}
              ${'right-' + RightOpen ? 'open' : 'closed'}
            `}
          >
            Dashboard
          </h3>
          <input placeholder='Search' className='col-12 input-field mb-3' type="text" name="username" />
        </div>
        <div className='content'>
          <div className='line' />
          <div className='main-content'>
            <Tabs defaultActiveKey="completed" id="uncontrolled-tab-example" className="mb-3 custom-tabs">
              <Tab eventKey="completed" title="COMPLETED" className='custom-tab'>
                {Tab1Content()}
              </Tab>
              <Tab eventKey="pending" title="PENDING" className='custom-tab'>
                {Tab2Content()}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
