import { LayoutGroup } from "framer-motion";
import { useScroll } from "./useScroll";
import { scrollReveal } from "../animation";
import { m } from "framer-motion";
import Toggle from "./Toggle";

const FaqSection = () => {
  const [element, controls] = useScroll();

  return (
    <m.div
      className="faq"
      variants={scrollReveal}
      ref={element}
      animate={controls}
      initial="hidden"
    >
      <h2>
        <span>FAQ</span>
      </h2>
      <div className="faq-grid">
        <LayoutGroup>
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
        </LayoutGroup>
      </div>
    </m.div>
  );
};

export default FaqSection;
