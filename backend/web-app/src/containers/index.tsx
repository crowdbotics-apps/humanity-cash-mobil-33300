import React, {useEffect, useState} from 'react';
import { Sidebar } from './Sidebar'
import { TheNav } from './Nav'
import Header from './Header'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


type Props = {
    children: React.ReactNode;
    title:string;
    header?: React.ReactNode;

};


const AdminPanelContainer: React.FC<Props> = ({ children, title, header }) => {


    const [sideBarAction, setSideBarAction] = useState(false);

    return (
        <Container fluid>
            <Row>
                {/* sidebar */}
                <Col xs={12} md={6} lg={6} style={{ background: 'black', display: 'contents' }} >
                    <Sidebar sideBarStatus={sideBarAction} sideBarActions={setSideBarAction} />
                </Col>
                <Col className='content-children'>
                    <Row xs={1}>
                        {/* nabvar */}
                        <Col><TheNav sideBarActions={setSideBarAction} /></Col>
                        {/* divider */}
                        <Col><div className='line-primary'></div></Col>
                        {/* header */}
                        <Col>
                            {header !== null && (header)||(
                              <Header title={title} />
                            )}

                        </Col>
                        {/* main */}
                        <Col>{children}</Col>
                        {/* footer debe ir abajo */}
                    </Row>
                </Col>
            </Row>
        </Container>

    );
}

export default AdminPanelContainer;
