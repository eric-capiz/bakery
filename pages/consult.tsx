import type { GetServerSideProps } from "next";
import Consult from "../src/pages/Consult";
import { getSiteContent, type SiteContent } from "../lib/content";
import { DEFAULT_CONTENT } from "../lib/defaults";

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

export default function ConsultPage({ content }: { content: SiteContent }) {
  return <Consult content={content} />;
}
