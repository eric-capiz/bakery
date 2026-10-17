import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "../src/components/AdminShell";
import { useAdminAuth } from "../src/components/useAdminAuth";

const AdminPanel = () => {
  const { ready, mounted, isChecking } = useAdminAuth();
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const res = await fetch("/api/reviews/get");
        const data = await res.json();
        setReviewCount(Array.isArray(data) ? data.length : 0);
      } catch {
        setReviewCount(null);
      }
    })();
  }, [ready]);

  if (!mounted || isChecking) {
    return <AdminShell title="Admin Panel" loading />;
  }

  if (!ready) {
    return null;
  }

  return (
    <AdminShell
      title="Shop office"
      subtitle="Pit site controls — content, reviews, and account settings."
    >
      <div className="admin-dash-grid">
        <Link href="/admin/content" className="admin-dash-card">
          <span className="admin-dash-kicker">Content</span>
          <strong>Site copy</strong>
          <span className="admin-dash-desc">
            Hero, services, about, hours, notice banner, and more.
          </span>
        </Link>
        <Link href="/admin/reviews" className="admin-dash-card">
          <span className="admin-dash-kicker">Reviews</span>
          <strong>
            Reviews
            {reviewCount !== null ? (
              <em className="admin-dash-count">{reviewCount}</em>
            ) : null}
          </strong>
          <span className="admin-dash-desc">
            Read and delete customer reviews.
          </span>
        </Link>
        <Link href="/admin/settings" className="admin-dash-card">
          <span className="admin-dash-kicker">Settings</span>
          <strong>Credentials</strong>
          <span className="admin-dash-desc">
            Update your admin username and password.
          </span>
        </Link>
      </div>
      <div className="admin-card">
        <p className="admin-note">
          Booking requests go straight to the shop email via the request
          form — there&apos;s no internal bookings inbox on this site.
        </p>
      </div>
    </AdminShell>
  );
};

export default AdminPanel;
