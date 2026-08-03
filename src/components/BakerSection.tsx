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

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const BakerSection = () => {
  const [content, setContent] = useState<BakerContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content/get");
        const data = await response.json();
        if (data.about?.baker) setContent(data.about.baker);
      } catch (err) {
        console.error("Failed to fetch florist content:", err);
      }
    };
    fetchContent();
  }, []);

  const items = content?.whatIBake || [
    "Wedding Florals",
    "Bridal Bouquets",
    "Seasonal Arrangements",
    "Event Installations",
    "Centerpieces",
    "Editorial Styling",
    "Sympathy Tributes",
    "Subscription Blooms",
    "Workshop Experiences",
    "Private Consultations",
  ];

  return (
    <section className="lx-profile">
      <div className="lx-profile-intro">
        <p className="lx-eyebrow">Florist</p>
        <h2>A practice rooted in season and silhouette</h2>
        <p>
          {content?.intro ||
            "Hi, I'm the floral designer behind Liora Atelier. For over a decade I've composed botanical work for weddings, private homes, and editorial spaces, always guided by seasonality, restraint, and the quiet luxury of well-chosen stems."}
        </p>
      </div>

      <div className="lx-profile-grid">
        <div className="lx-profile-block">
          <h3>Experience</h3>
          <p>
            {content?.experience.main ||
              "With over 10 years of professional floral design experience, I've dedicated my practice to refined botanical composition for celebrations and everyday beauty."}
          </p>
          <dl>
            <div>
              <dt>Education</dt>
              <dd>
                {content?.experience.education ||
                  "Floral Design Institute, Advanced Botanical Composition Certificate"}
              </dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>
                {content?.experience.specialization ||
                  "Wedding Florals, Seasonal Arrangements, Event Installations"}
              </dd>
            </div>
            <div>
              <dt>Years</dt>
              <dd>
                {content?.experience.years ||
                  "10+ years professional floral design"}
              </dd>
            </div>
            <div>
              <dt>Credentials</dt>
              <dd>
                {content?.experience.certifications ||
                  "Certified Floral Designer, Sustainable Sourcing Practices"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="lx-profile-block">
          <h3>What I create</h3>
          <ul className="lx-profile-tags">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="lx-profile-block">
          <h3>Hours & contact</h3>
          <ul className="lx-profile-hours">
            {DAYS.map((day) => (
              <li key={day}>
                <span>{day}</span>
                <span>
                  {content?.hours[day] ||
                    (day === "sunday"
                      ? "Closed"
                      : day === "saturday"
                        ? "10:00 AM - 3:00 PM"
                        : "9:00 AM - 5:00 PM")}
                </span>
              </li>
            ))}
          </ul>
          <p className="lx-profile-contact">
            {content?.contact.email || "hello@lioraatelier.com"}
            <br />
            {content?.contact.phone || "(555) 014-8820"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BakerSection;
