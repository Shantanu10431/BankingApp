import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { Building2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message
        ? `Error: ${err.response.data.message}`
        : `Login Failed (${err.message})`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
                <h3 className="mb-1 text-white">Welcome Back</h3>
                <p className="text-white-50">Sign in to your SBI account</p>
              </div>

              {error && <Alert variant="danger" className="glass-error">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
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

                <Form.Group className="mb-4">
                  <Form.Label className="text-white">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Enter your password"
                    className="glass-input"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 btn-glass"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0 text-white-50">
                  Don't have an account?{' '}
                  <a href="/register" className="text-info fw-bold">Register</a>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;