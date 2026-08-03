import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminLogin from "./AdminLogin";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/book", label: "Contact" },
];

const Nav = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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

      <header className="el-nav">
        <div className="el-nav-inner">
          <Link href="/" className="el-nav-brand">
            Ellis
          </Link>

          <nav className="el-nav-links" aria-label="Primary">
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

          <div className="el-nav-end">
            {!isAdmin ? (
              <button
                type="button"
                className="el-nav-admin"
                onClick={() => setShowLogin(true)}
              >
                Admin
              </button>
            ) : (
              <>
                <Link href="/admin" className="el-nav-admin">
                  Panel
                </Link>
                <button type="button" className="el-nav-admin" onClick={logout}>
                  Log out
                </button>
              </>
            )}
            <button
              type="button"
              className="el-nav-menu"
              aria-expanded={open}
              aria-controls="el-drawer"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="el-drawer"
          className="el-drawer"
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
          <div className="el-drawer-admin">
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
        </div>
      ) : null}
    </>
  );
};

export default Nav;
