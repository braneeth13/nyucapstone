import Azulejo from '../components/Azulejo';
import { HOURS, STORE, STORY } from '../data/store';
import { dayName, formatMinutes, nyParts, openStatus } from '../lib/hours';

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function Visit() {
  const now = new Date();
  const status = openStatus(now);
  const today = nyParts(now).weekday;

  return (
    <div className="page">
      <h1>Visit us</h1>

      <section className="card">
        <p className={`pill ${status.open ? 'open' : 'closed'}`}>{status.label}</p>
        <h2 className="h3">
          {STORE.address}
          <br />
          <span className="muted">{STORE.cityLine}</span>
        </h2>
        <p className="muted small">Greenwich Village, steps from Washington Square Park. Grab-and-go only.</p>
        <div className="btn-row">
          <a className="btn primary" href={STORE.mapsUrl} target="_blank" rel="noreferrer">
            Directions
          </a>
          <a className="btn" href={STORE.phoneHref}>
            Call
          </a>
        </div>
      </section>

      <section className="card">
        <h2 className="h3">Hours</h2>
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

      <Azulejo />

      <section className="story">
        <h2>Our story</h2>
        {STORY.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <section className="card social">
        <a href={STORE.instagram} target="_blank" rel="noreferrer">
          📸 @nata.nyc on Instagram
        </a>
        <a href={STORE.website} target="_blank" rel="noreferrer">
          🌐 nata.nyc
        </a>
      </section>
    </div>
  );
}
