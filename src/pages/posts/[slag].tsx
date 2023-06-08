import { GetStaticPaths, GetStaticProps } from 'next';
import { listPostFiles } from '../../lib/posts';

export const getStaticPaths: GetStaticPaths = async () => {
  const files = listPostFiles();
  const titles = files.map((i) => i.split('.md')[0]);
  return { paths: titles, fallback: false };
};

export const getStaticProps: GetStaticProps = async () => {};
