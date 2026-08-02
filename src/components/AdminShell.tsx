import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  loading?: boolean;
};

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/images", label: "Images" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/settings", label: "Settings" },
];

const AdminShell = ({
  title,
  subtitle,
  children,
  loading = false,
}: AdminShellProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="admin-shell">
        <div className="admin-shell-loading">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-shell-inner">
        <header className="admin-shell-header">
          <div>
            <p className="admin-shell-kicker">Admin</p>
            <h1>{title}</h1>
            {subtitle ? <p className="admin-shell-subtitle">{subtitle}</p> : null}
          </div>
        </header>

        <nav className="admin-shell-nav" aria-label="Admin sections">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? router.pathname === "/admin"
                : router.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "is-active" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-shell-body">{children}</div>
      </div>
    </div>
  );
};

export default AdminShell;
