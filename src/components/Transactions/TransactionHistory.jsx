import React, { useEffect, useState } from 'react';
import { Table, Badge, Pagination, Spinner, Form } from 'react-bootstrap';
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
          <Spinner animation="border" variant="light" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <History size={24} className="text-white" />
          <h4 className="mb-0 text-white">Transaction History</h4>
        </div>
        <Form.Select
          style={{ width: '200px' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control"
        >
          <option value="ALL" className="text-dark">All Transactions</option>
          <option value="CREDIT" className="text-dark">Credits Only</option>
          <option value="DEBIT" className="text-dark">Debits Only</option>
        </Form.Select>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        <Table responsive hover className="mb-0 text-white" style={{ '--bs-table-hover-color': 'white', '--bs-table-hover-bg': 'rgba(255,255,255,0.1)' }}>
          <thead className="border-bottom border-secondary border-opacity-25">
            <tr className="text-white-50">
              <th className="bg-transparent border-0 py-3 ps-4">Date & Time</th>
              <th className="bg-transparent border-0 py-3">Transaction ID</th>
              <th className="bg-transparent border-0 py-3">Description</th>
              <th className="bg-transparent border-0 py-3">Details</th>
              <th className="bg-transparent border-0 py-3">Type</th>
              <th className="bg-transparent border-0 py-3 text-end">Amount</th>
              <th className="bg-transparent border-0 py-3 pe-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-white-50 bg-transparent">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr key={txn.id} className="align-middle border-bottom border-secondary border-opacity-25">
                  <td className="text-white-50 bg-transparent ps-4 border-0">{formatDate(txn.createdAt)}</td>
                  <td className="bg-transparent border-0 text-white-50">
                    <code className="text-white-50 small" style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px' }}>{txn.referenceId.slice(0, 8)}...</code>
                  </td>
                  <td className="bg-transparent border-0">{txn.description}</td>
                  <td className="small bg-transparent border-0">
                    {txn.sender && txn.receiver && (
                      <div className="text-white-50">
                        <div>From: {txn.sender.accountNumber}</div>
                        <div>To: {txn.receiver.accountNumber}</div>
                      </div>
                    )}
                  </td>
                  <td className="bg-transparent border-0">
                    <Badge bg={txn.type === 'CREDIT' ? 'success' : 'danger'} className="bg-opacity-75">
                      {txn.type}
                    </Badge>
                  </td>
                  <td className={`text-end fw-bold bg-transparent border-0 ${txn.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
                    {txn.type === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </td>
                  <td className="bg-transparent border-0 pe-4">
                    <Badge bg="success" className="bg-opacity-75">{txn.status}</Badge>
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionHistory;