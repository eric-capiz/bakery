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
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

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
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
        setError("Could not load reviews.");
      }
    })();
  }, [isAuthenticated]);

  const remove = async (id: string) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(
        `/api/reviews/delete?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      setReviews((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    } catch {
      setError("Could not delete the review. Try again.");
    } finally {
      setDeletingId(null);
    }
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
      subtitle="Published reviews from the reviews page. Deletions apply immediately."
    >
      {error ? <p className="admin-status admin-status--error">{error}</p> : null}

      {reviews === null ? (
        <div className="admin-card">
          <p>Loading reviews…</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="admin-card">
          <p className="admin-note">No reviews yet.</p>
        </div>
      ) : (
        <div className="admin-review-list">
          {reviews.map((review) => (
            <article key={review.id} className="admin-card admin-review">
              <div className="admin-review-top">
                <div>
                  <h2>{review.title}</h2>
                  <p className="admin-review-meta">
                    {review.name ? `${review.name} · ` : ""}
                    {review.date
                      ? new Date(review.date).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={() => remove(review.id)}
                  disabled={deletingId === review.id}
                >
                  {deletingId === review.id ? "Deleting…" : "Delete"}
                </button>
              </div>
              <p className="admin-review-text">“{review.description}”</p>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
};

export default AdminReviews;
