import type { GetServerSideProps } from "next";
import Services from "../src/pages/Work";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

export default function ServicesPage({ content }: { content: SiteContent }) {
  return <Services content={content} />;
}
