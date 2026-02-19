import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { Building2, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(response.data.user, response.data.token);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={5}>
              <div className="glass-card text-center p-5">
                <CheckCircle size={64} className="text-success mx-auto mb-3" />
                <h3 className="text-white">Registration Successful!</h3>
                <p className="text-white-50">Your account has been created. Redirecting to dashboard...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <div className="glass-card p-5">
              <div className="text-center mb-4">
                <div className="bg-white rounded-circle p-3 d-inline-block mb-3 shadow">
                  <Building2 size={40} color="#1a4fa3" />
                </div>
                <h3 className="mb-1 text-white">Create Account</h3>
                <p className="text-white-50">Register for SBI Internet Banking</p>
              </div>

              {error && <Alert variant="danger" className="glass-error">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your full name"
                    className="glass-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Enter your email"
                    className="glass-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Create a password (min 6 chars)"
                    className="glass-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    placeholder="Confirm your password"
                    className="glass-input"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 btn-glass"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0 text-white-50">
                  Already have an account?{' '}
                  <a href="/login" className="text-info fw-bold">Sign In</a>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;