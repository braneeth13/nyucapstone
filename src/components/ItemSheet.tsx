import { useEffect, useState } from 'react';
import type { MenuItem } from '../data/menu';
import { money, unitPriceFor } from '../lib/pricing';
import { useApp } from '../state/AppState';

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
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const unit = unitPriceFor(item.id, options);

  const add = () => {
    dispatch({ type: 'add', line: { itemId: item.id, qty, options, unitPrice: unit } });
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="sheet-hero">{item.emoji}</div>
        <h2 id="sheet-title">{item.name}</h2>
        <p className="muted">{item.description}</p>

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
                  {c.price ? ` +${money(c.price)}` : ''}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="sheet-footer">
          <div className="stepper" aria-label="Quantity">
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label="Increase">+</button>
          </div>
          <button className="btn primary grow" onClick={add}>
            Add · {money(unit * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}
