import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export const FormContent: React.FC<{ children: React.ReactNode}> = ({ children}) => (
  <Container>
    <Row className="justify-content-md-center">
      <Col xs md="6" className='background-paper'>
        <Col xs md="12">
          {children}
        </Col>
      </Col>
    </Row >
  </Container>
)

export default FormContent;
