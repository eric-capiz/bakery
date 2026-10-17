import type { GetServerSideProps } from "next";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";
import About from "../src/pages/About";

export const getServerSideProps: GetServerSideProps = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

export default function AboutPage({ content }: { content: SiteContent }) {
  return <About content={content} />;
}
