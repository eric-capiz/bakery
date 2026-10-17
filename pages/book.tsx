import type { GetServerSideProps } from "next";
import Consultation from "../src/pages/Consultation";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => ({
  props: { content: await getSiteContent(DEFAULT_CONTENT) },
});

export default function BookPage({ content }: { content: SiteContent }) {
  return <Consultation content={content} />;
}
