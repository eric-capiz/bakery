import Link from "next/link";
import ConsultationForm from "../components/ConsultationForm";

const Book = () => {
  return (
    <div className="pt-page pt-book">
      <header className="pt-page-head">
        <p className="pt-kicker">Book</p>
        <h1>Grab a slot</h1>
        <p>
          Shop or mobile, what&apos;s wrong, and when you need it. We confirm
          time and a range before we turn a wrench.
        </p>
      </header>

      <div className="pt-book-grid">
        <aside>
          <img src="/img/pit/work/03.jpg" alt="Service in progress" />
          <ul>
            <li>
              <span>Phone</span>
              <strong>(555) 014-4820</strong>
            </li>
            <li>
              <span>Shop</span>
              <strong>418 Ironworks Ave</strong>
            </li>
            <li>
              <span>Hours</span>
              <strong>Mon–Sat · 8–6</strong>
            </li>
          </ul>
          <p>
            Price list first? <Link href="/services">Services</Link>
          </p>
        </aside>
        <div className="pt-book-form">
          <h2>Request form</h2>
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
};

export default Book;
