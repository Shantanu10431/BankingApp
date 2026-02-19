import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Spinner, Table } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import { authAPI } from '../../services/api';
import { UserCircle, Mail, Landmark, CreditCard, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
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
      month: 'long',
      year: 'numeric'
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
      <h4 className="mb-4">My Profile</h4>

      <Row>
        <Col md={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <div 
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    backgroundColor: '#e8f0fe' 
                  }}
                >
                  <UserCircle size={60} color="#1a4fa3" />
                </div>
              </div>
              <h5 className="mb-1">{user?.name}</h5>
              <p className="text-muted mb-2">{user?.email}</p>
              <Badge bg={user?.role === 'ADMIN' ? 'danger' : 'primary'}>
                {user?.role}
              </Badge>
              {user?.isFrozen && (
                <div className="mt-2">
                  <Badge bg="warning">Account Frozen</Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Account Information</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td style={{ width: '40%' }}>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <UserCircle size={18} />
                        <span>Full Name</span>
                      </div>
                    </td>
                    <td className="fw-medium">{user?.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Mail size={18} />
                        <span>Email Address</span>
                      </div>
                    </td>
                    <td className="fw-medium">{user?.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Landmark size={18} />
                        <span>Account Number</span>
                      </div>
                    </td>
                    <td className="fw-medium" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                      {user?.accountNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <CreditCard size={18} />
                        <span>IFSC Code</span>
                      </div>
                    </td>
                    <td className="fw-medium">{user?.ifscCode}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Shield size={18} />
                        <span>Account Status</span>
                      </div>
                    </td>
                    <td>
                      <Badge bg={user?.isFrozen ? 'warning' : 'success'}>
                        {user?.isFrozen ? 'Frozen' : 'Active'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Calendar size={18} />
                        <span>Member Since</span>
                      </div>
                    </td>
                    <td className="fw-medium">{formatDate(user?.createdAt)}</td>
                  </tr>
                </tbody>
              </Table>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted">Current Balance</div>
                <h4 className="mb-0" style={{ color: '#1a4fa3' }}>
                  {formatCurrency(user?.balance)}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Profile;