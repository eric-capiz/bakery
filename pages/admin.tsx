import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminShell from "../src/components/AdminShell";

const NAV_CARDS = [
  {
    href: "/admin/content",
    title: "Content",
    description: "Edit every text on the site — hero, features, services, about, FAQ, notices, gallery, marquee.",
  },
  {
    href: "/admin/images",
    title: "Images",
    description: "Upload, replace, and organize hero and gallery images.",
  },
  {
    href: "/admin/reviews",
    title: "Reviews",
    description: "Read customer reviews and remove any that should not be shown.",
  },
  {
    href: "/admin/bookings",
    title: "Bookings",
    description: "Cake build requests sent through the visual designer.",
  },
  {
    href: "/admin/settings",
    title: "Settings",
    description: "Update the admin username and password.",
  },
];

/** Admin dashboard: section cards plus live review/booking counts. */
const AdminPanel = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadCounts();
        } else {
          router.push("/");
        }
      } catch {
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadCounts = async () => {
    try {
      const [reviewsRes, bookingsRes] = await Promise.all([
        fetch("/api/reviews/get"),
        fetch("/api/build-requests/list"),
      ]);
      if (reviewsRes.ok) {
        const reviews = await reviewsRes.json();
        setReviewCount(Array.isArray(reviews) ? reviews.length : 0);
      }
      if (bookingsRes.ok) {
        const bookings = await bookingsRes.json();
        setBookingCount(Array.isArray(bookings) ? bookings.length : 0);
      }
    } catch (err) {
      console.error("Failed to load dashboard counts:", err);
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
      subtitle="Manage site content, images, reviews, bookings, and account settings."
    >
      <div className="admin-stats-grid">
        <div className="admin-card admin-stat-card">
          <p className="admin-stat-number">{reviewCount ?? "—"}</p>
          <p className="admin-stat-label">Reviews</p>
          <Link href="/admin/reviews" className="admin-stat-link">
            Manage reviews
          </Link>
        </div>
        <div className="admin-card admin-stat-card">
          <p className="admin-stat-number">{bookingCount ?? "—"}</p>
          <p className="admin-stat-label">Cake build requests</p>
          <Link href="/admin/bookings" className="admin-stat-link">
            View bookings
          </Link>
        </div>
      </div>

      <nav className="admin-dash-grid" aria-label="Admin sections">
        {NAV_CARDS.map((card) => (
          <Link key={card.href} href={card.href} className="admin-dash-card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <span className="admin-dash-go" aria-hidden="true">
              Open →
            </span>
          </Link>
        ))}
      </nav>

      <div className="admin-card">
        <p className="admin-note">
          Need changes that are not available here? Contact the developer for
          additional updates or new feature requests.
        </p>
      </div>
    </AdminShell>
  );
};

export default AdminPanel;
