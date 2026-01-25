import { useEffect } from "react";
import { useRouter } from "next/router";

const ScrollTop = (): null => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      window.scroll({
        top: 0,
        left: 0,
      });
    }
  }, [router.isReady, router.pathname]);

  return null;
};

export default ScrollTop;
