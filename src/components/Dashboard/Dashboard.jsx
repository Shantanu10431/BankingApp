import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Table, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { userAPI } from '../../services/api';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  Landmark,
  CreditCard
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await userAPI.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
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
      year: 'numeric',
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
      <h2 className="mb-4 text-white">Account Dashboard</h2>

      {/* Account Summary Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <div className="glass-card h-100 d-flex align-items-center">
            <div className="rounded-circle p-3 me-3 bg-white bg-opacity-10">
              <Wallet size={24} className="text-info" />
            </div>
            <div>
              <div className="text-white-50 small text-uppercase fw-bold">Current Balance</div>
              <h3 className="mb-0 text-white">
                {formatCurrency(data?.user?.balance)}
              </h3>
            </div>
          </div>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <div className="glass-card h-100 d-flex align-items-center">
            <div className="rounded-circle p-3 me-3 bg-white bg-opacity-10">
              <Landmark size={24} className="text-success" />
            </div>
            <div>
              <div className="text-white-50 small text-uppercase fw-bold">Account Number</div>
              <h4 className="mb-0 text-white">{data?.user?.accountNumber}</h4>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="glass-card h-100 d-flex align-items-center">
            <div className="rounded-circle p-3 me-3 bg-white bg-opacity-10">
              <CreditCard size={24} className="text-warning" />
            </div>
            <div>
              <div className="text-white-50 small text-uppercase fw-bold">IFSC Code</div>
              <h4 className="mb-0 text-white">{data?.user?.ifscCode}</h4>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <h5 className="text-white mb-3">Quick Actions</h5>
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Button
            className="w-100 py-3 d-flex align-items-center justify-content-center gap-2 btn-glass"
            onClick={() => navigate('/deposit')}
          >
            <ArrowDownCircle size={20} />
            Deposit Funds
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            className="w-100 py-3 d-flex align-items-center justify-content-center gap-2 btn-glass"
            onClick={() => navigate('/withdraw')}
          >
            <ArrowUpCircle size={20} />
            Withdraw Funds
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            className="w-100 py-3 d-flex align-items-center justify-content-center gap-2 btn-glass"
            onClick={() => navigate('/transfer')}
          >
            <ArrowRightLeft size={20} />
            Transfer Money
          </Button>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <div className="glass-panel p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 text-white">Recent Transactions</h5>
          <Button variant="link" className="text-info text-decoration-none" onClick={() => navigate('/transactions')}>
            View All
          </Button>
        </div>

        <Table responsive hover className="mb-0 text-white" style={{ '--bs-table-hover-color': 'white', '--bs-table-hover-bg': 'rgba(255,255,255,0.1)' }}>
          <thead className="border-bottom border-secondary">
            <tr className="text-white-50">
              <th className="bg-transparent border-0">Date</th>
              <th className="bg-transparent border-0">Description</th>
              <th className="bg-transparent border-0">Type</th>
              <th className="bg-transparent border-0 text-end">Amount</th>
              <th className="bg-transparent border-0">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.recentTransactions?.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-white-50 bg-transparent">
                  No transactions yet
                </td>
              </tr>
            ) : (
              data?.recentTransactions?.map((txn) => (
                <tr key={txn.id} className="align-middle">
                  <td className="text-white-50 bg-transparent border-secondary border-opacity-25">{formatDate(txn.createdAt)}</td>
                  <td className="bg-transparent border-secondary border-opacity-25">
                    {txn.description}
                    {txn.sender && txn.receiver && (
                      <div className="text-white-50 small">
                        {txn.senderId === data.user.id
                          ? `To: ${txn.receiver.name}`
                          : `From: ${txn.sender.name}`
                        }
                      </div>
                    )}
                  </td>
                  <td className="bg-transparent border-secondary border-opacity-25">
                    <Badge bg={txn.type === 'CREDIT' ? 'success' : 'danger'} className="bg-opacity-75">
                      {txn.type}
                    </Badge>
                  </td>
                  <td className={`bg-transparent border-secondary border-opacity-25 text-end fw-bold ${txn.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
                    {txn.type === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </td>
                  <td className="bg-transparent border-secondary border-opacity-25">
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

export default Dashboard;