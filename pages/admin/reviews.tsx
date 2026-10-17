import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../src/components/AdminShell";

interface Review {
  id: string;
  title: string;
  description: string;
  name: string | null;
  image: string | null;
  date: string;
}

const AdminReviews = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadReviews();
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

  const loadReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews/get");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setReviews(data);
      } else {
        setError("Failed to load reviews.");
      }
    } catch (err) {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (review: Review) => {
    if (!window.confirm(`Delete the review “${review.title}”?`)) return;
    setDeleting(review.id);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        `/api/reviews/delete?id=${encodeURIComponent(review.id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== review.id));
        setSuccess("Review deleted.");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to delete review.");
      }
    } catch (err) {
      setError("An error occurred while deleting.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString();
  };

  if (!mounted || isChecking) {
    return <AdminShell title="Reviews" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Reviews"
      subtitle="Client notes for the praise page. New notes arrive through the public form; remove anything that no longer belongs."
    >
      {error ? (
        <div className="admin-status admin-status--error" role="alert">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="admin-status admin-status--success" role="status">
          {success}
        </div>
      ) : null}

      {loading ? (
        <p style={{ color: "var(--admin-muted)", textAlign: "center" }}>
          Loading reviews…
        </p>
      ) : reviews.length === 0 ? (
        <div className="admin-card">
          <p className="admin-note">No reviews yet.</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div className="admin-review" key={review.id}>
            <div className="admin-review-body">
              <h3>{review.title}</h3>
              <p>{review.description}</p>
              <span className="admin-review-meta">
                {[review.name, formatDate(review.date)]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              {review.image ? (
                <img
                  className="admin-review-thumb"
                  src={`/img/reviews/${review.image}`}
                  alt=""
                />
              ) : null}
            </div>
            <div className="admin-review-actions">
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                disabled={deleting === review.id}
                onClick={() => deleteReview(review)}
              >
                {deleting === review.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ))
      )}
    </AdminShell>
  );
};

export default AdminReviews;
