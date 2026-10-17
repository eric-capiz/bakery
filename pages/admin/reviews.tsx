import { useEffect, useState } from "react";
import AdminShell from "../../src/components/AdminShell";
import { useAdminAuth } from "../../src/components/useAdminAuth";

interface Review {
  id: string;
  title?: string;
  description: string;
  name: string | null;
  image?: string | null;
  date: string;
}

const AdminReviews = () => {
  const { ready, mounted, isChecking } = useAdminAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadError, setLoadError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const res = await fetch("/api/reviews/get");
        if (!res.ok) throw new Error("load failed");
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setLoadError("Could not load reviews. Try reloading.");
      }
    })();
  }, [ready]);

  const removeReview = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    setDeleting(id);
    setDeleteError("");
    try {
      const res = await fetch(`/api/reviews/delete?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setDeleteError("Delete failed — try again.");
    } finally {
      setDeleting(null);
    }
  };

  if (!mounted || isChecking) {
    return <AdminShell title="Reviews" loading />;
  }

  if (!ready) {
    return null;
  }

  return (
    <AdminShell
      title="Reviews"
      subtitle="Customer reviews from the site. Deleting one is permanent."
    >
      {loadError ? (
        <div className="admin-card">
          <p className="admin-note">{loadError}</p>
        </div>
      ) : null}
      {deleteError ? (
        <div className="admin-status admin-status--bad">{deleteError}</div>
      ) : null}

      {reviews.length === 0 && !loadError ? (
        <div className="admin-card">
          <p className="admin-note">No reviews yet.</p>
        </div>
      ) : null}

      <div className="admin-review-list">
        {reviews.map((r) => (
          <article key={r.id} className="admin-card admin-review">
            <div className="admin-review-top">
              <div>
                {r.title ? (
                  <h2 className="admin-review-title">{r.title}</h2>
                ) : null}
                <p className="admin-review-meta">
                  {r.name || "Anonymous"}
                  {r.date
                    ? ` · ${new Date(r.date).toLocaleDateString()}`
                    : null}
                </p>
              </div>
              <button
                type="button"
                className="admin-remove-btn"
                disabled={deleting === r.id}
                onClick={() => removeReview(r.id)}
              >
                {deleting === r.id ? "Deleting…" : "Delete"}
              </button>
            </div>
            <p className="admin-review-text">{r.description}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
};

export default AdminReviews;
