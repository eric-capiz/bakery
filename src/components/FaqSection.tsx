import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import Toggle from "./Toggle";

interface FAQ {
  question: string;
  answer: string;
}

const FaqSection = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content/get");
        const data = await response.json();
        if (data.about?.faq && Array.isArray(data.about.faq)) {
          setFaqs(data.about.faq);
        } else {
          // Fallback to default FAQs
          setFaqs([
            { question: "How Long Does Delivery Take?", answer: "Delivery is available within 24hrs in most cases!" },
            { question: "What's Your Specialty?", answer: "I specialize in custom cakes for any occasion!" },
            { question: "What Forms Of Payment Do You Accept?", answer: "Cash, Venmo, Zelle, and Cash App." },
            { question: "Do You Deliver?", answer: "Yes! Delivery is available within a 25 mile radius." }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch FAQ content:", err);
        // Fallback to default FAQs
        setFaqs([
          { question: "How Long Does Delivery Take?", answer: "Delivery is available within 24hrs in most cases!" },
          { question: "What's Your Specialty?", answer: "I specialize in custom cakes for any occasion!" },
          { question: "What Forms Of Payment Do You Accept?", answer: "Cash, Venmo, Zelle, and Cash App." },
          { question: "Do You Deliver?", answer: "Yes! Delivery is available within a 25 mile radius." }
        ]);
      }
    };
    fetchContent();
  }, []);

  return (
    <div
      className={`faq ${inView ? "animate-in" : ""}`}
      ref={ref}
    >
      <h2>
        <span>FAQ</span>
      </h2>
      <div className="faq-grid">
        {faqs.map((faq, index) => (
          <Toggle key={index} title={faq.question}>
            <p>{faq.answer}</p>
          </Toggle>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
