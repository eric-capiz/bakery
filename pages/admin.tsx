import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminShell from "../src/components/AdminShell";

const AdminPanel = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/");
        }
      } catch (err) {
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const res = await fetch("/api/reviews/get");
        const data = await res.json();
        setReviewCount(Array.isArray(data) ? data.length : 0);
      } catch {
        setReviewCount(null);
      }
    })();
  }, [isAuthenticated]);

  if (!mounted || isChecking) {
    return <AdminShell title="Admin Panel" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Admin Panel"
      subtitle="Manage ELLIS site content, reviews, and account settings."
    >
      <div className="admin-dash-grid">
        <Link href="/admin/content" className="admin-dash-card">
          <span className="admin-dash-kicker">Content</span>
          <span className="admin-dash-title">Edit site copy</span>
          <span className="admin-dash-desc">
            Hero, services, about, hours, notice, and gallery images.
          </span>
        </Link>
        <Link href="/admin/reviews" className="admin-dash-card">
          <span className="admin-dash-kicker">Reviews</span>
          <span className="admin-dash-title">
            {reviewCount === null
              ? "Manage reviews"
              : `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}
          </span>
          <span className="admin-dash-desc">
            View published reviews and remove ones that do not fit.
          </span>
        </Link>
        <Link href="/admin/settings" className="admin-dash-card">
          <span className="admin-dash-kicker">Settings</span>
          <span className="admin-dash-title">Account</span>
          <span className="admin-dash-desc">
            Update the admin username and password.
          </span>
        </Link>
      </div>

      <div className="admin-card">
        <p className="admin-note">
          Visit requests submitted on the site are emailed directly to the
          studio via formsubmit — they are not stored in this panel, so there
          is no bookings inbox here.
        </p>
      </div>
    </AdminShell>
  );
};

export default AdminPanel;
