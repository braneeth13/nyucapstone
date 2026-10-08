import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Azulejo from '../components/Azulejo';
import PageTop from '../components/PageTop';
import ProductArt from '../components/ProductArt';
import { HOURS, STORE, STORY } from '../data/store';
import { dayName, formatMinutes, nyParts, openStatus } from '../lib/hours';

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function Visit() {
  const now = new Date();
  const status = openStatus(now);
  const today = nyParts(now).weekday;
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView();
  }, [hash]);

  return (
    <div className="page">
      <PageTop title="Store" back />

      <section className="block store-card">
        <div className="store-map" aria-hidden="true">
          <Azulejo />
          <span className="map-pin">
            <ProductArt id="nata" size={44} />
          </span>
        </div>
        <h2>Nata · Greenwich Village</h2>
        <p className="muted">
          {STORE.address}, {STORE.cityLine}
        </p>
        <span className={`status ${status.open ? 'ok' : 'off'}`}>{status.label}</span>
        <div className="btn-row">
          <a className="btn primary" href={STORE.mapsUrl} target="_blank" rel="noreferrer">
            Directions
          </a>
          <a className="btn" href={STORE.phoneHref}>
            Call
          </a>
        </div>
      </section>

      <section className="block">
        <h2 className="sec-title">Hours</h2>
        <table className="hours">
          <tbody>
            {ORDER.map((d) => (
              <tr key={d} className={d === today ? 'today' : ''}>
                <th scope="row">{dayName(d)}</th>
                <td>
                  {formatMinutes(HOURS[d].open)} – {formatMinutes(HOURS[d].close)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="block story" id="story">
        <h2 className="sec-title">Our story</h2>
        {STORY.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>
    </div>
  );
}
