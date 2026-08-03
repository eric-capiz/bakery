import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "../src/components/Nav";
import ScrollTop from "../src/components/ScrollTop";
import SmoothScroll from "../src/components/SmoothScroll";
import "../src/styles/main.scss";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <div className="br-app">
      <SmoothScroll>
        <ScrollTop />
        <Nav />
        <AnimatePresence mode="wait">
          <motion.main
            key={router.asPath}
            className="br-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Component {...pageProps} />
          </motion.main>
        </AnimatePresence>
      </SmoothScroll>
    </div>
  );
}
