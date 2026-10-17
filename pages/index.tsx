import type { GetServerSideProps } from 'next';
import { getSiteContent, type SiteContent } from '../lib/content';
import { DEFAULT_CONTENT } from '../lib/defaults';
import Home from '../src/pages/Home';

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

const IndexPage = ({ content }: { content: SiteContent }) => (
  <Home content={content} />
);

export default IndexPage;
