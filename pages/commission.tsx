import type { GetServerSideProps } from "next";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";
import Consultation from "../src/pages/Consultation";

export const getServerSideProps: GetServerSideProps = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

export default function CommissionPage({ content }: { content: SiteContent }) {
  return <Consultation content={content} />;
}
