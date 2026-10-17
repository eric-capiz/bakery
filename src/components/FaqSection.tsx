import { useInView } from "react-intersection-observer";
import Toggle from "./Toggle";
import type { FaqItem } from "../../lib/content";

/** FAQ accordion on the About page, rendered from CMS faq items. */
const FaqSection = ({ faq }: { faq: FaqItem[] }) => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div className={`faq ${inView ? "animate-in" : ""}`} ref={ref}>
      <h2>
        <span>FAQ</span>
      </h2>
      <div className="faq-grid">
        {faq.map((item, index) => (
          <Toggle key={index} title={item.question}>
            <p>{item.answer}</p>
          </Toggle>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
