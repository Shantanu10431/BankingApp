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
    minHeight: 'calc(100vh - 100px)',
    padding: '20px 0'
  };

  const linkStyle = {
    padding: '12px 20px',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.95rem',
    borderLeft: '4px solid transparent',
    transition: 'all 0.2s',
    margin: '4px 12px',
    borderRadius: '8px'
  };

  const activeStyle = {
    ...linkStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    borderLeftColor: '#00d2ff',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  return (
    <div className="glass-panel h-100 ms-3 mt-3">
      <Nav style={navStyle} className="flex-column">
        <NavLink
          to="/dashboard"
          className="nav-link-glass"
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
            <div className="mt-4 mb-2 px-4 text-uppercase text-white-50" style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px' }}>
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
    </div>
  );
};

export default Sidebar;