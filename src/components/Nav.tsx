import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminLogin from "./AdminLogin";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/practice", label: "Practice" },
  { href: "/praise", label: "Praise" },
  { href: "/commission", label: "Commission" },
];

const Nav = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/verify");
        const data = await res.json();
        setIsAdmin(!!data.authenticated);
      } catch {
        setIsAdmin(false);
      }
    })();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (router.isReady) setOpen(false);
  }, [router.isReady, router.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setIsAdmin(false);
    window.dispatchEvent(new Event("adminLogout"));
    router.push("/");
  };

  const isActive = (href: string) =>
    href === "/"
      ? router.pathname === "/"
      : router.pathname.startsWith(href);

  return (
    <>
      {showLogin ? (
        <AdminLogin
          onLogin={() => {
            setIsAdmin(true);
            window.dispatchEvent(new Event("adminLogin"));
          }}
          onClose={() => setShowLogin(false)}
        />
      ) : null}

      <header className={`br-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="br-nav-inner">
          <Link href="/" className="br-nav-brand">
            Brume
          </Link>

          <nav className="br-nav-links" aria-label="Primary">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? "is-active" : ""}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="br-nav-end">
            {!isAdmin ? (
              <button
                type="button"
                className="br-nav-admin"
                onClick={() => setShowLogin(true)}
              >
                Admin
              </button>
            ) : (
              <>
                <Link href="/admin" className="br-nav-admin">
                  Panel
                </Link>
                <button type="button" className="br-nav-admin" onClick={logout}>
                  Log out
                </button>
              </>
            )}
            <button
              type="button"
              className="br-nav-menu"
              aria-expanded={open}
              aria-controls="br-drawer"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="br-drawer"
          className="br-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="br-drawer-admin">
            {!isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setShowLogin(true);
                }}
              >
                Admin
              </button>
            ) : (
              <>
                <Link href="/admin" onClick={() => setOpen(false)}>
                  Panel
                </Link>
                <button type="button" onClick={logout}>
                  Log out
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            className="br-drawer-dismiss"
            onClick={() => setOpen(false)}
          >
            Close menu
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Nav;
