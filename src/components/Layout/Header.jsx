import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { Building2, User, LogOut, Shield } from 'lucide-react';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <Navbar style={{ backgroundColor: '#1a4fa3' }} variant="dark" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
          <Building2 size={28} />
          <div>
            <div className="fw-bold" style={{ fontSize: '1.1rem' }}>State Bank of India</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>Internet Banking Portal</div>
          </div>
        </Navbar.Brand>
        
        {user && (
          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="link" 
                className="text-white text-decoration-none d-flex align-items-center gap-2"
              >
                {isAdmin() && <Shield size={16} className="text-warning" />}
                <span>{user.name}</span>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.Item href="/profile">
                  <User size={16} className="me-2" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout} className="text-danger">
                  <LogOut size={16} className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;