import Link from "next/link";
import ConsultationForm from "../components/ConsultationForm";

const Commission = () => {
  return (
    <div className="br-page br-commission">
      <header className="br-page-head">
        <p className="br-kicker">Commission</p>
        <h1>Tell us the occasion</h1>
        <p>
          Share the date, setting, and mood. We reply with availability and a
          clear next step.
        </p>
      </header>

      <div className="br-commission-layout">
        <aside className="br-commission-aside">
          <img
            src="/img/brume/work/06.jpg"
            alt="Hand-tied bouquet by Brume"
          />
          <div>
            <h2>Studio contact</h2>
            <ul>
              <li>
                <span>Email</span>
                <strong>hello@brume.studio</strong>
              </li>
              <li>
                <span>Phone</span>
                <strong>(555) 014-3901</strong>
              </li>
              <li>
                <span>Visits</span>
                <strong>By appointment</strong>
              </li>
            </ul>
            <p>
              Prefer to browse first?{" "}
              <Link href="/portfolio">Open the portfolio</Link>.
            </p>
          </div>
        </aside>
        <div className="br-commission-form">
          <h2>Commission form</h2>
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
};

export default Commission;
