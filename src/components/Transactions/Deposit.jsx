import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
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
            <div className="glass-card text-center p-5">
              <CheckCircle size={64} className="text-success mx-auto mb-3" />
              <h4 className="text-white">Deposit Successful!</h4>
              <p className="text-white-50">
                Amount: ₹{parseFloat(amount).toLocaleString('en-IN')}
              </p>
              <p className="text-white-50">
                New Balance: ₹{parseFloat(newBalance).toLocaleString('en-IN')}
              </p>
              <div className="d-flex gap-3 justify-content-center mt-4">
                <Button className="btn-glass" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button className="btn-glass-outline" onClick={() => {
                  setSuccess(false);
                  setAmount('');
                  setDescription('');
                }}>
                  Make Another Deposit
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }

  return (
    <Layout>
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="glass-card p-0">
            <div className="p-4 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <ArrowDownCircle size={24} className="text-info" />
                <h5 className="mb-0 text-white">Deposit Funds</h5>
              </div>
            </div>
            <div className="p-4">
              {error && <Alert variant="danger" className="bg-danger bg-opacity-25 text-white border-danger border-opacity-50">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-white">Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    max="1000000"
                    placeholder="Enter amount to deposit"
                    className="form-control"
                    style={{ fontSize: '1.2rem', padding: '12px' }}
                  />
                  <Form.Text className="text-white-50">
                    Maximum deposit: ₹10,00,000 per transaction
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white">Description (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Cash deposit"
                    className="form-control"
                  />
                </Form.Group>

                <div className="d-flex gap-3">
                  <Button
                    type="submit"
                    className="flex-grow-1 btn-glass"
                    disabled={loading}
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
                    variant="link"
                    className="text-white-50 text-decoration-none"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default Deposit;