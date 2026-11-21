import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Pencil, Trash2, X, ChevronDown, Check, Search, Plus } from 'lucide-react';
import logo from '../assets/IDSCLogo.png';

export const LogoBadge = ({ size = 64, className = '' }) => (
  <img src={logo} alt="Infotech Development Systems Colleges logo" width={size} height={size} className={className} />
);

export const PageHeader = ({ title, subtitle, actionLabel, onAction }) => (
  <div className="page-head">
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-sub">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button className="btn btn--primary btn--lg" onClick={onAction}><Plus size={16} /> {actionLabel}</button>
    )}
  </div>
);

/** tone: green | amber | red | blue | gray */
export const Pill = ({ tone = 'green', dot = false, large = false, children }) => (
  <span className={`pill pill--${tone}${dot ? ' pill--dot' : ''}${large ? ' pill--lg' : ''}`}>{children}</span>
);

export const RowActions = ({ onView, onEdit, onDelete }) => (
  <div className="row-actions">
    {onEdit && <button className="icon-btn" aria-label="Edit" onClick={onEdit}><Pencil size={14} /></button>}
    {onView && <button className="icon-btn" aria-label="View" onClick={onView}><Eye size={14} /></button>}
    {onDelete && <button className="icon-btn icon-btn--danger" aria-label="Delete" onClick={onDelete}><Trash2 size={14} /></button>}
  </div>
);

