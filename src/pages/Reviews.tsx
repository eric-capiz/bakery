import Link from "next/link";

const NOTES = [
  {
    id: "1",
    name: "Amelia H.",
    text: "The grounds look composed every week: edges sharp, beds quiet. Exactly what we wanted.",
  },
  {
    id: "2",
    name: "Noah K.",
    text: "Driveway wash and a mobile detail the same morning. Discreet, on time, immaculate.",
  },
  {
    id: "3",
    name: "Grace L.",
    text: "Clear quote, careful work on the façade. The house feels lighter.",
  },
];

const Reviews = () => {
  return (
    <div className="el-page el-reviews">
      <header className="el-page-head">
        <p className="el-eyebrow">Reviews</p>
        <h1>Kind words</h1>
        <p>Notes from properties we tend.</p>
      </header>

      <div className="el-quotes">
        {NOTES.map((n) => (
          <blockquote key={n.id}>
            <p>“{n.text}”</p>
            <cite>{n.name}</cite>
          </blockquote>
        ))}
      </div>

      <div className="el-page-foot">
        <p>Your property next.</p>
        <Link href="/book" className="el-btn">
          Reserve
        </Link>
      </div>
    </div>
  );
};

export default Reviews;
