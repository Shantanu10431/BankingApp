import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Pagination, Spinner, Form, Row, Col } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import { userAPI } from '../../services/api';
import { History } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      const response = await userAPI.getTransactions({ page, limit: 10 });
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
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

  const filteredTransactions = filter === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

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
          <History size={24} color="#1a4fa3" />
          <h4 className="mb-0">Transaction History</h4>
        </div>
        <Form.Select 
          style={{ width: '200px' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Transactions</option>
          <option value="CREDIT">Credits Only</option>
          <option value="DEBIT">Debits Only</option>
        </Form.Select>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Date & Time</th>
                <th>Transaction ID</th>
                <th>Description</th>
                <th>Details</th>
                <th>Type</th>
                <th className="text-end">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="text-muted small">{formatDate(txn.createdAt)}</td>
                    <td>
                      <code className="small">{txn.referenceId.slice(0, 8)}...</code>
                    </td>
                    <td>{txn.description}</td>
                    <td className="small">
                      {txn.sender && txn.receiver && (
                        <>
                          <div>From: {txn.sender.accountNumber}</div>
                          <div>To: {txn.receiver.accountNumber}</div>
                        </>
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
        
        {pagination.pages > 1 && (
          <Card.Footer className="bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {((page - 1) * 10) + 1} - {Math.min(page * 10, pagination.total)} of {pagination.total} transactions
              </small>
              <Pagination size="sm" className="mb-0">
                <Pagination.Prev 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)}
                />
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  disabled={page === pagination.pages} 
                  onClick={() => setPage(page + 1)}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>
    </Layout>
  );
};

export default TransactionHistory;