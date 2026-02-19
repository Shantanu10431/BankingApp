import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Pagination, Spinner, Form, Row, Col } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import { adminAPI } from '../../services/api';
import { FileText, Search } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      const response = await adminAPI.getAuditLogs({ page, limit: 50 });
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      'USER_REGISTERED': 'info',
      'USER_LOGIN': 'success',
      'DEPOSIT': 'success',
      'WITHDRAW': 'primary',
      'TRANSFER_SENT': 'warning',
      'TRANSFER_RECEIVED': 'info',
      'ACCOUNT_FROZEN': 'danger',
      'ACCOUNT_UNFROZEN': 'success',
      'USER_DELETED': 'danger'
    };
    return colors[action] || 'secondary';
  };

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.action.includes(filter));

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
          <FileText size={24} color="#1a4fa3" />
          <h4 className="mb-0">Audit Logs</h4>
        </div>
        <Form.Select 
          style={{ width: '200px' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="DEPOSIT">Deposits</option>
          <option value="WITHDRAW">Withdrawals</option>
          <option value="TRANSFER">Transfers</option>
          <option value="ACCOUNT">Account Management</option>
        </Form.Select>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Account</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-muted small">{formatDate(log.createdAt)}</td>
                    <td>{log.user?.name || 'Unknown'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {log.user?.accountNumber}
                    </td>
                    <td>
                      <Badge bg={getActionBadgeColor(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="small">
                      {log.metadata && (
                        <div className="text-muted">
                          {log.metadata.amount && (
                            <span>Amount: ₹{log.metadata.amount}</span>
                          )}
                          {log.metadata.receiverAccountNumber && (
                            <span className="ms-2">To: {log.metadata.receiverAccountNumber}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="small text-muted">{log.ipAddress || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
        
        {pagination.pages > 1 && (
          <Card.Footer className="bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {((page - 1) * 50) + 1} - {Math.min(page * 50, pagination.total)} of {pagination.total} logs
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
          </Card.Footer>
        )}
      </Card>
    </Layout>
  );
};

export default AuditLogs;