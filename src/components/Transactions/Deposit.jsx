import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { transactionAPI } from '../../services/api';
import { ArrowDownCircle, CheckCircle } from 'lucide-react';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBalance, setNewBalance] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (depositAmount > 1000000) {
      setError('Maximum deposit amount is ₹10,00,000');
      return;
    }

    setLoading(true);

    try {
      const response = await transactionAPI.deposit({
        amount: depositAmount,
        description: description || 'Deposit'
      });
      setNewBalance(response.data.balance);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Deposit failed');
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
              <h4>Deposit Successful!</h4>
              <p className="text-muted">
                Amount: ₹{parseFloat(amount).toLocaleString('en-IN')}
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
                  setAmount('');
                  setDescription('');
                }}>
                  Make Another Deposit
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
              <div className="d-flex align-items-center gap-2">
                <ArrowDownCircle size={24} color="#1a4fa3" />
                <h5 className="mb-0">Deposit Funds</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    max="1000000"
                    placeholder="Enter amount to deposit"
                    style={{ fontSize: '1.1rem', padding: '12px' }}
                  />
                  <Form.Text className="text-muted">
                    Maximum deposit: ₹10,00,000 per transaction
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Description (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Cash deposit"
                  />
                </Form.Group>

                <div className="d-flex gap-3">
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#1a4fa3', borderColor: '#1a4fa3' }}
                    disabled={loading}
                    className="flex-grow-1"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      'Deposit Now'
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

export default Deposit;