import Head from 'next/head';
import config from '../../lib/config';

type Props = {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  url: string;
};
export default function BasicMeta({ title, description, keywords, author, url }: Props) {
  return (
    <Head>
      <title>{title ? [title, config.site_title].join(' | ') : config.site_title}</title>
      <meta name="description" content={description ? description : config.site_description} />
      <meta name="keywords" content={keywords ? keywords.join(',') : config.site_keywords.map((it) => it.keyword).join(',')} />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      {author ? <meta name="author" content={author} /> : null}
      <link rel="canonical" href={config.base_url + url} />

      {/* Global site tag (gtag.js) - Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-KQWZ083Z2S"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
          
             gtag('config', 'G-KQWZ083Z2S');
          `,
        }}
      />
    </Head>
  );
}
