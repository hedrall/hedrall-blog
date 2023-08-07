import MdxLayout from '../../layouts/mdxLayout';
import Post from '../../assets/mdx/my-works.mdx';
import React from 'react';

const Meta = {
  slug: 'index',
  title: '活動実績一覧',
  date: '2023-06-10',
  author: 'hedrall',
  image: '/images/my-works/profile.jpeg',
  tags: ['front', 'infra'],
};

export default function Page() {
  const Layout = MdxLayout(Meta);

  return (
    <Layout>
      <Post />
    </Layout>
  );
}
