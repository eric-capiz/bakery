import Link from "next/link";

const About = () => {
  return (
    <div className="el-page el-about">
      <header className="el-page-head">
        <p className="el-eyebrow">About</p>
        <h1>A quieter standard</h1>
        <p>
          Ellis is an outdoor care studio for properties that prefer calm
          execution over spectacle.
        </p>
      </header>

      <section className="el-about-story">
        <img
          src="/img/ellis/work/04.jpg"
          alt="Residence with maintained grounds"
        />
        <div>
          <p>
            We built Ellis around a simple idea: the lawn, the stone, and the
            car should feel like one finished place, tended by people who notice
            the edges.
          </p>
          <p>
            Appointments are paced. Pricing is spoken plainly. The work leaves
            quietly.
          </p>
        </div>
      </section>

      <section className="el-principles">
        <article>
          <h2>Clarity</h2>
          <p>A range before we begin. No surprises after the visit.</p>
        </article>
        <article>
          <h2>Pace</h2>
          <p>
            We arrive when we say, and move through the property with care.
          </p>
        </article>
        <article>
          <h2>Finish</h2>
          <p>Blow-off, rinse, and a last look before we leave the curb.</p>
        </article>
      </section>

      <div className="el-page-foot">
        <p>Speak with Ellis.</p>
        <Link href="/book" className="el-btn">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default About;
