import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { transactionAPI, authAPI } from '../../services/api';
import { ArrowRightLeft, CheckCircle, Wallet } from 'lucide-react';

const Transfer = () => {
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBalance, setNewBalance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await authAPI.getProfile();
      setBalance(parseFloat(response.data.user.balance));
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (transferAmount > balance) {
      setError('Insufficient balance');
      return;
    }

    if (!receiverAccount || receiverAccount.length !== 12) {
      setError('Please enter a valid 12-digit account number');
      return;
    }

    if (!/^\d{12}$/.test(receiverAccount)) {
      setError('Account number must be 12 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await transactionAPI.transfer({
        receiverAccountNumber: receiverAccount,
        amount: transferAmount,
        description: description || 'Fund Transfer'
      });
      setNewBalance(response.data.balance);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="border-0 shadow-sm text-center p-5">
              <CheckCircle size={64} color="#28a745" className="mx-auto mb-3" />
              <h4>Transfer Successful!</h4>
              <p className="text-muted">
                Amount: ₹{parseFloat(amount).toLocaleString('en-IN')}
              </p>
              <p className="text-muted">
                To Account: {receiverAccount}
              </p>
              <p className="text-muted">
                New Balance: ₹{parseFloat(newBalance).toLocaleString('en-IN')}
              </p>
              <div className="d-flex gap-3 justify-content-center mt-4">
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button variant="outline-primary" onClick={() => {
                  setSuccess(false);
                  setReceiverAccount('');
                  setAmount('');
                  setDescription('');
                }}>
                  Another Transfer
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Layout>
    );
  }

  return (
    <Layout>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <ArrowRightLeft size={24} color="#1a4fa3" />
                  <h5 className="mb-0">Transfer Money</h5>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Wallet size={18} />
                  <span>Balance: ₹{balance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Receiver Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={receiverAccount}
                    onChange={(e) => setReceiverAccount(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    required
                    maxLength={12}
                    placeholder="Enter 12-digit account number"
                    style={{ fontSize: '1.1rem', padding: '12px', letterSpacing: '2px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    max={balance}
                    placeholder="Enter amount to transfer"
                    style={{ fontSize: '1.1rem', padding: '12px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Description (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Rent payment"
                  />
                </Form.Group>

                <div className="d-flex gap-3">
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#1a4fa3', borderColor: '#1a4fa3' }}
                    disabled={loading || balance <= 0}
                    className="flex-grow-1"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      'Transfer Now'
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Transfer;