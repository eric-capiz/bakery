import { m } from "framer-motion";
import { pageAnimation } from "../animation";
import ServicesSection from "../components/ServicesSection";
import FaqSection from "../components/FaqSection";
import BakerSection from "../components/BakerSection";

const About = () => {
  return (
    <m.div variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <div className="about-container">
        <h2>
          About <span>Sweet Dreams Bakery</span>
        </h2>
        <p>
          Bringing your sweet dreams to life with custom-made cakes for any
          occasion.
        </p>
      </div>
      <BakerSection />
      <ServicesSection />
      <FaqSection />
    </m.div>
  );
};

export default About;
