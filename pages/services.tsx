import type { GetServerSideProps } from "next";
import Services from "../src/pages/Gallery";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => ({
  props: { content: await getSiteContent(DEFAULT_CONTENT) },
});

export default function ServicesPage({ content }: { content: SiteContent }) {
  return <Services content={content} />;
}
