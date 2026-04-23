import { useState, useEffect } from 'react';

const EMPTY_ITEM = { name: '', quantity: 1, price: 0, total: 0 };

const EMPTY_FORM = {
  description: '',
  paymentTerms: 30,
  clientName: '',
  clientEmail: '',
  paymentDue: '',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [{ ...EMPTY_ITEM }],
};

function validateForm(form) {
  const errors = {};
  if (!form.clientName.trim()) errors.clientName = 'Required';
  if (!form.clientEmail.trim()) errors.clientEmail = 'Required';
  else if (!/\S+@\S+\.\S+/.test(form.clientEmail)) errors.clientEmail = 'Invalid email';
  if (!form.description.trim()) errors.description = 'Required';
  if (!form.paymentDue) errors.paymentDue = 'Required';
  if (!form.senderAddress.street.trim()) errors['sender.street'] = 'Required';
  if (!form.senderAddress.city.trim()) errors['sender.city'] = 'Required';
  if (!form.senderAddress.postCode.trim()) errors['sender.postCode'] = 'Required';
  if (!form.senderAddress.country.trim()) errors['sender.country'] = 'Required';
  if (!form.clientAddress.street.trim()) errors['client.street'] = 'Required';
  if (!form.clientAddress.city.trim()) errors['client.city'] = 'Required';
  if (!form.clientAddress.postCode.trim()) errors['client.postCode'] = 'Required';
  if (!form.clientAddress.country.trim()) errors['client.country'] = 'Required';
  if (form.items.length === 0) errors.items = 'Add at least one item';
  form.items.forEach((item, i) => {
    if (!item.name.trim()) errors[`item.${i}.name`] = 'Required';
    if (item.quantity <= 0) errors[`item.${i}.quantity`] = 'Must be > 0';
    if (item.price < 0) errors[`item.${i}.price`] = 'Must be ≥ 0';
  });
  return errors;
}

