import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminShell from '../../src/components/AdminShell';

interface BuildRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  design: unknown;
  status: string;
  createdAt: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function summarizeDesign(design: unknown): string {
  if (!design || typeof design !== 'object' || Array.isArray(design)) {
    return 'No design details';
  }
  const parts = Object.entries(design as Record<string, unknown>)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) =>
      typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
        ? `${k}: ${String(v)}`
        : k
    );
  return parts.length > 0 ? parts.join(' · ') : 'Design attached';
}

/** Admin bookings manager — lists cake build requests from the designer. */
const AdminBookings = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [requests, setRequests] = useState<BuildRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadRequests();
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

  const loadRequests = async () => {
    setError('');
    try {
      const response = await fetch('/api/build-requests/list');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load build requests:', err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || isChecking) {
    return <AdminShell title="Bookings" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Bookings"
      subtitle="Cake build requests sent through the visual designer on the Build page."
    >
      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#3f3034' }}>
          Loading bookings...
        </p>
      ) : requests.length === 0 ? (
        <div className="admin-card">
          <p>No cake build requests yet.</p>
        </div>
      ) : (
        <div className="admin-list">
          {requests.map((req) => (
            <article key={req.id} className="admin-card admin-list-item">
              <div className="admin-list-item-head">
                <div>
                  <h2>{req.name}</h2>
                  <p className="admin-list-meta">
                    {formatDate(req.createdAt)} · Status:{' '}
                    <span className="admin-status-pill">{req.status}</span>
                  </p>
                </div>
              </div>
              <dl className="admin-booking-fields">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${req.email}`}>{req.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${req.phone.replace(/\D/g, '')}`}>
                      {req.phone}
                    </a>
                  </dd>
                </div>
                {req.notes && (
                  <div>
                    <dt>Notes</dt>
                    <dd>{req.notes}</dd>
                  </div>
                )}
                <div>
                  <dt>Design</dt>
                  <dd>{summarizeDesign(req.design)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
};

export default AdminBookings;
