import { useInView } from "react-intersection-observer";
import Link from "next/link";
import cake1 from "../img/Cakes/cake1.jpg";

const Home = () => {
  const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: specialtiesRef, inView: specialtiesInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="home-rich">
      <section className="hero-rich">
        <div className="hero-wrapper-rich">
          <div className="hero-grid">
            <div className="hero-image-side">
              <div className="image-wrapper-rich">
                <img src={cake1} alt="Delicious custom cake" />
              </div>
            </div>
            <div className="hero-text-side">
              <h1 className="hero-title-rich">
                <span>The More</span>
                <span className="accent-word">Cake</span>
                <span>The Batter</span>
              </h1>
              <p className="hero-p-rich">
                Contact me for all your sweet tooth needs!
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className={`features-rich ${featuresInView ? "animate-in" : ""}`}>
        <div className="wrapper-rich">
          <h2 className="heading-rich">Why Choose Us</h2>
          <div className="features-grid-rich">
            <div className="feature-item">
              <div className="icon-rich">⚡</div>
              <h3>Fast Service</h3>
              <p>Within 24hrs in most cases!</p>
            </div>
            <div className="feature-item">
              <div className="icon-rich">💰</div>
              <h3>Affordable</h3>
              <p>Competitive pricing with promotional discounts available!</p>
            </div>
            <div className="feature-item">
              <div className="icon-rich">🎨</div>
              <h3>Custom Made</h3>
              <p>Dream big! We bring your vision to life.</p>
            </div>
            <div className="feature-item">
              <div className="icon-rich">👨‍🍳</div>
              <h3>Professional</h3>
              <p>8+ years of professional baking experience.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={specialtiesRef} className={`specialties-rich ${specialtiesInView ? "animate-in" : ""}`}>
        <div className="wrapper-rich">
          <h2 className="heading-rich">Our Specialties</h2>
          <div className="specialties-grid-rich">
            <div className="specialty-item">
              <h3>Birthday Cakes</h3>
              <p>Make every birthday unforgettable with our custom designs.</p>
            </div>
            <div className="specialty-item">
              <h3>Wedding Cakes</h3>
              <p>Elegant and delicious cakes for your special day.</p>
            </div>
            <div className="specialty-item">
              <h3>Anniversary Cakes</h3>
              <p>Celebrate your milestones with style.</p>
            </div>
            <div className="specialty-item">
              <h3>Corporate Events</h3>
              <p>Professional cakes for your business occasions.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={testimonialsRef} className={`testimonials-rich ${testimonialsInView ? "animate-in" : ""}`}>
        <div className="wrapper-rich">
          <h2 className="heading-rich">What Our Customers Say</h2>
          <div className="testimonials-grid-rich">
            <div className="testimonial-item">
              <p className="quote-rich">
                "Truly a masterpiece! The most fascinating looking cake I have seen."
              </p>
              <p className="author-rich">- Happy Customer</p>
            </div>
            <div className="testimonial-item">
              <p className="quote-rich">
                "Sweet Dreams Bakery cakes are always moist and taste sooooo goooood!"
              </p>
              <p className="author-rich">- Satisfied Client</p>
            </div>
            <div className="testimonial-item">
              <p className="quote-rich">
                "I was so shocked how this came out. Always the best looking cakes!"
              </p>
              <p className="author-rich">- Repeat Customer</p>
            </div>
          </div>
          <div className="testimonials-link-wrapper">
            <Link href="/reviews" className="testimonials-link">
              See More Reviews
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-rich">
        <div className="wrapper-rich">
          <div className="cta-content-rich">
            <h2>Ready to Order Your Perfect Cake?</h2>
            <p>Let's make your celebration unforgettable. Book a consultation today!</p>
            <Link href="/contact" className="btn-secondary">
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
