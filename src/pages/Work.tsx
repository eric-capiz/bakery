import Link from "next/link";

const SERVICES = [
  {
    id: "grounds",
    title: "Grounds",
    purpose: "Lawn and garden care so the property stays composed.",
    image: "/img/ellis/home/grounds.jpg",
    imageAlt: "Manicured lawn and garden beds",
    items: [
      { name: "Lawn cut & edge", price: "from $55", note: "Up to ¼ acre" },
      { name: "Bed cleanup & mulch", price: "from $180", note: "Priced by area" },
      { name: "Hedge shaping", price: "from $120", note: "By length" },
      { name: "Seasonal cleanup", price: "from $200", note: "Spring or fall" },
    ],
  },
  {
    id: "surface",
    title: "Exterior wash",
    purpose: "Pressure and soft washing for driveways, stone, and the house.",
    image: "/img/ellis/work/06.jpg",
    imageAlt: "Clean exterior surfaces after washing",
    items: [
      { name: "Driveway wash", price: "from $175", note: "Up to two-car pad" },
      { name: "Patio & stone", price: "from $150", note: "By size" },
      {
        name: "House soft wash",
        price: "from $350",
        note: "One-story starting rate",
      },
    ],
  },
  {
    id: "vehicle",
    title: "Mobile detailing",
    purpose:
      "We come to you for hand wash and interior detail in your driveway.",
    image: "/img/ellis/work/05.jpg",
    imageAlt: "Vehicle after mobile detailing",
    items: [
      { name: "Hand wash", price: "from $45", note: "At your address" },
      { name: "Interior detail", price: "from $129", note: "SUV +$20" },
      { name: "Full detail", price: "from $219", note: "Wash, cabin, and wax" },
    ],
  },
];

const Services = () => {
  return (
    <div className="el-page el-services">
      <header className="el-page-head">
        <p className="el-eyebrow">Services</p>
        <h1>What we do &amp; what it costs</h1>
        <p>
          Three kinds of care: grounds, exterior wash, and mobile detailing.
          Starting rates below; we confirm a final number before we begin.
        </p>
      </header>

      <div className="el-service-list">
        {SERVICES.map((service, index) => (
          <section
            key={service.id}
            id={service.id}
            className={`el-service-block${index % 2 === 1 ? " is-flip" : ""}`}
          >
            <div className="el-service-media">
              <img src={service.image} alt={service.imageAlt} />
            </div>
            <div className="el-service-copy">
              <p className="el-eyebrow">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2>{service.title}</h2>
              <p className="el-service-purpose">{service.purpose}</p>
              <ul className="el-price-list">
                {service.items.map((item) => (
                  <li key={item.name}>
                    <div>
                      <span>{item.name}</span>
                      <small>{item.note}</small>
                    </div>
                    <strong>{item.price}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <p className="el-services-note">
        Need more than one service on the same visit? Say so when you book. We
        can combine grounds, wash, and detailing in one appointment.
      </p>

      <div className="el-page-foot">
        <p>Ready to book a service?</p>
        <Link href="/book" className="el-btn">
          Reserve a visit
        </Link>
      </div>
    </div>
  );
};

export default Services;
