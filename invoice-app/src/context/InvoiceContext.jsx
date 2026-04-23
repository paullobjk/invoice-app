import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InvoiceContext = createContext();

const SAMPLE_INVOICES = [
  {
    id: 'RT3080',
    createdAt: '2021-08-18',
    paymentDue: '2021-08-19',
    description: 'Re-branding',
    paymentTerms: 1,
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
    items: [{ name: 'Brand Guidelines', quantity: 1, price: 1800.90, total: 1800.90 }],
    total: 1800.90
  },
  {
    id: 'XM9141',
    createdAt: '2021-08-21',
    paymentDue: '2021-09-20',
    description: 'Graphic Design',
    paymentTerms: 30,
    clientName: 'Alex Grim',
    clientEmail: 'alexgrim@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
    items: [
      { name: 'Banner Design', quantity: 1, price: 156.00, total: 156.00 },
      { name: 'Email Design', quantity: 2, price: 200.00, total: 400.00 }
    ],
    total: 556.00
  },
  {
    id: 'RG0314',
    createdAt: '2021-09-24',
    paymentDue: '2021-10-01',
    description: 'Website Redesign',
    paymentTerms: 7,
    clientName: 'John Morrison',
    clientEmail: 'jm@myco.com',
    status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '79 Dover Road', city: 'Westhall', postCode: 'IP19 3PF', country: 'United Kingdom' },
    items: [{ name: 'Website Redesign', quantity: 1, price: 14002.33, total: 14002.33 }],
    total: 14002.33
  }
];

function invoiceReducer(state, action) {
  switch (action.type) {
    case 'SET': return action.invoices;
    case 'ADD': return [action.invoice, ...state];
    case 'UPDATE': return state.map(inv => inv.id === action.invoice.id ? action.invoice : inv);
    case 'DELETE': return state.filter(inv => inv.id !== action.id);
    case 'MARK_PAID': return state.map(inv => inv.id === action.id ? { ...inv, status: 'paid' } : inv);
    default: return state;
  }
}

export function InvoiceProvider({ children }) {
  const [invoices, dispatch] = useReducer(invoiceReducer, []);

  useEffect(() => {
    const stored = localStorage.getItem('invoices');
    if (stored) {
      dispatch({ type: 'SET', invoices: JSON.parse(stored) });
    } else {
      dispatch({ type: 'SET', invoices: SAMPLE_INVOICES });
    }
  }, []);

  useEffect(() => {
    if (invoices.length > 0 || localStorage.getItem('invoices')) {
      localStorage.setItem('invoices', JSON.stringify(invoices));
    }
  }, [invoices]);

  function generateId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * 26)] +
           letters[Math.floor(Math.random() * 26)] +
           String(Math.floor(Math.random() * 9000) + 1000);
  }

  function addInvoice(data, status = 'pending') {
    const total = data.items.reduce((sum, item) => sum + item.total, 0);
    const invoice = {
      ...data,
      id: generateId(),
      status,
      total,
      createdAt: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD', invoice });
    return invoice;
  }

  function updateInvoice(data) {
    const total = data.items.reduce((sum, item) => sum + item.total, 0);
    const invoice = { ...data, total };
    dispatch({ type: 'UPDATE', invoice });
  }

  function deleteInvoice(id) {
    dispatch({ type: 'DELETE', id });
  }

  function markAsPaid(id) {
    dispatch({ type: 'MARK_PAID', id });
  }

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  return useContext(InvoiceContext);
}
