import type { GetServerSideProps } from 'next';
import { getSiteContent, type SiteContent } from '../lib/content';
import { DEFAULT_CONTENT } from '../lib/defaults';
import About from '../src/components/AboutSection';

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

const AboutPage = ({ content }: { content: SiteContent }) => (
  <About content={content} />
);

export default AboutPage;
