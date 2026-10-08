import { useState } from 'react';
import PageTop from '../components/PageTop';
import ProductArt from '../components/ProductArt';
import { CLUB_BOX_DISCOUNT, PLANS, getPlan, type PlanId } from '../data/club';
import { todayUsage, useApp } from '../state/AppState';

export default function Club() {
  const { state, dispatch } = useApp();
  const current = getPlan(state.plan);
  const [choice, setChoice] = useState<PlanId>(state.plan ?? 'saudade');
  const [confirming, setConfirming] = useState(false);
  const usage = todayUsage(state);
  const chosen = getPlan(choice)!;

  return (
    <div className="page club-page">
      <PageTop title="Nata Club" />

      <section className="club-card">
        <div className="club-card-top">
          <span className="club-mark">
            nata<span>.</span> club
          </span>
          <span className="club-state">{current ? 'Active' : 'Not a member'}</span>
        </div>
        <div className="club-card-name">{current ? current.name : 'Your daily ritual, covered.'}</div>
        {current ? (
          <div className="club-perks-today">
            <span className={usage.drink ? 'used' : ''}>☕ Drink · {usage.drink ? 'used' : 'ready'}</span>
            {current.dailyNata && <span className={usage.nata ? 'used' : ''}>🥧 Nata · {usage.nata ? 'used' : 'ready'}</span>}
          </div>
        ) : (
          <p>One flat monthly price for a drink every day, applied automatically when you order ahead.</p>
        )}
        <span className="club-art">
          <ProductArt id="galao" size={120} />
        </span>
      </section>

      <h2 className="sec-title">{current ? 'Change plan' : 'Choose a plan'}</h2>
      <div className="plan-list" role="radiogroup">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            role="radio"
            aria-checked={choice === plan.id}
            className={`plan ${choice === plan.id ? 'on' : ''}`}
            onClick={() => {
              setChoice(plan.id);
              setConfirming(false);
            }}
          >
            <div className="plan-head">
              <strong>{plan.name}</strong>
              {plan.dailyNata && <em>Most loved</em>}
              <span className="plan-price">
                ${plan.price}
                <small>/mo</small>
              </span>
            </div>
            <span className="plan-tag">{plan.tagline}</span>
            <ul>
              {plan.perks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <section className="block faq">
        <details>
          <summary>What counts as my daily drink?</summary>
          <p>Bica Club covers a bica or galão. Saudade Club covers any drink, seasonal specials included. Paid add-ons like oat milk are still charged.</p>
        </details>
        <details>
          <summary>Do unused days roll over?</summary>
          <p>No. Perks reset every day at midnight, New York time.</p>
        </details>
        <details>
          <summary>What about boxes?</summary>
          <p>All members get {CLUB_BOX_DISCOUNT * 100}% off boxes of 2 and 6.</p>
        </details>
        <details>
          <summary>Can I cancel?</summary>
          <p>Anytime, right here. You keep your perks until the end of the billing month.</p>
        </details>
      </section>

      {current && (
        <button
          className="text-link danger"
          onClick={() => {
            if (window.confirm(`Cancel your ${current.name} membership?`)) dispatch({ type: 'cancelPlan' });
          }}
        >
          Cancel membership
        </button>
      )}

      {choice !== state.plan && (
        <div className="paybar above-tabs">
          {confirming ? (
            <>
              <div>
                <strong>${chosen.price}/mo</strong>
                <span>Demo, no card charged</span>
              </div>
              <button
                className="btn primary"
                onClick={() => {
                  dispatch({ type: 'joinPlan', plan: choice });
                  setConfirming(false);
                }}
              >
                Confirm
              </button>
            </>
          ) : (
            <>
              <div>
                <strong>{chosen.name}</strong>
                <span>${chosen.price}/month · cancel anytime</span>
              </div>
              <button className="btn primary" onClick={() => setConfirming(true)}>
                {current ? 'Switch' : 'Join now'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
