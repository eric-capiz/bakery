import { useEffect, useRef } from "react";

const BakerSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (sectionRef.current) {
        gsap.fromTo(sectionRef.current.querySelectorAll(".baker-section-item"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            ease: "power2.out",
          }
        );
      }
    }
  }, []);

  const items = [
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
    <div ref={sectionRef} className="baker-section">
      <div className="baker-content">
        <div className="baker-info">
          <h2>Meet the Baker</h2>
          <p className="baker-intro">
            Hi, I'm Eric! I've been passionate about baking since I was young, 
            and I've been creating custom cakes professionally for over 8 years. 
            What started as a childhood hobby has grown into a dedicated craft where 
            I bring your sweetest dreams to life, one cake at a time.
          </p>
          
          <div className="baker-details">
            <div className="baker-section-item experience-section">
              <h3>👨‍🍳 Experience & Education</h3>
              <div className="experience-content">
                <p className="experience-main">
                  With over 8 years of professional baking experience, I've dedicated my career to perfecting the art of custom cake creation.
                </p>
                <div className="experience-details">
                  <div className="experience-item">
                    <span className="experience-label">Education:</span>
                    <span className="experience-value">Culinary Institute of Pastry Arts, Certificate in Advanced Baking & Pastry</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Specialization:</span>
                    <span className="experience-value">Custom Cake Design, Sugar Art, Fondant Work</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Years of Experience:</span>
                    <span className="experience-value">8+ years professional, 15+ years total</span>
                  </div>
                  <div className="experience-item">
                    <span className="experience-label">Certifications:</span>
                    <span className="experience-value">ServSafe Certified, Advanced Cake Decorating Certification</span>
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
                  <span className="time">9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Tuesday</span>
                  <span className="time">9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Wednesday</span>
                  <span className="time">9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Thursday</span>
                  <span className="time">9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Friday</span>
                  <span className="time">9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Saturday</span>
                  <span className="time">10:00 AM - 4:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Sunday</span>
                  <span className="time">Closed</span>
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <a href="mailto:info@sweetdreamsbakery.com" className="contact-value">info@sweetdreamsbakery.com</a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <a href="tel:+15551234567" className="contact-value">(555) 123-4567</a>
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

