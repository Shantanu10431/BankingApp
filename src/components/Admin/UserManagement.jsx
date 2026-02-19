import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Pagination, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import { adminAPI } from '../../services/api';
import { Users, Lock, Unlock, Trash2, Search } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers({ page, limit: 20 });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFreezeToggle = async (user) => {
    setActionLoading(true);
    try {
      await adminAPI.freezeAccount(user.id, !user.isFrozen);
      setMessage({
        type: 'success',
        text: `Account ${user.isFrozen ? 'unfrozen' : 'frozen'} successfully`
      });
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Action failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      await adminAPI.deleteUser(selectedUser.id);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Delete failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.accountNumber.includes(searchTerm)
  );

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
          <Users size={24} className="text-white" />
          <h4 className="mb-0 text-white">User Management</h4>
        </div>
        <div className="d-flex gap-2">
          <div className="position-relative">
            <Search size={18} className="position-absolute" style={{ left: '10px', top: '10px', color: '#6c757d' }} />
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '35px', width: '250px' }}
            />
          </div>
        </div>
      </div>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <div className="glass-panel p-0 overflow-hidden">
        <Table responsive hover className="mb-0 text-white" style={{ '--bs-table-hover-color': 'white', '--bs-table-hover-bg': 'rgba(255,255,255,0.1)' }}>
          <thead className="border-bottom border-secondary border-opacity-25">
            <tr className="text-white-50">
              <th className="bg-transparent border-0 py-3 ps-4">Name</th>
              <th className="bg-transparent border-0 py-3">Email</th>
              <th className="bg-transparent border-0 py-3">Account Number</th>
              <th className="bg-transparent border-0 py-3 text-end">Balance</th>
              <th className="bg-transparent border-0 py-3">Role</th>
              <th className="bg-transparent border-0 py-3">Status</th>
              <th className="bg-transparent border-0 py-3">Joined</th>
              <th className="bg-transparent border-0 py-3 pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-white-50 bg-transparent">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="align-middle border-bottom border-secondary border-opacity-25">
                  <td className="fw-medium bg-transparent border-0 ps-4">{user.name}</td>
                  <td className="bg-transparent border-0">{user.email}</td>
                  <td className="bg-transparent border-0" style={{ fontFamily: 'monospace' }}>{user.accountNumber}</td>
                  <td className="text-end bg-transparent border-0">{formatCurrency(user.balance)}</td>
                  <td className="bg-transparent border-0">
                    <Badge bg={user.role === 'ADMIN' ? 'danger' : 'info'} className="bg-opacity-75">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="bg-transparent border-0">
                    <Badge bg={user.isFrozen ? 'warning' : 'success'} className="bg-opacity-75">
                      {user.isFrozen ? 'Frozen' : 'Active'}
                    </Badge>
                  </td>
                  <td className="text-white-50 small bg-transparent border-0">{formatDate(user.createdAt)}</td>
                  <td className="bg-transparent border-0 pe-4">
                    <div className="d-flex gap-2">
                      <Button
                        variant={user.isFrozen ? "outline-success" : "outline-warning"}
                        size="sm"
                        onClick={() => handleFreezeToggle(user)}
                        disabled={actionLoading || user.role === 'ADMIN'}
                        title={user.isFrozen ? "Unfreeze Account" : "Freeze Account"}
                        className="btn-sm d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                      >
                        {user.isFrozen ? <Unlock size={16} /> : <Lock size={16} />}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        disabled={user.role === 'ADMIN'}
                        title="Delete User"
                        className="btn-sm d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {pagination.pages > 1 && (
          <div className="p-3 border-top border-secondary border-opacity-25">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-white-50">
                Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, pagination.total)} of {pagination.total} users
              </small>
              <Pagination size="sm" className="mb-0">
                <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next disabled={page === pagination.pages} onClick={() => setPage(page + 1)} />
              </Pagination>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - keeping standard style for now to avoid complexity */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          <p>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?</p>
          <p className="text-muted small">
            This action cannot be undone. All user data including transactions will be permanently deleted.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default UserManagement;