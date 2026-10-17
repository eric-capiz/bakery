import type { GetServerSideProps } from "next";
import Home from "../src/pages/Home";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

export default function IndexPage({ content }: { content: SiteContent }) {
  return <Home content={content} />;
}
