import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Badge, Spinner, Button } from 'react-bootstrap';
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
          <Spinner animation="border" variant="primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <ShieldCheck size={24} color="#1a4fa3" />
          <h4 className="mb-0">Admin Dashboard</h4>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#e8f0fe' }}>
                <Users size={24} color="#1a4fa3" />
              </div>
              <div>
                <div className="text-muted small">Total Users</div>
                <h4 className="mb-0">{stats?.stats?.totalUsers}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#e8f5e9' }}>
                <ArrowRightLeft size={24} color="#2e7d32" />
              </div>
              <div>
                <div className="text-muted small">Total Transactions</div>
                <h4 className="mb-0">{stats?.stats?.totalTransactions}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#fff3e0' }}>
                <Wallet size={24} color="#f57c00" />
              </div>
              <div>
                <div className="text-muted small">Bank Liquidity</div>
                <h6 className="mb-0">{formatCurrency(stats?.stats?.totalLiquidity)}</h6>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#ffebee' }}>
                <AlertTriangle size={24} color="#c62828" />
              </div>
              <div>
                <div className="text-muted small">Frozen Accounts</div>
                <h4 className="mb-0">{stats?.stats?.frozenAccounts}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's Stats */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle p-2" style={{ backgroundColor: '#e3f2fd' }}>
              <TrendingUp size={24} color="#1976d2" />
            </div>
            <div>
              <div className="text-muted small">Today&apos;s Transactions</div>
              <h5 className="mb-0">{stats?.stats?.todayTransactions}</h5>
            </div>
          </div>
          <Button variant="outline-primary" onClick={() => navigate('/admin/audit')}>
            View Audit Logs
          </Button>
        </Card.Body>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent System Transactions</h5>
          <Button variant="outline-primary" size="sm" onClick={() => navigate('/admin/users')}>
            Manage Users
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th className="text-end">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentTransactions?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                stats?.recentTransactions?.map((txn) => (
                  <tr key={txn.id}>
                    <td className="text-muted small">{formatDate(txn.createdAt)}</td>
                    <td>
                      <Badge bg={txn.type === 'CREDIT' ? 'success' : 'danger'}>
                        {txn.type}
                      </Badge>
                    </td>
                    <td>{txn.sender?.accountNumber || '-'}</td>
                    <td>{txn.receiver?.accountNumber || '-'}</td>
                    <td className={`text-end fw-medium ${txn.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(txn.amount)}
                    </td>
                    <td>
                      <Badge bg="success">{txn.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default AdminDashboard;