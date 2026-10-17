import type { GetServerSideProps } from "next";
import About from "../src/pages/About";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => ({
  props: { content: await getSiteContent(DEFAULT_CONTENT) },
});

export default function AboutPage({ content }: { content: SiteContent }) {
  return <About content={content} />;
}
