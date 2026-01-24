import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`nav-rich ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container-rich">
        <Link to="/" className="nav-logo-rich">
          <span className="logo-text-rich">Sweet Dreams Bakery</span>
        </Link>
        
        <button
          className={`mobile-menu-toggle-rich ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links-rich ${isMobileMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
              About
            </Link>
          </li>
          <li>
            <Link to="/sample-cakes" className={location.pathname === "/sample-cakes" ? "active" : ""}>
              Sample Cakes
            </Link>
          </li>
          <li>
            <Link to="/reviews" className={location.pathname === "/reviews" ? "active" : ""}>
              Reviews
            </Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
              Contact Me
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
