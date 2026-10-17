import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminShell from '../../src/components/AdminShell';

interface Review {
  id: string;
  title: string;
  description: string;
  name: string | null;
  image: string | null;
  date: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Admin review manager — list reviews with delete buttons. */
const AdminReviews = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadReviews();
        } else {
          router.push('/');
        }
      } catch {
        router.push('/');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadReviews = async () => {
    setError('');
    try {
      const response = await fetch('/api/reviews/get');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(`Delete review "${review.title}"? This cannot be undone.`)) {
      return;
    }
    setDeleting(review.id);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(
        `/api/reviews/delete?id=${encodeURIComponent(review.id)}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Delete failed');
      }
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      setSuccess('Review deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete review error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete review.');
    } finally {
      setDeleting(null);
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
      subtitle="Customer reviews shown on the site. Removing a review hides it immediately."
    >
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#3f3034' }}>
          Loading reviews...
        </p>
      ) : reviews.length === 0 ? (
        <div className="admin-card">
          <p>No reviews yet.</p>
        </div>
      ) : (
        <div className="admin-list">
          {reviews.map((review) => (
            <article key={review.id} className="admin-card admin-list-item">
              <div className="admin-list-item-head">
                <div>
                  <h2>{review.title}</h2>
                  <p className="admin-list-meta">
                    {review.name ? `By ${review.name} · ` : ''}
                    {formatDate(review.date)}
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-danger-btn"
                  onClick={() => handleDelete(review)}
                  disabled={deleting === review.id}
                >
                  {deleting === review.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <p className="admin-list-body">{review.description}</p>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
};

export default AdminReviews;
