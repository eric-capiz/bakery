import Link from "next/link";

const NOTES = [
  {
    id: "1",
    name: "Clara & Jonah",
    text: "The bouquet felt inevitable — deep, quiet, and completely ours. Guests still ask who made it.",
  },
  {
    id: "2",
    name: "Simone R.",
    text: "No fuss, no theatrics. Just beautiful florals that held their composure all night.",
  },
  {
    id: "3",
    name: "The Harlow Dinner",
    text: "Tables looked designed, not decorated. Brume understood the room before we finished describing it.",
  },
];

const Praise = () => {
  return (
    <div className="br-page br-praise">
      <header className="br-page-head">
        <p className="br-kicker">Praise</p>
        <h1>Words from the evening</h1>
        <p>Notes from weddings and private dinners we dressed.</p>
      </header>

      <div className="br-praise-list">
        {NOTES.map((n) => (
          <blockquote key={n.id}>
            <p>“{n.text}”</p>
            <cite>{n.name}</cite>
          </blockquote>
        ))}
      </div>

      <div className="br-page-foot">
        <p>Begin a conversation for your date.</p>
        <Link href="/commission" className="br-btn">
          Commission
        </Link>
      </div>
    </div>
  );
};

export default Praise;
