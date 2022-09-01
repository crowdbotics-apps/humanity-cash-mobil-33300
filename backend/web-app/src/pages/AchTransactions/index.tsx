import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import SimpleTable from '../../components/Table'
import {Tab, Tabs} from "react-bootstrap";
import {dataCompleted} from './constants';
import AdminPanelContainer from "../../containers";



const AchTransactions: React.FC = observer(() => {

    const [LeftOpen, setLeftOpen] = useState<any>(true);
    //const [RightOpen, setRightOpen] = useState<any>(true);



    return (
      <AdminPanelContainer title={'transactions'} >
        <div id='layout'>
            <div id='main' className={`main${LeftOpen ? '' : '-closed'}`}>
                <div className='content'>
                    <Tabs defaultActiveKey="completed" id="uncontrolled-tab-example" className="mb-3 ">
                        <Tab eventKey="completed" title="COMPLETED" style={{ color: '#808080' }}>
                            <SimpleTable rows={dataCompleted} />
                        </Tab>
                        <Tab eventKey="pending" title="PENDING" style={{ color: '#808080' }} >
                            <SimpleTable rows={dataCompleted}  />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
      </AdminPanelContainer>
    )
})

export default AchTransactions;
