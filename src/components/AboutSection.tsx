import ServicesSection from "../components/ServicesSection";
import FaqSection from "../components/FaqSection";
import BakerSection from "../components/BakerSection";
import type { SiteContent } from "../../lib/content";

const About = ({ content }: { content: SiteContent }) => {
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
      <BakerSection about={content.about} />
      <ServicesSection features={content.features} />
      <FaqSection faq={content.faq} />
    </div>
  );
};

export default About;
