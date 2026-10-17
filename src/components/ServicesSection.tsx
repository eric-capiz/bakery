import { useInView } from "react-intersection-observer";
import type { FeatureItem } from "../../lib/content";

/**
 * "High Quality Cakes" cards on the About page, rendered from CMS features.
 * The icon is the emoji chosen in the content editor.
 */
const ServicesSection = ({ features }: { features: FeatureItem[] }) => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div
      className={`about services ${inView ? "animate-in" : ""}`}
      ref={ref}
    >
      <div className="description">
        <h2>
          High <span>Quality </span>Cakes
        </h2>
        <div className="cards">
          {features.map((feature, index) => (
            <div className="card" key={index}>
              <div className="icon">
                <span
                  className="service-emoji-icon"
                  aria-hidden="true"
                  role="img"
                >
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
              </div>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
