import type { GetServerSideProps } from 'next';
import { getSiteContent, type SiteContent } from '../lib/content';
import { DEFAULT_CONTENT } from '../lib/defaults';
import Contact from '../src/pages/Contact';

export const getServerSideProps: GetServerSideProps<{
  content: SiteContent;
}> = async () => {
  const content = await getSiteContent(DEFAULT_CONTENT);
  return { props: { content } };
};

const ContactPage = ({ content }: { content: SiteContent }) => (
  <Contact content={content} />
);

export default ContactPage;
