import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface BakerContent {
  intro: string;
  experience: {
    main: string;
    education: string;
    specialization: string;
    years: string;
    certifications: string;
  };
  whatIBake: string[];
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contact: {
    email: string;
    phone: string;
  };
}

const BakerSection = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const [content, setContent] = useState<BakerContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content/get");
        const data = await response.json();
        if (data.about?.baker) {
          setContent(data.about.baker);
        }
      } catch (err) {
        console.error("Failed to fetch baker content:", err);
      }
    };
    fetchContent();
  }, []);

  const items = content?.whatIBake || [
    "Custom Cakes",
    "Cupcakes",
    "Cookies",
    "Brownies",
    "Pies & Tarts",
    "Cheesecakes",
    "Birthday Cakes",
    "Wedding Cakes",
    "Anniversary Cakes",
    "Corporate Cakes"
  ];

  return (
    <div ref={ref} className={`baker-section ${inView ? "animate-in" : ""}`}>
      <div className="baker-content">
        <div className="baker-info">
          <h2>Meet the Baker</h2>
          <p className="baker-intro">
            {content?.intro || "Hi, I'm Eric! I've been passionate about baking since I was young, and I've been creating custom cakes professionally for over 8 years. What started as a childhood hobby has grown into a dedicated craft where I bring your sweetest dreams to life, one cake at a time."}
          </p>
          
          <div className="baker-details">
            <div className="baker-section-item experience-section">
              <h3>👨‍🍳 Experience & Education</h3>
              <div className="experience-content">
                <p className="experience-main">
                  {content?.experience.main || "With over 8 years of professional baking experience, I've dedicated my career to perfecting the art of custom cake creation."}
                </p>
                <div className="experience-details">
                  <div className="experience-item">
                    <span className="experience-label">Education:</span>
                    <span className="experience-value">{content?.experience.education || "Culinary Institute of Pastry Arts, Certificate in Advanced Baking & Pastry"}</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Specialization:</span>
                    <span className="experience-value">{content?.experience.specialization || "Custom Cake Design, Sugar Art, Fondant Work"}</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Years of Experience:</span>
                    <span className="experience-value">{content?.experience.years || "8+ years professional, 15+ years total"}</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Certifications:</span>
                    <span className="experience-value">{content?.experience.certifications || "ServSafe Certified, Advanced Cake Decorating Certification"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="baker-section-item items-section">
              <h3>🎂 What I Bake</h3>
              <div className="items-list">
                {items.map((item, index) => (
                  <span key={index} className="item-tag">{item}</span>
                ))}
              </div>
            </div>
            
            <div className="baker-section-item hours-section">
              <h3>🕐 Working Hours & Contact</h3>
              <div className="hours-list">
                <div className="hours-item">
                  <span className="day">Monday</span>
                  <span className="time">{content?.hours.monday || "9:00 AM - 6:00 PM"}</span>
                </div>
                <div className="hours-item">
                  <span className="day">Tuesday</span>
                  <span className="time">{content?.hours.tuesday || "9:00 AM - 6:00 PM"}</span>
                </div>
                <div className="hours-item">
                  <span className="day">Wednesday</span>
                  <span className="time">{content?.hours.wednesday || "9:00 AM - 6:00 PM"}</span>
                </div>
                <div className="hours-item">
                  <span className="day">Thursday</span>
                  <span className="time">{content?.hours.thursday || "9:00 AM - 6:00 PM"}</span>
                </div>
                <div className="hours-item">
                  <span className="day">Friday</span>
                  <span className="time">{content?.hours.friday || "9:00 AM - 6:00 PM"}</span>
                </div>
                <div className="hours-item">
                  <span className="day">Saturday</span>
                  <span className="time">{content?.hours.saturday || "10:00 AM - 4:00 PM"}</span>
                </div>
                <div className="hours-item">
                  <span className="day">Sunday</span>
                  <span className="time">{content?.hours.sunday || "Closed"}</span>
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <a href={`mailto:${content?.contact.email || "info@sweetdreamsbakery.com"}`} className="contact-value">
                    {content?.contact.email || "info@sweetdreamsbakery.com"}
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <a href={`tel:${content?.contact.phone?.replace(/\D/g, '') || "15551234567"}`} className="contact-value">
                    {content?.contact.phone || "(555) 123-4567"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BakerSection;

