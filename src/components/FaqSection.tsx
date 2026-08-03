import { useEffect, useState } from "react";
import Toggle from "./Toggle";

interface FAQ {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FAQ[] = [
  {
    question: "How far in advance should I book?",
    answer:
      "Weddings and large events are best booked 4–8 weeks ahead. Everyday bouquets can often be arranged within a few days.",
  },
  {
    question: "What's your specialty?",
    answer:
      "Seasonal, bespoke floral design, from intimate bouquets to full wedding and event installations.",
  },
  {
    question: "What forms of payment do you accept?",
    answer: "Cash, Venmo, Zelle, and major cards.",
  },
  {
    question: "Do you deliver?",
    answer:
      "Yes. Local delivery is available within a 25 mile radius, with studio pickup by arrangement.",
  },
];

const FaqSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content/get");
        const data = await response.json();
        if (data.about?.faq && Array.isArray(data.about.faq)) {
          setFaqs(data.about.faq);
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      } catch (err) {
        console.error("Failed to fetch FAQ content:", err);
        setFaqs(DEFAULT_FAQS);
      }
    };
    fetchContent();
  }, []);

  return (
    <section className="lx-faq">
      <p className="lx-eyebrow">Questions</p>
      <h2>FAQ</h2>
      <div className="lx-faq-list">
        {faqs.map((faq, index) => (
          <Toggle key={index} title={faq.question}>
            <p>{faq.answer}</p>
          </Toggle>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
