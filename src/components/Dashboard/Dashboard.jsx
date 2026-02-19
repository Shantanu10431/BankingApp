import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
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
          <Spinner animation="border" variant="primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h4 className="mb-4">Account Dashboard</h4>

      {/* Account Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#e8f0fe' }}>
                <Wallet size={24} color="#1a4fa3" />
              </div>
              <div>
                <div className="text-muted small">Current Balance</div>
                <h4 className="mb-0" style={{ color: '#1a4fa3' }}>
                  {formatCurrency(data?.user?.balance)}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#e8f5e9' }}>
                <Landmark size={24} color="#2e7d32" />
              </div>
              <div>
                <div className="text-muted small">Account Number</div>
                <h5 className="mb-0">{data?.user?.accountNumber}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#fff3e0' }}>
                <CreditCard size={24} color="#f57c00" />
              </div>
              <div>
                <div className="text-muted small">IFSC Code</div>
                <h5 className="mb-0">{data?.user?.ifscCode}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Button 
            variant="outline-primary" 
            className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/deposit')}
          >
            <ArrowDownCircle size={20} />
            Deposit Funds
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button 
            variant="outline-primary" 
            className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/withdraw')}
          >
            <ArrowUpCircle size={20} />
            Withdraw Funds
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button 
            variant="outline-primary" 
            className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate('/transfer')}
          >
            <ArrowRightLeft size={20} />
            Transfer Money
          </Button>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Transactions</h5>
          <Button variant="link" onClick={() => navigate('/transactions')}>
            View All
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th className="text-end">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentTransactions?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                data?.recentTransactions?.map((txn) => (
                  <tr key={txn.id}>
                    <td className="text-muted small">{formatDate(txn.createdAt)}</td>
                    <td>
                      {txn.description}
                      {txn.sender && txn.receiver && (
                        <div className="text-muted small">
                          {txn.senderId === data.user.id 
                            ? `To: ${txn.receiver.name}`
                            : `From: ${txn.sender.name}`
                          }
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge bg={txn.type === 'CREDIT' ? 'success' : 'danger'}>
                        {txn.type}
                      </Badge>
                    </td>
                    <td className={`text-end fw-medium ${txn.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
                      {txn.type === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount)}
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

export default Dashboard;