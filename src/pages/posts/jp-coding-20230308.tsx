import Post from "../../posts/jp-coding-20230308.mdx";
import MdxLayout from "../../layouts/mdxLayout";

export const meta = {
    slug: "jp-coding-20230308",
    title: "Webエンジニアはそろそろ日本語変数名の利用を検討してもいいのでは？",
    date: new Date('2023-03-08'),
    author: 'hedrall',
    image: "/images/typescript/logo.png",
    tags: ['typescript']
};

export default function ({ children }) {
    const Layout = MdxLayout(meta);
    return <Layout {...meta}><Post /></Layout>
};
