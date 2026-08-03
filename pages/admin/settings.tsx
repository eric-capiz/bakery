import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminShell from '../../src/components/AdminShell';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    return <AdminShell title="Account Settings" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Account Settings"
      subtitle="Update your Clutch admin username and password."
    >
        <form onSubmit={handleSubmit} style={{ background: '#f4e8e5', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(139, 74, 58, 0.1)', border: '2px solid #e8cfd3' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="currentPassword" style={{ display: 'block', fontFamily: '"Outfit", "Avenir Next", sans-serif', fontSize: '1rem', fontWeight: '600', color: '#3f3034', marginBottom: '0.5rem' }}>
              Current Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1.25rem', border: '2px solid #dfb6bd', borderRadius: '12px', fontSize: '1rem', fontFamily: '"Outfit", "Avenir Next", sans-serif', color: '#3f3034', background: '#e9d6d2' }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3f3034',
                  fontSize: '1.1rem',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="newUsername" style={{ display: 'block', fontFamily: '"Outfit", "Avenir Next", sans-serif', fontSize: '1rem', fontWeight: '600', color: '#3f3034', marginBottom: '0.5rem' }}>
              New Username (leave blank to keep current)
            </label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={{ width: '100%', padding: '0.875rem 1.25rem', border: '2px solid #dfb6bd', borderRadius: '12px', fontSize: '1rem', fontFamily: '"Outfit", "Avenir Next", sans-serif', color: '#3f3034', background: '#e9d6d2' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="newPassword" style={{ display: 'block', fontFamily: '"Outfit", "Avenir Next", sans-serif', fontSize: '1rem', fontWeight: '600', color: '#3f3034', marginBottom: '0.5rem' }}>
              New Password (leave blank to keep current)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={4}
                style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1.25rem', border: '2px solid #dfb6bd', borderRadius: '12px', fontSize: '1rem', fontFamily: '"Outfit", "Avenir Next", sans-serif', color: '#3f3034', background: '#e9d6d2' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3f3034',
                  fontSize: '1.1rem',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {newPassword && (
              <p style={{ fontSize: '0.85rem', color: '#6d5c60', marginTop: '0.25rem' }}>
                Password must be at least 4 characters
              </p>
            )}
          </div>

          {newPassword && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontFamily: '"Outfit", "Avenir Next", sans-serif', fontSize: '1rem', fontWeight: '600', color: '#3f3034', marginBottom: '0.5rem' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1.25rem', border: '2px solid #dfb6bd', borderRadius: '12px', fontSize: '1rem', fontFamily: '"Outfit", "Avenir Next", sans-serif', color: '#3f3034', background: '#e9d6d2' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#3f3034',
                    fontSize: '1.1rem',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#e8cfd3', color: '#6d5c60', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid #dfb6bd', textAlign: 'center', fontFamily: '"Outfit", "Avenir Next", sans-serif', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid #81C784', textAlign: 'center', fontFamily: '"Outfit", "Avenir Next", sans-serif', fontSize: '0.95rem' }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              fontFamily: '"Outfit", "Avenir Next", sans-serif',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#f4e8e5',
              background: isLoading ? '#6d5c60' : '#b56f7c',
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
                e.currentTarget.style.background = '#b56f7c';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? 'Updating...' : 'Update Credentials'}
          </button>
        </form>
    </AdminShell>
  );
};

export default AdminSettings;

