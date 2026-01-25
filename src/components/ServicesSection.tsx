import { FaClock, FaMoneyBillWave, FaBirthdayCake, FaUserTie } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const ServicesSection = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const iconStyle = {
    fontSize: "1.5rem",
    color: "#2b737c",
  };

  return (
    <div
      className={`about services ${inView ? "animate-in" : ""}`}
      ref={ref}
    >
      <div className="description">
        <h2>
          High <span>Quality </span>Cakes
        </h2>
        <div className="cards">
          <div className="card">
            <div className="icon">
              <FaClock style={iconStyle} />
              <h3>Fast Service</h3>
            </div>
            <p>Within 24hrs in most cases!</p>
          </div>
          <div className="card">
            <div className="icon">
              <FaMoneyBillWave style={iconStyle} />
              <h3>Affordable</h3>
            </div>
            <p>Feel free to reach out for any promotional pricing/discounts!</p>
          </div>
          <div className="card">
            <div className="icon">
              <FaBirthdayCake style={iconStyle} />
              <h3>Custom Made</h3>
            </div>
            <p>Dream Big!</p>
          </div>
          <div className="card">
            <div className="icon">
              <FaUserTie style={iconStyle} />
              <h3>Professional Service</h3>
            </div>
            <p>
              I've been baking since I was young but professionally for eight
              years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
