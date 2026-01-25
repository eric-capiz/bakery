import ServicesSection from "../components/ServicesSection";
import FaqSection from "../components/FaqSection";
import BakerSection from "../components/BakerSection";

const About = () => {
  return (
    <div className="about-page">
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
    </div>
  );
};

export default About;
