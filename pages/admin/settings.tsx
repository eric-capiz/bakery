import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AdminSettings = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if admin is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/');
        }
      } catch (err) {
        router.push('/');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match if new password is provided
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Check if at least one field is being updated
    if (!newUsername.trim() && !newPassword.trim()) {
      setError('Please provide a new username or password to update');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Credentials updated successfully!');
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
        
        // If username was updated, refresh auth
        if (data.usernameUpdated) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        setError(data.error || 'Failed to update credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || isChecking) {
    return (
      <div style={{ marginTop: '80px', padding: '4rem 2rem', minHeight: '90vh', background: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8B4A3A', fontSize: '1.2rem' }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-panel" style={{ marginTop: '80px', padding: '4rem 2rem', minHeight: '90vh', background: '#FFF8F0' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#8B4A3A', marginBottom: '1rem', textAlign: 'center' }}>
          Admin Settings
        </h1>
        <p style={{ textAlign: 'center', color: '#A85C4A', fontSize: '1rem', marginBottom: '3rem' }}>
          Update your username and/or password
        </p>

        <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #FFE5D9' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="currentPassword" style={{ display: 'block', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1rem', fontWeight: '600', color: '#8B4A3A', marginBottom: '0.5rem' }}>
              Current Password *
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.875rem 1.25rem', border: '2px solid #FFB89A', borderRadius: '12px', fontSize: '1rem', fontFamily: '"Inter", sans-serif', color: '#8B4A3A', background: '#FFF8F0' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="newUsername" style={{ display: 'block', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1rem', fontWeight: '600', color: '#8B4A3A', marginBottom: '0.5rem' }}>
              New Username (leave blank to keep current)
            </label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={{ width: '100%', padding: '0.875rem 1.25rem', border: '2px solid #FFB89A', borderRadius: '12px', fontSize: '1rem', fontFamily: '"Inter", sans-serif', color: '#8B4A3A', background: '#FFF8F0' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="newPassword" style={{ display: 'block', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1rem', fontWeight: '600', color: '#8B4A3A', marginBottom: '0.5rem' }}>
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={4}
              style={{ width: '100%', padding: '0.875rem 1.25rem', border: '2px solid #FFB89A', borderRadius: '12px', fontSize: '1rem', fontFamily: '"Inter", sans-serif', color: '#8B4A3A', background: '#FFF8F0' }}
            />
            {newPassword && (
              <p style={{ fontSize: '0.85rem', color: '#A85C4A', marginTop: '0.25rem' }}>
                Password must be at least 4 characters
              </p>
            )}
          </div>

          {newPassword && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1rem', fontWeight: '600', color: '#8B4A3A', marginBottom: '0.5rem' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '0.875rem 1.25rem', border: '2px solid #FFB89A', borderRadius: '12px', fontSize: '1rem', fontFamily: '"Inter", sans-serif', color: '#8B4A3A', background: '#FFF8F0' }}
              />
            </div>
          )}

          {error && (
            <div style={{ background: '#FFE5D9', color: '#A85C4A', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid #FFB89A', textAlign: 'center', fontFamily: '"Inter", sans-serif', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid #81C784', textAlign: 'center', fontFamily: '"Inter", sans-serif', fontSize: '0.95rem' }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#FFFFFF',
              background: isLoading ? '#A85C4A' : '#E8A87C',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(232, 168, 124, 0.3)',
              marginBottom: '1.5rem',
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#D97757';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#E8A87C';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? 'Updating...' : 'Update Credentials'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/admin" style={{ color: '#E8A87C', textDecoration: 'none', fontSize: '1.1rem', fontFamily: '"Space Grotesk", sans-serif' }}>
            ← Back to Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

