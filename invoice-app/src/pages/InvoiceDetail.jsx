import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';
import InvoiceForm from '../components/InvoiceForm';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatAmount(n) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, deleteInvoice, markAsPaid, updateInvoice } = useInvoices();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Invoice not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  function handleDelete() {
    deleteInvoice(id);
    navigate('/');
  }

  function handleSave(data) {
    updateInvoice({ ...data, id, status: invoice.status });
    setShowEdit(false);
  }

  return (
    <>
      <button className="back-btn" onClick={() => navigate('/')}>
        <span className="back-arrow">‹</span> Go back
      </button>

      {/* Status bar */}
      <div className="card detail-header">
        <div className="detail-status-row">
          <span className="detail-status-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="detail-actions">
          {invoice.status !== 'paid' && (
            <button className="btn btn-ghost" onClick={() => setShowEdit(true)}>Edit</button>
          )}
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>Delete</button>
          {invoice.status === 'pending' && (
            <button className="btn btn-primary" onClick={() => markAsPaid(id)}>Mark as Paid</button>
          )}
          {invoice.status === 'draft' && (
            <button className="btn btn-primary" onClick={() => markAsPaid(id)}>Mark as Pending</button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="detail-body">

          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}><span style={{ color: 'var(--text-muted)' }}>#</span>{invoice.id}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{invoice.description}</div>
            </div>
            <div className="address-text" style={{ textAlign: 'right' }}>
              {invoice.senderAddress.street}<br />
              {invoice.senderAddress.city}<br />
              {invoice.senderAddress.postCode}<br />
              {invoice.senderAddress.country}
            </div>
          </div>

          {/* Grid */}
          <div className="detail-grid">
            <div>
              <div className="detail-label">Invoice Date</div>
              <div className="detail-value">{formatDate(invoice.createdAt)}</div>
              <div className="detail-label" style={{ marginTop: '2rem' }}>Payment Due</div>
              <div className="detail-value">{formatDate(invoice.paymentDue)}</div>
            </div>
            <div>
              <div className="detail-label">Bill To</div>
              <div className="detail-value">{invoice.clientName}</div>
              <div className="address-text" style={{ marginTop: 8 }}>
                {invoice.clientAddress.street}<br />
                {invoice.clientAddress.city}<br />
                {invoice.clientAddress.postCode}<br />
                {invoice.clientAddress.country}
              </div>
            </div>
            <div>
              <div className="detail-label">Sent To</div>
              <div className="detail-value">{invoice.clientEmail}</div>
            </div>
          </div>

          {/* Items */}
          <div className="items-summary">
            <div className="items-summary-header">
              <span>Item Name</span>
              <span style={{ textAlign: 'center' }}>QTY.</span>
              <span style={{ textAlign: 'right' }}>Price</span>
              <span style={{ textAlign: 'right' }}>Total</span>
            </div>
            {invoice.items.map((item, i) => (
              <div key={i} className="items-summary-row">
                <span className="item-name">{item.name}</span>
                <span className="item-qty-price" style={{ textAlign: 'center' }}>{item.quantity}</span>
                <span className="item-qty-price" style={{ textAlign: 'right' }}>{formatAmount(item.price)}</span>
                <span className="item-total">{formatAmount(item.total)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="total-bar">
            <span className="total-label">Amount Due</span>
            <span className="total-amount">{formatAmount(invoice.total)}</span>
          </div>

        </div>
      </div>

      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showEdit && (
        <InvoiceForm
          invoice={invoice}
          onSave={handleSave}
          onSaveDraft={() => {}}
          onCancel={() => setShowEdit(false)}
        />
      )}
    </>
  );
}
