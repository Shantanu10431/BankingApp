import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { Building2, User, LogOut, Shield } from 'lucide-react';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <Navbar variant="dark" className="glass-panel m-3 mb-0 p-3 shadow text-white">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
          <div className="bg-white rounded-circle p-2">
            <Building2 size={24} color="#1a4fa3" />
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: '1.2rem', letterSpacing: '0.5px' }}>AKIRA BANK</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '2px' }} className="text-uppercase">Internet Banking</div>
          </div>
        </Navbar.Brand>

        {user && (
          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="text-white text-decoration-none d-flex align-items-center gap-2 border-0"
              >
                {isAdmin() && <Shield size={16} className="text-warning" />}
                <span className="fw-semibold">{user.name}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="glass-panel border-0 mt-2">
                <Dropdown.Item href="/profile" className="text-white hover:bg-white/10">
                  <User size={16} className="me-2" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider className="border-white/20" />
                <Dropdown.Item onClick={logout} className="text-danger hover:bg-red-500/10">
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