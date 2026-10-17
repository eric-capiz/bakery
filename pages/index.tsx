import type { GetServerSideProps } from "next";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";
import Home from "../src/pages/Home";

export const getServerSideProps: GetServerSideProps = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

export default function IndexPage({ content }: { content: SiteContent }) {
  return <Home content={content} />;
}
