import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import Filter from '../components/Filter';
import InvoiceForm from '../components/InvoiceForm';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return `Due ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
}

function formatAmount(n) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);
}

export default function InvoiceList() {
  const { invoices, addInvoice } = useInvoices();
  const [filters, setFilters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const filtered = filters.length === 0
    ? invoices
    : invoices.filter(inv => filters.includes(inv.status));

  function handleSave(data) {
    addInvoice(data, 'pending');
    setShowForm(false);
  }

  function handleDraft(data) {
    addInvoice(data, 'draft');
    setShowForm(false);
  }

  const count = filtered.length;
  const countLabel = count === 0 ? 'No invoices' : `${count} invoice${count !== 1 ? 's' : ''}`;

  return (
    <>
      <div className="list-header">
        <div className="list-header-left">
          <h1>Invoices</h1>
          <p>{filters.length > 0 ? `${countLabel} (filtered)` : countLabel}</p>
        </div>
        <div className="list-header-right">
          <Filter selected={filters} onChange={setFilters} />
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <span style={{ marginRight: 8, fontSize: '1.2rem' }}>＋</span>
            New Invoice
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '4rem' }}>📋</div>
          <h2>Nothing here</h2>
          <p>
            {filters.length > 0
              ? 'No invoices match your current filter.'
              : 'Create an invoice by clicking the New Invoice button.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(inv => (
            <div
              key={inv.id}
              className="card invoice-item"
              onClick={() => navigate(`/invoice/${inv.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(`/invoice/${inv.id}`)}
              aria-label={`Invoice ${inv.id} for ${inv.clientName}`}
            >
              <div className="invoice-id"><span>#</span>{inv.id}</div>
              <div className="invoice-due">{formatDate(inv.paymentDue)}</div>
              <div className="invoice-client">{inv.clientName}</div>
              <div className="invoice-amount">{formatAmount(inv.total)}</div>
              <StatusBadge status={inv.status} />
              <div className="invoice-arrow">›</div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <InvoiceForm
          onSave={handleSave}
          onSaveDraft={handleDraft}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}
