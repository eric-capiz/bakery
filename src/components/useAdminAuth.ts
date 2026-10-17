import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Admin gate shared by all /admin pages.
 * Checks /api/auth/verify on mount; bounces unauthenticated users to "/".
 */
export function useAdminAuth() {
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
      } catch {
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  return {
    mounted,
    isAuthenticated,
    isChecking,
    ready: mounted && !isChecking && isAuthenticated,
  };
}
