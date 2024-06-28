import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchInvoices } from '../redux/invoicesSlice';
import { logout } from '../redux/authSlice';
import { Invoice } from '../types';
import { useNavigate } from 'react-router-dom';

const Invoices: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const invoices = useAppSelector((state) => state.invoices.invoices);
  const status = useAppSelector((state) => state.invoices.status);
  const error = useAppSelector((state) => state.invoices.error);
  const user = useAppSelector((state) => state.auth.user);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [jumpPage, setJumpPage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(fetchInvoices({ page, limit }));
    }
  }, [dispatch, user, navigate, page, limit]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading invoices: {error}</div>;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(invoiceId)
        ? prevSelected.filter((id) => id !== invoiceId)
        : [...prevSelected, invoiceId]
    );
  };

  const formatStatus = (isPaid: boolean) => (isPaid ? 'Paid' : 'Open');
  const getTodayDate = () => new Date().toLocaleDateString();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (!isNaN(pageNumber) && pageNumber > 0) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo">LOGO</div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Invoices</a></li>
            <li><a href="#">Bills</a></li>
            <li><a href="#">Expenses</a></li>
            <li><a href="#">Reports</a></li>
          </ul>
        </nav>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
      <div className="main">
        <div className="header">
          <div>Home / Invoices</div>
          <div>User</div>
        </div>
        <div className="table-container">
          <h1>Invoices</h1>
          {invoices.length === 0 ? (
            <div>No data available</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Date</th>
                  <th>Payee</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice: Invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                      />
                    </td>
                    <td>{getTodayDate()}</td>
                    <td>{invoice.vendor_name}</td>
                    <td>{invoice.description}</td>
                    <td>{formatDate(invoice.due_date)}</td>
                    <td>{invoice.amount}</td>
                    <td>{formatStatus(invoice.paid)}</td>
                    <td>
                      <button onClick={() => setSelectedInvoice(invoice)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={handleNextPage} disabled={invoices.length < limit}>
              Next
            </button>
            <input
              type="number"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Jump to page"
              style={{ marginLeft: '10px', width: '100px' }}
            />
            <button onClick={handleJumpToPage}>
              Go
            </button>
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}></div>
          <div className="modal">
            <h2>Invoice Details</h2>
            <p>Date: {getTodayDate()}</p>
            <p>Payee: {selectedInvoice.vendor_name}</p>
            <p>Description: {selectedInvoice.description}</p>
            <p>Due Date: {formatDate(selectedInvoice.due_date)}</p>
            <p>Amount: {selectedInvoice.amount}</p>
            <p>Status: {formatStatus(selectedInvoice.paid)}</p>
            <button onClick={() => setSelectedInvoice(null)}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Invoices;