/** columns: string | { label, align: 'center' } */
export const DataTable = ({ columns, rows, empty = 'Nothing here yet.' }) => {
  const cols = columns.map((c) => (typeof c === 'string' ? { label: c } : c));
  return (
    <div className="card table-card">
      <table className="table">
        <thead>
          <tr>{cols.map((c) => <th key={c.label} className={c.align === 'center' ? 'is-center' : ''}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td className="empty-cell" colSpan={cols.length}>{empty}</td></tr>}
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((cell, j) => <td key={j} data-label={cols[j].label} className={cols[j].align === 'center' ? 'is-center' : ''}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const StatCard = ({ icon: Icon, label, value, warn = false, row = false }) => (
  <div className={`card stat${row ? ' stat--row' : ''}`}>
    <span className={`stat__icon${warn ? ' stat__icon--warn' : ''}`}><Icon size={row ? 18 : 16} /></span>
    {row ? (
      <div className="stat__body"><p className="stat__label">{label}</p><p className="stat__value">{value}</p></div>
    ) : (
      <div><p className="stat__value">{value}</p><p className="stat__label">{label}</p></div>
    )}
  </div>
);

export const SearchField = ({ placeholder, value, onChange }) => (
  <label className="control control--search">
    <Search size={16} />
    <input className="control__input" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} aria-label={placeholder} />
  </label>
);

const normOption = (o) => (typeof o === 'string' ? { value: o, label: o } : o);

/**
 * Custom dropdown (replaces the native <select> so the list can be styled).
 * options: string[] | { value, label }[]   onChange(value)
 * variant: 'control' (filter bars) | 'field' (forms) | 'mini'
 */
export function Dropdown({ options, value, onChange, ariaLabel, labelledBy, variant = 'control', icon: Icon }) {
  const opts = options.map(normOption);
  const selectedIdx = Math.max(0, opts.findIndex((o) => o.value === value));
  const selected = opts[selectedIdx];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(selectedIdx);
  const [pos, setPos] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const id = useId();

  const measure = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    const width = Math.max(r.width, variant === 'mini' ? 90 : 0);
    const flip = window.innerHeight - r.bottom < 240 && r.top > window.innerHeight - r.bottom;
    setPos({
      left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)),
      width,
      ...(flip ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }),
    });
  };
  const openMenu = () => { setActive(selectedIdx); measure(); setOpen(true); };
  const choose = (i) => { onChange(opts[i].value); setOpen(false); triggerRef.current?.focus(); };

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!triggerRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) setOpen(false);
    };
    const onMove = (e) => { if (!menuRef.current?.contains(e.target)) measure(); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) menuRef.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const onKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openMenu(); }
      return;
    }
    const last = opts.length - 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(last, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(last); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); }
    else if (e.key === 'Tab') setOpen(false);
    else if (e.key.length === 1) {
      const ch = e.key.toLowerCase();
      for (let k = 1; k <= opts.length; k += 1) {
        const j = (active + k) % opts.length;
        if (opts[j].label.toLowerCase().startsWith(ch)) { setActive(j); break; }
      }
    }
  };

  const triggerClass = {
    control: 'control control--select dd__trigger',
    field: 'field__input field__input--plain dd__trigger',
    mini: 'dd__trigger dd__trigger--mini',
  }[variant];

  return (
    <>
      <button
        type="button" ref={triggerRef} className={triggerClass} role="combobox" aria-haspopup="listbox"
        aria-expanded={open} aria-controls={`${id}-menu`} aria-label={ariaLabel} aria-labelledby={labelledBy}
        aria-activedescendant={open ? `${id}-o${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())} onKeyDown={onKeyDown}
      >
        {Icon && <Icon size={16} />}
        <span className={`dd__value${selected.value === '' ? ' is-placeholder' : ''}`}>{selected.label}</span>
        <ChevronDown size={variant === 'mini' ? 12 : 16} className="dd__chev" />
      </button>
      {open && pos && createPortal(
        <ul ref={menuRef} id={`${id}-menu`} role="listbox" className="dd__menu" aria-label={ariaLabel}
          style={{ left: pos.left, top: pos.top, bottom: pos.bottom, width: pos.width }}>
          {opts.map((o, i) => (
            <li key={o.value} id={`${id}-o${i}`} role="option" aria-selected={o.value === value}
              className={`dd__option${i === active ? ' is-active' : ''}${o.value === value ? ' is-selected' : ''}`}
              onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActive(i)} onClick={() => choose(i)}>
              <span>{o.label}</span>
              {o.value === value && <Check size={14} className="dd__check" />}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </>
  );
}

/** Filter-bar dropdown. options: [{ value, label }] */
export const SelectField = ({ icon, label, value, onChange, options }) => (
  <Dropdown variant="control" icon={icon} ariaLabel={label} value={value} onChange={onChange} options={options} />
);

/** Form dropdown. Keeps the old event-style onChange so existing forms work unchanged. */
export const SelectInput = ({ label, options, error, className = '', value, onChange }) => {
  const id = useId();
  return (
    <div className={`field ${className}`}>
      <span className="field__label" id={`${id}-label`}>{label}</span>
      <Dropdown variant="field" labelledBy={`${id}-label`} value={value} options={options} onChange={(v) => onChange?.({ target: { value: v } })} />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};

export const TextInput = ({ label, icon: Icon, type = 'text', hint, error, className = '', ...props }) => {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <label className={`field ${className}`}>
      <span className="field__label">{label}</span>
      <span className="field__control">
        {Icon && <Icon size={20} strokeWidth={1.6} className="field__icon" />}
        <input className={`field__input${Icon ? '' : ' field__input--plain'}`} type={isPw && show ? 'text' : type} {...props} />
        {isPw && (
          <button type="button" className="field__toggle" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </span>
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
};

export const TextArea = ({ label, error, className = '', ...props }) => (
  <label className={`field ${className}`}>
    <span className="field__label">{label}</span>
    <textarea className="field__input field__input--plain" rows={3} {...props} />
    <span className={error ? 'field__error' : 'field__hint'}>{error || (props.maxLength ? `${String(props.value).length}/${props.maxLength}` : '')}</span>
  </label>
);

export const Toggle = ({ label, desc, checked, onChange }) => (
  <div className="toggle-row">
    <div><p className="toggle-row__title">{label}</p><p className="toggle-row__desc">{desc}</p></div>
    <button role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={onChange} />
  </div>
);

export const Modal = ({ title, onClose, size, children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal${size === 'lg' ? ' modal--lg' : ''}`}>
        <div className="modal__head">
          <h2>{title}</h2>
          <button className="modal__close" aria-label="Close" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

/** Delete confirmation. Pass `blocked` to show a reason with only a Close button. */
export const ConfirmDialog = ({ title, message, confirmLabel = 'Delete', blocked = false, onConfirm, onCancel }) => (
  <Modal title={title} onClose={onCancel}>
    <p className="confirm-text">{message}</p>
    <div className="modal__actions">
      <button className="btn btn--outline btn--lg" onClick={onCancel}>{blocked ? 'Close' : 'Cancel'}</button>
      {!blocked && <button className="btn btn--danger btn--lg" onClick={onConfirm}>{confirmLabel}</button>}
    </div>
  </Modal>
);

export const DetailList = ({ rows }) => (
  <dl className="detail-list">
    {rows.map(([label, value]) => (
      <div key={label} style={{ display: 'contents' }}><dt>{label}</dt><dd>{value || '—'}</dd></div>
    ))}
  </dl>
);

/** Search box state that follows the ?q= URL param (set by the topbar search). */
export const useUrlSearch = () => {
  const [params] = useSearchParams();
  const urlQ = params.get('q') || '';
  const [q, setQ] = useState(urlQ);
  useEffect(() => setQ(urlQ), [urlQ]);
  return [q, setQ];
};

export const AuthShell = ({ title, children, footerText, footerLink, footerLabel }) => (
  <div className="auth-page">
    <div className="auth-card">
      <LogoBadge size={64} className="auth-logo" />
      <h1 className="auth-title">{title}</h1>
      {children}
      <div className="auth-divider">or</div>
      <p className="auth-foot">{footerText} <Link to={footerLink} className="link link--underline">{footerLabel}</Link></p>
    </div>
  </div>
);