import Link from "next/link";

const About = () => {
  return (
    <div className="pt-page pt-about">
      <header className="pt-page-head">
        <p className="pt-kicker">About</p>
        <h1>Built for the pit.</h1>
        <p>
          PIT runs a real bay and a mobile van — same honesty either place.
        </p>
      </header>

      <section className="pt-about-block">
        <img src="/img/pit/work/02.jpg" alt="Tools on the workbench" />
        <div>
          <p>
            We built PIT for people tired of waiting rooms and vague invoices.
            You get a clear diagnosis, a price before the work, and a text when
            it&apos;s ready.
          </p>
          <p>
            Shop for the jobs that need a lift. Mobile for the ones that
            shouldn&apos;t wreck your day.
          </p>
        </div>
      </section>

      <section className="pt-pillars">
        <article>
          <h2>01</h2>
          <p>Say it straight — if it can wait, we say so.</p>
        </article>
        <article>
          <h2>02</h2>
          <p>Post the price — shop and mobile, up front.</p>
        </article>
        <article>
          <h2>03</h2>
          <p>Show up — bay or driveway, on the time we book.</p>
        </article>
      </section>

      <div className="pt-page-foot">
        <p>Ready to get on the board?</p>
        <Link href="/book" className="pt-btn">
          Book now
        </Link>
      </div>
    </div>
  );
};

export default About;
