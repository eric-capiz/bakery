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
          loadReviewCount();
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

  const loadReviewCount = async () => {
    try {
      const res = await fetch("/api/reviews/get");
      const data = await res.json();
      setReviewCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setReviewCount(null);
    }
  };

  if (!mounted || isChecking) {
    return <AdminShell title="Admin Panel" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Admin Panel"
      subtitle="Manage Brume content, praise, and account settings."
    >
      <div className="admin-dash-grid">
        <Link href="/admin/content" className="admin-dash-card">
          <span className="admin-dash-kicker">Content</span>
          <h2>Site copy</h2>
          <p>
            Edit the hero, practice values, services, studio details, notice
            banner, and gallery.
          </p>
        </Link>

        <Link href="/admin/reviews" className="admin-dash-card">
          <span className="admin-dash-kicker">Praise</span>
          <h2>Reviews</h2>
          <p>Read and remove client notes shown on the praise page.</p>
          {reviewCount !== null ? (
            <span className="admin-dash-count">{reviewCount}</span>
          ) : null}
        </Link>

        <Link href="/admin/settings" className="admin-dash-card">
          <span className="admin-dash-kicker">Account</span>
          <h2>Settings</h2>
          <p>Update your admin username and password.</p>
        </Link>
      </div>

      <div className="admin-card">
        <p className="admin-note">
          Commissions arrive by email (via the external form), so there is no
          internal bookings list on this branch. Need changes that are not
          available here? Contact the developer for additional updates or new
          feature requests.
        </p>
      </div>
    </AdminShell>
  );
};

export default AdminPanel;
