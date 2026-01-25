import { useInView } from "react-intersection-observer";
import Toggle from "./Toggle";

const FaqSection = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div
      className={`faq ${inView ? "animate-in" : ""}`}
      ref={ref}
    >
      <h2>
        <span>FAQ</span>
      </h2>
      <div className="faq-grid">
          <Toggle title="How Long Does Delivery Take?">
            <p>Delivery is available within 24hrs in most cases!</p>
          </Toggle>
          <Toggle title="What's Your Specialty?">
            <p>I specialize in custom cakes for any occasion!</p>
          </Toggle>
          <Toggle title="What Forms Of Payment Do You Accept?">
            <p>Cash, Venmo, Zelle, and Cash App.</p>
          </Toggle>
          <Toggle title="Do You Deliver?">
            <p>Yes! Delivery is available within a 25 mile radius.</p>
          </Toggle>
      </div>
    </div>
  );
};

export default FaqSection;
