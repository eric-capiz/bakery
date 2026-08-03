import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const useViewportMode = () => {
  const [mode, setMode] = useState<"pending" | "mobile" | "desktop">("pending");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setMode(media.matches ? "mobile" : "desktop");
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return mode;
};

const SampleCakes = () => {
  const mode = useViewportMode();
  const isMobile = mode === "mobile";
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [focus, setFocus] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/images/get");
        const data = await response.json();
        if (data.galleryImages && Array.isArray(data.galleryImages)) {
          setGalleryImages(data.galleryImages);
        }
      } catch (err) {
        console.error("Failed to fetch gallery images:", err);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    if (!activeImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeImage]);

  const count = galleryImages.length;

  const orbit = useMemo(() => {
    if (count === 0) return [];
    const radius = 40;
    return galleryImages.map((_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      return {
        left: `${50 + Math.cos(angle) * radius}%`,
        top: `${50 + Math.sin(angle) * radius}%`,
      };
    });
  }, [galleryImages, count]);

  const featured = count > 0 ? galleryImages[focus] : null;

  return (
    <div className="sample-cakes">
      <header className="sample-cakes-header">
        <p className="sample-cakes-kicker">Sugar orbit</p>
        <h1>Sample Cakes</h1>
        <p className="sample-cakes-lead">
          {mode === "mobile"
            ? "Swipe through the studio collection."
            : "Every cake sits in the orbit at once. Choose any moon to bring it into the lens."}
        </p>
      </header>

      {loading || mode === "pending" ? (
        <p className="sample-cakes-status">Loading gallery...</p>
      ) : count === 0 ? (
        <p className="sample-cakes-status">
          No cakes available at the moment. Check back soon.
        </p>
      ) : isMobile ? (
        <div className="cake-mobile-carousel">
          <div className="cake-mobile-frame">
            <button
              type="button"
              onClick={() => setActiveImage(galleryImages[mobileIndex])}
              aria-label={`View sample cake ${mobileIndex + 1} larger`}
            >
              <img
                src={`/img/Cakes/${galleryImages[mobileIndex]}`}
                alt={`Custom cake ${mobileIndex + 1}`}
              />
            </button>
          </div>
          <div className="cake-mobile-controls">
            <button
              type="button"
              onClick={() =>
                setMobileIndex((i) => (i - 1 + count) % count)
              }
              aria-label="Previous"
            >
              ‹
            </button>
            <p>
              {mobileIndex + 1} / {count}
            </p>
            <button
              type="button"
              onClick={() => setMobileIndex((i) => (i + 1) % count)}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      ) : (
        <div className="sugar-orbit" aria-label="Sample cake constellation">
          <div className="sugar-orbit-ring" aria-hidden="true" />
          <div className="sugar-orbit-ring is-inner" aria-hidden="true" />

          <div className="sugar-lens">
            <button
              type="button"
              className="sugar-lens-stage"
              onClick={() => featured && setActiveImage(featured)}
              aria-label="View focused cake larger"
            >
              <img
                src={`/img/Cakes/${featured}`}
                alt={`Focused sample cake ${focus + 1}`}
              />
            </button>
            <p className="sugar-lens-meta">
              <span>{String(focus + 1).padStart(2, "0")}</span>
              <span>of {String(count).padStart(2, "0")}</span>
            </p>
          </div>

          <div className="sugar-orbit-spin">
            {galleryImages.map((imageName, i) => {
              const isFocus = i === focus;
              return (
                <button
                  type="button"
                  key={`${imageName}-${i}`}
                  className={`sugar-moon ${isFocus ? "is-focus" : ""}`}
                  style={orbit[i]}
                  onClick={() => setFocus(i)}
                  aria-label={`Focus cake ${i + 1}`}
                  aria-pressed={isFocus}
                >
                  <span className="sugar-moon-face">
                    <span className="sugar-moon-scale">
                      <img src={`/img/Cakes/${imageName}`} alt="" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!loading && count > 0 ? (
        <div className="sample-cakes-footer">
          <Link href="/contact">Book a consultation</Link>
        </div>
      ) : null}

      {activeImage ? (
        <div
          className="sample-cakes-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged cake image"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            className="sample-cakes-lightbox-close"
            onClick={() => setActiveImage(null)}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={`/img/Cakes/${activeImage}`}
            alt="Enlarged sample cake"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SampleCakes;
