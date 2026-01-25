import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AdminPanel = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#8B4A3A', marginBottom: '2rem', textAlign: 'center' }}>
          Admin Panel
        </h1>
        <div style={{ textAlign: 'center', color: '#A85C4A', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Welcome to the admin panel. Use the options below to manage your site content and images.
          </p>
          <p style={{ fontSize: '0.95rem', color: '#8B4A3A', fontStyle: 'italic' }}>
            Need changes or features that aren't available here? Please contact the developer for assistance with additional updates or new feature requests.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px', margin: '0 auto 3rem' }}>
          <Link 
            href="/admin/images" 
            style={{ 
              background: '#E8A87C', 
              color: '#FFFFFF', 
              textDecoration: 'none', 
              fontSize: '1.1rem', 
              fontFamily: '"Space Grotesk", sans-serif',
              padding: '1rem 2rem',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(232, 168, 124, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#D97757';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#E8A87C';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Manage Images
          </Link>
          <Link 
            href="/admin/content" 
            style={{ 
              background: '#E8A87C', 
              color: '#FFFFFF', 
              textDecoration: 'none', 
              fontSize: '1.1rem', 
              fontFamily: '"Space Grotesk", sans-serif',
              padding: '1rem 2rem',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(232, 168, 124, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#D97757';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#E8A87C';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Manage Content
          </Link>
          <Link 
            href="/admin/settings" 
            style={{ 
              background: '#E8A87C', 
              color: '#FFFFFF', 
              textDecoration: 'none', 
              fontSize: '1.1rem', 
              fontFamily: '"Space Grotesk", sans-serif',
              padding: '1rem 2rem',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(232, 168, 124, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#D97757';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#E8A87C';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Update Username/Password
          </Link>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ color: '#E8A87C', textDecoration: 'none', fontSize: '1.1rem' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

