import Link from "next/link";
import ConsultationForm from "../components/ConsultationForm";

const Book = () => {
  return (
    <div className="el-page el-book">
      <header className="el-page-head">
        <p className="el-eyebrow">Contact</p>
        <h1>Arrange a visit</h1>
        <p>
          Tell us about the property and what you need. We respond with timing
          and a clear range.
        </p>
      </header>

      <div className="el-book-grid">
        <aside>
          <p className="el-eyebrow">Studio</p>
          <ul>
            <li>
              <span>Telephone</span>
              <strong>(555) 014-3390</strong>
            </li>
            <li>
              <span>Area</span>
              <strong>City &amp; nearby</strong>
            </li>
            <li>
              <span>Hours</span>
              <strong>Mon–Sat · 7–5</strong>
            </li>
          </ul>
          <p className="el-aside-note">
            Prefer to browse first?{" "}
            <Link href="/services">View services &amp; pricing</Link>
          </p>
        </aside>
        <div className="el-book-form">
          <h2>Request</h2>
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
};

export default Book;
