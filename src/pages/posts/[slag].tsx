import { GetStaticPaths, GetStaticProps } from 'next';
import { listPostFileNames } from '../../lib/posts';
import { Post } from '../../posts/meta';
import React from 'react';
import MdxLayout from '../../layouts/mdxLayout';

export const getStaticPaths: GetStaticPaths = async () => {
  const fileNames = listPostFileNames();
  const slags = fileNames.map((i) => i.split('.').slice(0, -1).join('.'));
  return {
    paths: slags.map((slag) => {
      return {
        params: { slag },
      };
    }),
    fallback: false,
  };
};

type Props = {
  meta: Post.Meta;
  postFileName: Post.FileName;
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { slag } = params;
  const postFileName = `${slag}.mdx` as Post.FileName;

  return {
    props: {
      postFileName: postFileName,
      meta: Post.Meta[postFileName as any],
    },
  };
};

export default function Page(props: Props) {
  const { postFileName, meta } = props;

  const Layout = MdxLayout(meta);
  const PostComponent = Post.Components[postFileName];

  return (
    <Layout {...meta}>
      <PostComponent />
    </Layout>
  );
}
