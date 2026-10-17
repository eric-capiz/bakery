import Link from "next/link";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

interface PriceItem {
  name: string;
  price: string;
  note: string;
}

interface ServiceMeta {
  id: string;
  image: string;
  imageAlt: string;
  items: PriceItem[];
}

/** Editorial structure (images, anchors, price tables). Titles and purpose
 *  copy come from the CMS; these stay static so the design never breaks. */
const SERVICE_META: ServiceMeta[] = [
  {
    id: "grounds",
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
    image: "/img/ellis/work/05.jpg",
    imageAlt: "Vehicle after mobile detailing",
    items: [
      { name: "Hand wash", price: "from $45", note: "At your address" },
      { name: "Interior detail", price: "from $129", note: "SUV +$20" },
      { name: "Full detail", price: "from $219", note: "Wash, cabin, and wax" },
    ],
  },
];

type ServicesProps = {
  content?: SiteContent;
};

const Services = ({ content = DEFAULT_CONTENT }: ServicesProps) => {
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
        {SERVICE_META.map((meta, index) => {
          const item = content.services[index];
          const purpose = item
            ? item.description.split(/\n\s*\n/)[0]
            : "";
          return (
            <section
              key={meta.id}
              id={meta.id}
              className={`el-service-block${
                index % 2 === 1 ? " is-flip" : ""
              }`}
            >
              <div className="el-service-media">
                <img src={meta.image} alt={meta.imageAlt} />
              </div>
              <div className="el-service-copy">
                <p className="el-eyebrow">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2>{item ? item.title : ""}</h2>
                {purpose ? (
                  <p className="el-service-purpose">{purpose}</p>
                ) : null}
                <ul className="el-price-list">
                  {meta.items.map((price) => (
                    <li key={price.name}>
                      <div>
                        <span>{price.name}</span>
                        <small>{price.note}</small>
                      </div>
                      <strong>{price.price}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
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
