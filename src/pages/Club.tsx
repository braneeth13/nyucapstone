import { useState } from 'react';
import { CLUB_BOX_DISCOUNT, PLANS, getPlan, type PlanId } from '../data/club';
import { money } from '../lib/pricing';
import { todayUsage, useApp } from '../state/AppState';

export default function Club() {
  const { state, dispatch } = useApp();
  const current = getPlan(state.plan);
  const [confirming, setConfirming] = useState<PlanId | null>(null);
  const usage = todayUsage(state);

  return (
    <div className="page">
      <div className="club-hero">
        <div className="eyebrow light">Nata Club</div>
        <h1>Your daily ritual, covered.</h1>
        <p>
          One flat monthly price for a drink every day. Order ahead in the app and walk straight to
          the counter.
        </p>
      </div>

      {current && (
        <section className="card member-status">
          <div className="eyebrow">You’re a member</div>
          <h2 className="h3">{current.name}</h2>
          <p className="muted small">
            Member since {new Date(state.memberSince!).toLocaleDateString()} · {money(current.price)}/mo
          </p>
          <div className="perk-row">
            <span className={usage.drink ? 'used' : ''}>☕ Daily drink {usage.drink ? 'used' : 'ready'}</span>
            {current.dailyNata && (
              <span className={usage.nata ? 'used' : ''}>🥧 Daily nata {usage.nata ? 'used' : 'ready'}</span>
            )}
          </div>
          <p className="muted small">Perks reset at midnight. They’re applied automatically at checkout.</p>
        </section>
      )}

      <div className="plans">
        {PLANS.map((plan) => {
          const active = plan.id === state.plan;
          return (
            <article key={plan.id} className={`plan ${active ? 'active' : ''} ${plan.dailyNata ? 'featured' : ''}`}>
              {plan.dailyNata && <div className="ribbon">Most loved</div>}
              <h2>{plan.name}</h2>
              <p className="muted">{plan.tagline}</p>
              <p className="price">
                ${plan.price}
                <span>/month</span>
              </p>
              <ul className="perks">
                {plan.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {active ? (
                <button className="btn block" disabled>
                  Current plan
                </button>
              ) : confirming === plan.id ? (
                <div className="confirm">
                  <p className="small">
                    Start {plan.name} at {money(plan.price)}/month? Cancel anytime. (Demo: no card is
                    charged.)
                  </p>
                  <div className="btn-row">
                    <button className="btn" onClick={() => setConfirming(null)}>
                      Not now
                    </button>
                    <button
                      className="btn primary"
                      onClick={() => {
                        dispatch({ type: 'joinPlan', plan: plan.id });
                        setConfirming(null);
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn primary block" onClick={() => setConfirming(plan.id)}>
                  {current ? `Switch to ${plan.name}` : `Join ${plan.name}`}
                </button>
              )}
            </article>
          );
        })}
      </div>

      <section className="card faq">
        <h2 className="h3">How it works</h2>
        <details>
          <summary>What counts as my daily drink?</summary>
          <p>
            Bica Club covers a bica or galão. Saudade Club covers any drink on the menu, seasonal
            specials included. Paid add-ons like oat milk are still charged.
          </p>
        </details>
        <details>
          <summary>Do unused days roll over?</summary>
          <p>No. Perks reset every day at midnight, New York time.</p>
        </details>
        <details>
          <summary>What about boxes?</summary>
          <p>All members get {CLUB_BOX_DISCOUNT * 100}% off boxes of 2 and 6, which is great for office runs.</p>
        </details>
        <details>
          <summary>Can I cancel?</summary>
          <p>Anytime, right here in the app. You keep your perks until the end of the billing month.</p>
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
    </div>
  );
}
