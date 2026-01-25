import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminLogin from "./AdminLogin";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in on mount
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
      setIsAdminLoggedIn(loggedIn);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsAdminLoggedIn(false);
    router.push("/");
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  const isActive = (path: string) => {
    if (!router.isReady) return false;
    return router.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setIsMobileMenuOpen(false);
    }
  }, [router.isReady, router.pathname]);

  return (
    <>
      {showLoginModal && (
        <AdminLogin
          onLogin={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      <nav className={`nav-rich ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-container-rich">
          <div className="admin-buttons-container">
            {!isAdminLoggedIn ? (
              <button
                className="admin-login-btn"
                onClick={() => setShowLoginModal(true)}
              >
                Admin Login
              </button>
            ) : (
              <>
                <Link href="/admin" className="admin-panel-btn">
                  Admin Panel
                </Link>
                <button className="admin-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
          <Link href="/" className="nav-logo-rich">
            <span className="logo-text-rich">Sweet Dreams Bakery</span>
          </Link>
          <div className="nav-right-container">
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
                <Link href="/about" className={isActive("/about") ? "active" : ""}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/sample-cakes" className={isActive("/sample-cakes") ? "active" : ""}>
                  Sample Cakes
                </Link>
              </li>
              <li>
                <Link href="/reviews" className={isActive("/reviews") ? "active" : ""}>
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className={isActive("/contact") ? "active" : ""}>
                  Contact Me
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
