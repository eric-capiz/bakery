import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AdminPanel = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if admin is logged in
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/');
      }
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="admin-panel" style={{ marginTop: '80px', padding: '4rem 2rem', minHeight: '90vh', background: '#FFF8F0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#8B4A3A', marginBottom: '2rem', textAlign: 'center' }}>
          Admin Panel
        </h1>
        <p style={{ textAlign: 'center', color: '#A85C4A', fontSize: '1.2rem', marginBottom: '3rem' }}>
          Welcome to the admin panel. Admin features coming soon.
        </p>
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

