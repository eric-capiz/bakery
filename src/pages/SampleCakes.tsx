import { Link } from "react-router-dom";
import cake7 from "../img/Cakes/cake7.jpg";
import cake11 from "../img/Cakes/cake11.jpg";
import cake4 from "../img/Cakes/cake4.jpg";
import { useEffect, useRef } from "react";

const SampleCakes = () => {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (galleryRef.current) {
        gsap.fromTo(galleryRef.current.querySelectorAll(".cake-card"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            scrollTrigger: {
              trigger: galleryRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            ease: "power2.out",
          }
        );
      }
    }
  }, []);

  return (
    <div className="sample-cakes">
      <div className="sample-cakes-header">
        <h2>Sample Cakes</h2>
        <p>Explore our collection of custom-made cakes</p>
        <p className="review-hint">Click any cake to view reviews</p>
      </div>
      <div ref={galleryRef} className="cakes-gallery">
        <Link to="/sample-cakes/cake1" className="cake-card">
          <div className="cake-image-wrapper">
            <img src={cake7} alt="Custom cake" />
          </div>
        </Link>
        <Link to="/sample-cakes/cake2" className="cake-card">
          <div className="cake-image-wrapper">
            <img src={cake11} alt="Custom cake" />
          </div>
        </Link>
        <Link to="/sample-cakes/cake3" className="cake-card">
          <div className="cake-image-wrapper">
            <img src={cake4} alt="Custom cake" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SampleCakes;
