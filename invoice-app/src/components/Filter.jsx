import { useState } from 'react';

const OPTIONS = ['draft', 'pending', 'paid'];

export default function Filter({ selected, onChange }) {
  const [open, setOpen] = useState(false);

  function toggle(val) {
    if (selected.includes(val)) {
      onChange(selected.filter(s => s !== val));
    } else {
      onChange([...selected, val]);
    }
  }

  return (
    <div className="filter-dropdown">
      <button className="filter-btn" onClick={() => setOpen(o => !o)} aria-haspopup="true" aria-expanded={open}>
        Filter by status
        <span style={{ color: 'var(--accent)', marginLeft: 4 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="filter-menu" role="menu">
          {OPTIONS.map(opt => (
            <label key={opt} className="filter-option">
              <div className={`filter-checkbox ${selected.includes(opt) ? 'checked' : ''}`} />
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                style={{ display: 'none' }}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
