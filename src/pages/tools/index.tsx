import MdxLayout from '../../layouts/mdxLayout';
import Post from '../../assets/mdx/tools.mdx';
import React from 'react';

const Meta = {
  slug: 'index',
  title: 'Tool一覧',
  date: '2023-06-26',
  author: 'hedrall',
  image: '',
  tags: [],
};

export default function Page() {
  const Layout = MdxLayout(Meta);

  return (
    <Layout>
      <Post />
    </Layout>
  );
}
