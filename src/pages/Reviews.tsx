import Link from "next/link";

const NOTES = [
  {
    id: "1",
    name: "Marcus T.",
    text: "Mobile oil change in my driveway before work. Clean, on time, done.",
  },
  {
    id: "2",
    name: "Dana K.",
    text: "Shop found a misfire two other places missed. Explained it like a person.",
  },
  {
    id: "3",
    name: "Luis R.",
    text: "Dead battery at the office — van was there fast. Worth it.",
  },
];

const Reviews = () => {
  return (
    <div className="pt-page pt-reviews">
      <header className="pt-page-head">
        <p className="pt-kicker">Reviews</p>
        <h1>From the lot</h1>
        <p>Short notes from the bay and the driveway.</p>
      </header>

      <div className="pt-quotes">
        {NOTES.map((n) => (
          <blockquote key={n.id}>
            <p>“{n.text}”</p>
            <cite>{n.name}</cite>
          </blockquote>
        ))}
      </div>

      <div className="pt-page-foot">
        <p>Your turn.</p>
        <Link href="/book" className="pt-btn">
          Book now
        </Link>
      </div>
    </div>
  );
};

export default Reviews;
