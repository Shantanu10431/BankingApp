import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="sbi-app" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col md={2} className="d-none d-md-block">
            <Sidebar />
          </Col>
          <Col md={10} className="p-4">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;