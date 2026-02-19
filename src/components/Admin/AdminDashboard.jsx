import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Badge, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { adminAPI } from '../../services/api';
import {
  Users,
  ArrowRightLeft,
  Wallet,
  AlertTriangle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <Spinner animation="border" variant="light" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <ShieldCheck size={24} className="text-white" />
          <h4 className="mb-0 text-white">Admin Dashboard</h4>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <div className="glass-card h-100 d-flex align-items-center">
            <div className="rounded-circle p-3 me-3 bg-white bg-opacity-10">
              <Users size={24} className="text-info" />
            </div>
            <div>
              <div className="text-white-50 small text-uppercase fw-bold">Total Users</div>
              <h4 className="mb-0 text-white">{stats?.stats?.totalUsers}</h4>
            </div>
          </div>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <div className="glass-card h-100 d-flex align-items-center">
            <div className="rounded-circle p-3 me-3 bg-white bg-opacity-10">
              <ArrowRightLeft size={24} className="text-success" />
            </div>
            <div>
              <div className="text-white-50 small text-uppercase fw-bold">Total Transactions</div>
              <h4 className="mb-0 text-white">{stats?.stats?.totalTransactions}</h4>
            </div>
          </div>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <div className="glass-card h-100 d-flex align-items-center">
            <div className="rounded-circle p-3 me-3 bg-white bg-opacity-10">
              <Wallet size={24} className="text-warning" />
            </div>
            <div>
              <div className="text-white-50 small text-uppercase fw-bold">Bank Liquidity</div>
              <h6 className="mb-0 text-white">{formatCurrency(stats?.stats?.totalLiquidity)}</h6>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className="glass-card h-100 d-flex align-items-center">
            <div className="rounded-circle p-3 me-3 bg-white bg-opacity-10">
              <AlertTriangle size={24} className="text-danger" />
            </div>
            <div>
              <div className="text-white-50 small text-uppercase fw-bold">Frozen Accounts</div>
              <h4 className="mb-0 text-white">{stats?.stats?.frozenAccounts}</h4>
            </div>
          </div>
        </Col>
      </Row>

      {/* Today's Stats */}
      <div className="glass-card mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle p-2 bg-white bg-opacity-10">
              <TrendingUp size={24} className="text-primary" />
            </div>
            <div>
              <div className="text-white-50 small">Today&apos;s Transactions</div>
              <h5 className="mb-0 text-white">{stats?.stats?.todayTransactions}</h5>
            </div>
          </div>
          <Button className="btn-glass-outline" onClick={() => navigate('/admin/audit')}>
            View Audit Logs
          </Button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-panel p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 text-white">Recent System Transactions</h5>
          <Button className="btn-glass-outline btn-sm" onClick={() => navigate('/admin/users')}>
            Manage Users
          </Button>
        </div>

        <Table responsive hover className="mb-0 text-white" style={{ '--bs-table-hover-color': 'white', '--bs-table-hover-bg': 'rgba(255,255,255,0.1)' }}>
          <thead className="border-bottom border-secondary border-opacity-25">
            <tr className="text-white-50">
              <th className="bg-transparent border-0">Date</th>
              <th className="bg-transparent border-0">Type</th>
              <th className="bg-transparent border-0">From</th>
              <th className="bg-transparent border-0">To</th>
              <th className="bg-transparent border-0 text-end">Amount</th>
              <th className="bg-transparent border-0">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentTransactions?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-white-50 bg-transparent">
                  No transactions yet
                </td>
              </tr>
            ) : (
              stats?.recentTransactions?.map((txn) => (
                <tr key={txn.id} className="align-middle border-bottom border-secondary border-opacity-25">
                  <td className="text-white-50 bg-transparent border-0 small">{formatDate(txn.createdAt)}</td>
                  <td className="bg-transparent border-0">
                    <Badge bg={txn.type === 'CREDIT' ? 'success' : 'danger'} className="bg-opacity-75">
                      {txn.type}
                    </Badge>
                  </td>
                  <td className="bg-transparent border-0">{txn.sender?.accountNumber || '-'}</td>
                  <td className="bg-transparent border-0">{txn.receiver?.accountNumber || '-'}</td>
                  <td className={`text-end fw-medium bg-transparent border-0 ${txn.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="bg-transparent border-0">
                    <Badge bg="success" className="bg-opacity-75">{txn.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
};

export default AdminDashboard;