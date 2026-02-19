import React, { useEffect, useState } from 'react';
import { Table, Badge, Pagination, Spinner, Form } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import { adminAPI } from '../../services/api';
import { FileText } from 'lucide-react';

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
          <Spinner animation="border" variant="light" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <FileText size={24} className="text-white" />
          <h4 className="mb-0 text-white">Audit Logs</h4>
        </div>
        <Form.Select
          style={{ width: '200px' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control"
        >
          <option value="ALL" className="text-dark">All Actions</option>
          <option value="LOGIN" className="text-dark">Login</option>
          <option value="DEPOSIT" className="text-dark">Deposits</option>
          <option value="WITHDRAW" className="text-dark">Withdrawals</option>
          <option value="TRANSFER" className="text-dark">Transfers</option>
          <option value="ACCOUNT" className="text-dark">Account Management</option>
        </Form.Select>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <Table responsive hover className="mb-0 text-white" style={{ '--bs-table-hover-color': 'white', '--bs-table-hover-bg': 'rgba(255,255,255,0.1)' }}>
          <thead className="border-bottom border-secondary border-opacity-25">
            <tr className="text-white-50">
              <th className="bg-transparent border-0 py-3 ps-4">Timestamp</th>
              <th className="bg-transparent border-0 py-3">User</th>
              <th className="bg-transparent border-0 py-3">Account</th>
              <th className="bg-transparent border-0 py-3">Action</th>
              <th className="bg-transparent border-0 py-3">Details</th>
              <th className="bg-transparent border-0 py-3 pe-4">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5 text-white-50 bg-transparent">
                  No audit logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="align-middle border-bottom border-secondary border-opacity-25">
                  <td className="text-white-50 small bg-transparent ps-4 border-0">{formatDate(log.createdAt)}</td>
                  <td className="bg-transparent border-0">{log.user?.name || 'Unknown'}</td>
                  <td className="bg-transparent border-0 text-white-50" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {log.user?.accountNumber}
                  </td>
                  <td className="bg-transparent border-0">
                    <Badge bg={getActionBadgeColor(log.action)} className="bg-opacity-75">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="small bg-transparent border-0">
                    {log.metadata && (
                      <div className="text-white-50">
                        {log.metadata.amount && (
                          <span>Amount: ₹{log.metadata.amount}</span>
                        )}
                        {log.metadata.receiverAccountNumber && (
                          <span className="ms-2">To: {log.metadata.receiverAccountNumber}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="small text-white-50 bg-transparent border-0 pe-4">{log.ipAddress || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {pagination.pages > 1 && (
          <div className="p-3 border-top border-secondary border-opacity-25">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-white-50">
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuditLogs;