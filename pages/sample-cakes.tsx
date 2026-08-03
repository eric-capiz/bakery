import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function Legacy() {
  const router = useRouter();
  useEffect(() => { router.replace('/gallery'); }, [router]);
  return null;
}
