import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminShell from "../src/components/AdminShell";

const AdminPanel = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

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

  if (!mounted || isChecking) {
    return <AdminShell title="Admin Panel" loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminShell
      title="Admin Panel"
      subtitle="Manage Brume content, portfolio images, and account settings."
    >
      <div className="admin-card">
        <div className="admin-home-links">
          <Link href="/admin/images">Manage Images</Link>
          <Link href="/admin/content">Manage Content</Link>
          <Link href="/admin/settings">Update Credentials</Link>
        </div>
      </div>
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
