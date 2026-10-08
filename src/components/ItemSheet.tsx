import { useEffect, useState } from 'react';
import type { MenuItem } from '../data/menu';
import { money, unitPriceFor } from '../lib/pricing';
import { useApp } from '../state/AppState';
import ProductArt from './ProductArt';

interface Props {
  item: MenuItem;
  onClose: () => void;
}

export default function ItemSheet({ item, onClose }: Props) {
  const { dispatch } = useApp();
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries((item.options ?? []).map((g) => [g.id, g.default])),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const unit = unitPriceFor(item.id, options);
  const summary = (item.options ?? [])
    .map((g) => g.choices.find((c) => c.id === options[g.id])?.label)
    .join(' · ');

  const add = () => {
    dispatch({ type: 'add', line: { itemId: item.id, qty, options, unitPrice: unit } });
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-art">
          <ProductArt id={item.id} size={200} />
          <button className="sheet-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="sheet-body">
          <h2 id="sheet-title">{item.name}</h2>
          {item.tags && (
            <div className="tags">
              {item.tags.map((t) => (
                <em key={t}>{t}</em>
              ))}
            </div>
          )}
          <p className="sheet-desc">{item.description}</p>

          {(item.options ?? []).map((group) => (
            <fieldset key={group.id} className="option-group">
              <legend>{group.label}</legend>
              <div className="chips">
                {group.choices.map((c) => (
                  <label key={c.id} className={`chip ${options[group.id] === c.id ? 'on' : ''}`}>
                    <input
                      type="radio"
                      name={group.id}
                      value={c.id}
                      checked={options[group.id] === c.id}
                      onChange={() => setOptions({ ...options, [group.id]: c.id })}
                    />
                    {c.label}
                    {c.price ? <small> +{money(c.price)}</small> : null}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="sheet-bar">
          <div className="sheet-price">
            <strong>{money(unit * qty)}</strong>
            {summary && <span>{summary}</span>}
          </div>
          <div className="stepper" aria-label="Quantity">
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease" disabled={qty === 1}>
              −
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label="Increase">
              +
            </button>
          </div>
        </div>
        <div className="sheet-cta">
          <button className="btn primary block" onClick={add}>
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
