import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowRightLeft, 
  History, 
  UserCircle, 
  ShieldCheck,
  Users,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const navStyle = {
    backgroundColor: '#ffffff',
    minHeight: 'calc(100vh - 64px)',
    borderRight: '1px solid #ddd',
    padding: '20px 0'
  };

  const linkStyle = {
    padding: '12px 20px',
    color: '#333',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.95rem',
    borderLeft: '4px solid transparent',
    transition: 'all 0.2s'
  };

  const activeStyle = {
    ...linkStyle,
    backgroundColor: '#e8f0fe',
    color: '#1a4fa3',
    borderLeftColor: '#1a4fa3',
    fontWeight: '500'
  };

  return (
    <Nav style={navStyle} className="flex-column">
      <NavLink 
        to="/dashboard" 
        style={({ isActive }) => isActive ? activeStyle : linkStyle}
      >
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>
      
      <NavLink 
        to="/deposit" 
        style={({ isActive }) => isActive ? activeStyle : linkStyle}
      >
        <ArrowDownCircle size={20} />
        Deposit
      </NavLink>
      
      <NavLink 
        to="/withdraw" 
        style={({ isActive }) => isActive ? activeStyle : linkStyle}
      >
        <ArrowUpCircle size={20} />
        Withdraw
      </NavLink>
      
      <NavLink 
        to="/transfer" 
        style={({ isActive }) => isActive ? activeStyle : linkStyle}
      >
        <ArrowRightLeft size={20} />
        Transfer
      </NavLink>
      
      <NavLink 
        to="/transactions" 
        style={({ isActive }) => isActive ? activeStyle : linkStyle}
      >
        <History size={20} />
        Transactions
      </NavLink>
      
      <NavLink 
        to="/profile" 
        style={({ isActive }) => isActive ? activeStyle : linkStyle}
      >
        <UserCircle size={20} />
        Profile
      </NavLink>

      {isAdmin() && (
        <>
          <div className="mt-4 mb-2 px-4 text-uppercase text-muted" style={{ fontSize: '0.75rem', fontWeight: '600' }}>
            Admin
          </div>
          
          <NavLink 
            to="/admin" 
            style={({ isActive }) => isActive ? activeStyle : linkStyle}
          >
            <ShieldCheck size={20} />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            style={({ isActive }) => isActive ? activeStyle : linkStyle}
          >
            <Users size={20} />
            Users
          </NavLink>
          
          <NavLink 
            to="/admin/audit" 
            style={({ isActive }) => isActive ? activeStyle : linkStyle}
          >
            <FileText size={20} />
            Audit Logs
          </NavLink>
        </>
      )}
    </Nav>
  );
};

export default Sidebar;