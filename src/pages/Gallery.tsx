import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Piece {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

const PIECES: Piece[] = [
  {
    id: "1",
    name: "Night berry",
    description: "Wine dahlias, garden roses, and dark berries — held close.",
    image: "/img/brume/work/01.jpg",
    category: "Bridal bouquet",
  },
  {
    id: "2",
    name: "Apricot vow",
    description: "Peach and cream roses with soft greenery for the aisle.",
    image: "/img/brume/work/02.jpg",
    category: "Bridal bouquet",
  },
  {
    id: "3",
    name: "Ivory dusk",
    description: "White roses, eucalyptus, and cool textural accents.",
    image: "/img/brume/work/03.jpg",
    category: "Bridal bouquet",
  },
  {
    id: "4",
    name: "Garden hush",
    description: "A full bridal silhouette against soft white.",
    image: "/img/brume/work/04.jpg",
    category: "Bridal bouquet",
  },
  {
    id: "5",
    name: "Fig vessel",
    description: "Pink and white stems composed for the long table.",
    image: "/img/brume/work/05.jpg",
    category: "Table arrangement",
  },
  {
    id: "6",
    name: "Gathered rose",
    description: "A round hand-tied bouquet for guests and portraits.",
    image: "/img/brume/work/06.jpg",
    category: "Hand-tied bouquet",
  },
  {
    id: "7",
    name: "Copper study",
    description: "Peach roses with succulents — modern studio composition.",
    image: "/img/brume/work/07.jpg",
    category: "Studio bouquet",
  },
  {
    id: "8",
    name: "Altar white",
    description: "Intimate white blooms for vows and quiet rooms.",
    image: "/img/brume/work/08.jpg",
    category: "Ceremony bouquet",
  },
];

const Portfolio = () => {
  const [active, setActive] = useState<Piece | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const i = PIECES.findIndex((p) => p.id === active.id);
        setActive(
          e.key === "ArrowRight"
            ? PIECES[(i + 1) % PIECES.length]
            : PIECES[(i - 1 + PIECES.length) % PIECES.length]
        );
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <div className="br-portfolio">
      <header className="br-page-head">
        <p className="br-kicker">Portfolio</p>
        <h1>Bouquets &amp; arrangements</h1>
        <p>
          Finished pieces — bridal, table, and studio — photographed as they
          leave the workbench.
        </p>
      </header>

      <div className="br-folio">
        {PIECES.map((piece, i) => (
          <article
            key={piece.id}
            className={`br-folio-row ${i % 2 ? "is-flip" : ""}`}
          >
            <button
              type="button"
              className="br-folio-media"
              onClick={() => setActive(piece)}
              aria-label={`View ${piece.name}`}
            >
              <img src={piece.image} alt={piece.name} />
            </button>
            <div className="br-folio-copy">
              <span>{piece.category}</span>
              <h2>{piece.name}</h2>
              <p>{piece.description}</p>
              <button
                type="button"
                className="br-text-link"
                onClick={() => setActive(piece)}
              >
                View piece
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="br-page-foot">
        <p>Commission something in this spirit.</p>
        <Link href="/commission" className="br-btn">
          Commission
        </Link>
      </section>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="br-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
            onClick={() => setActive(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="br-lightbox-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                className="br-lightbox-close"
                onClick={() => setActive(null)}
              >
                Close
              </button>
              <img src={active.image} alt={active.name} />
              <div className="br-lightbox-meta">
                <span>{active.category}</span>
                <h2>{active.name}</h2>
                <p>{active.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
