import { useInView } from "react-intersection-observer";
import type { AboutContent } from "../../lib/content";

/**
 * Baker profile. Renders from the CMS `about` content (SSR prop).
 * The experience/education block is static studio copy — it is not part of
 * the CMS schema, so it stays hardcoded here.
 */
const BakerSection = ({ about }: { about: AboutContent }) => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const phoneHref = about.phone ? `tel:${about.phone.replace(/\D/g, "")}` : "tel:";

  return (
    <div ref={ref} className={`baker-section ${inView ? "animate-in" : ""}`}>
      <div className="baker-content">
        <div className="baker-info">
          <h2>Meet the Baker</h2>
          <p className="baker-intro">{about.intro}</p>

          <div className="baker-details">
            <div className="baker-section-item experience-section">
              <h3>👨‍🍳 Experience & Education</h3>
              <div className="experience-content">
                <p className="experience-main">
                  With over 8 years of professional baking experience, I've
                  dedicated my career to perfecting the art of custom cake
                  creation.
                </p>
                <div className="experience-details">
                  <div className="experience-item">
                    <span className="experience-label">Education:</span>
                    <span className="experience-value">
                      Culinary Institute of Pastry Arts, Certificate in Advanced
                      Baking &amp; Pastry
                    </span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Specialization:</span>
                    <span className="experience-value">
                      Custom Cake Design, Sugar Art, Fondant Work
                    </span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Years of Experience:</span>
                    <span className="experience-value">
                      8+ years professional, 15+ years total
                    </span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Certifications:</span>
                    <span className="experience-value">
                      ServSafe Certified, Advanced Cake Decorating Certification
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="baker-section-item items-section">
              <h3>🎂 What I Bake</h3>
              <div className="items-list">
                {about.highlights.map((item, index) => (
                  <span key={index} className="item-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="baker-section-item hours-section">
              <h3>🕐 Working Hours & Contact</h3>
              <div className="hours-list">
                {about.hours.map((entry, index) => (
                  <div className="hours-item" key={index}>
                    <span className="day">{entry.day}</span>
                    <span className="time">{entry.time}</span>
                  </div>
                ))}
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <a href={`mailto:${about.email}`} className="contact-value">
                    {about.email}
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <a href={phoneHref} className="contact-value">
                    {about.phone}
                  </a>
                </div>
                {about.address && (
                  <div className="contact-item">
                    <span className="contact-label">Location:</span>
                    <span className="contact-value contact-value-static">
                      {about.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BakerSection;