export default function InvoiceForm({ invoice, onSave, onSaveDraft, onCancel }) {
  const [form, setForm] = useState(invoice ? {
    ...invoice,
    senderAddress: { ...invoice.senderAddress },
    clientAddress: { ...invoice.clientAddress },
    items: invoice.items.map(i => ({ ...i })),
  } : { ...EMPTY_FORM, items: [{ ...EMPTY_ITEM }] });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function setAddress(type, field, value) {
    setForm(f => ({ ...f, [type]: { ...f[type], [field]: value } }));
  }

  function setItem(index, field, value) {
    setForm(f => {
      const items = f.items.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updated.total = Number(updated.quantity) * Number(updated.price);
        }
        return updated;
      });
      return { ...f, items };
    });
  }

  function addItem() {
    setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
  }

  function removeItem(index) {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== index) }));
  }

  function handleSave() {
    const errs = validateForm(form);
    setTouched(true);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSave(form);
  }

  function handleDraft() {
    onSaveDraft(form);
  }

  const fmt = n => `£${Number(n || 0).toFixed(2)}`;

  return (
    <>
      <div className="form-overlay" onClick={onCancel} />
      <div className="form-drawer" role="dialog" aria-modal="true" aria-label={invoice ? 'Edit Invoice' : 'New Invoice'}>
        <h2 className="form-title">
          {invoice ? <>Edit <span>#</span>{invoice.id}</> : 'New Invoice'}
        </h2>

        {touched && Object.keys(errors).length > 0 && (
          <div className="validation-summary">
            Please fix the errors below before saving.
          </div>
        )}

        {/* Bill From */}
        <p className="form-section-label">Bill From</p>
        <div className="form-field" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="sender-street">Street Address</label>
          <input id="sender-street" className="form-input" value={form.senderAddress.street}
            onChange={e => setAddress('senderAddress', 'street', e.target.value)} />
        </div>
        <div className="form-grid-3">
          <div className="form-field">
            <label htmlFor="sender-city">City</label>
            <input id="sender-city" className="form-input" value={form.senderAddress.city}
              onChange={e => setAddress('senderAddress', 'city', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="sender-post">Post Code</label>
            <input id="sender-post" className="form-input" value={form.senderAddress.postCode}
              onChange={e => setAddress('senderAddress', 'postCode', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="sender-country">Country</label>
            <input id="sender-country" className="form-input" value={form.senderAddress.country}
              onChange={e => setAddress('senderAddress', 'country', e.target.value)} />
          </div>
        </div>

        {/* Bill To */}
        <p className="form-section-label">Bill To</p>
        <div className={`form-field ${errors.clientName && touched ? 'error' : ''}`} style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="client-name">Client's Name</label>
          <input id="client-name" className="form-input" value={form.clientName}
            onChange={e => set('clientName', e.target.value)} />
          {errors.clientName && touched && <span className="error-msg">{errors.clientName}</span>}
        </div>
        <div className={`form-field ${errors.clientEmail && touched ? 'error' : ''}`} style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="client-email">Client's Email</label>
          <input id="client-email" type="email" className="form-input" value={form.clientEmail}
            onChange={e => set('clientEmail', e.target.value)} />
          {errors.clientEmail && touched && <span className="error-msg">{errors.clientEmail}</span>}
        </div>
        <div className="form-field" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="client-street">Street Address</label>
          <input id="client-street" className="form-input" value={form.clientAddress.street}
            onChange={e => setAddress('clientAddress', 'street', e.target.value)} />
        </div>
        <div className="form-grid-3">
          <div className="form-field">
            <label htmlFor="client-city">City</label>
            <input id="client-city" className="form-input" value={form.clientAddress.city}
              onChange={e => setAddress('clientAddress', 'city', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="client-post">Post Code</label>
            <input id="client-post" className="form-input" value={form.clientAddress.postCode}
              onChange={e => setAddress('clientAddress', 'postCode', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="client-country">Country</label>
            <input id="client-country" className="form-input" value={form.clientAddress.country}
              onChange={e => setAddress('clientAddress', 'country', e.target.value)} />
          </div>
        </div>

        {/* Invoice Details */}
        <p className="form-section-label">Invoice Details</p>
        <div className="form-grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className={`form-field ${errors.paymentDue && touched ? 'error' : ''}`}>
            <label htmlFor="invoice-date">Invoice Date</label>
            <input id="invoice-date" type="date" className="form-input" value={form.paymentDue}
              onChange={e => set('paymentDue', e.target.value)} />
            {errors.paymentDue && touched && <span className="error-msg">{errors.paymentDue}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="payment-terms">Payment Terms</label>
            <select id="payment-terms" className="form-input" value={form.paymentTerms}
              onChange={e => set('paymentTerms', Number(e.target.value))}>
              <option value={1}>Net 1 Day</option>
              <option value={7}>Net 7 Days</option>
              <option value={14}>Net 14 Days</option>
              <option value={30}>Net 30 Days</option>
            </select>
          </div>
        </div>
        <div className={`form-field ${errors.description && touched ? 'error' : ''}`} style={{ marginBottom: '2rem' }}>
          <label htmlFor="description">Project Description</label>
          <input id="description" className="form-input" value={form.description}
            onChange={e => set('description', e.target.value)} />
          {errors.description && touched && <span className="error-msg">{errors.description}</span>}
        </div>

        {/* Items */}
        <p className="form-section-label" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Item List</p>
        {errors.items && touched && <div className="error-msg" style={{ marginBottom: '1rem' }}>{errors.items}</div>}
        <table className="items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th style={{ textAlign: 'center' }}>Qty.</th>
              <th>Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, i) => (
              <tr key={i} className="item-row">
                <td>
                  <input className={`form-input ${errors[`item.${i}.name`] && touched ? 'error' : ''}`}
                    value={item.name} placeholder="Item name"
                    onChange={e => setItem(i, 'name', e.target.value)} />
                </td>
                <td>
                  <input className="form-input" type="number" min="1" value={item.quantity} style={{ textAlign: 'center' }}
                    onChange={e => setItem(i, 'quantity', e.target.value)} />
                </td>
                <td>
                  <input className="form-input" type="number" min="0" step="0.01" value={item.price}
                    onChange={e => setItem(i, 'price', e.target.value)} />
                </td>
                <td>
                  <span className="item-total">{fmt(item.total)}</span>
                </td>
                <td>
                  <button className="delete-item-btn" onClick={() => removeItem(i)} aria-label={`Remove item ${i + 1}`}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-item-btn" onClick={addItem}>+ Add New Item</button>

        {/* Actions */}
        <div className="form-actions">
          {!invoice && (
            <>
              <button className="btn btn-ghost" onClick={onCancel}>Discard</button>
              <button className="btn btn-dark" onClick={handleDraft}>Save as Draft</button>
              <button className="btn btn-primary" onClick={handleSave}>Save & Send</button>
            </>
          )}
          {invoice && (
            <>
              <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
