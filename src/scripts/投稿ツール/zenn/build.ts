import { _Meta as Meta } from '../../../posts/meta/meta';
import { loadBody } from '../common';
import fs from 'fs';
import path from 'path';
import { Setting } from '../externalSiteSetting/type';

export type ZennMeta = {
  title: string;
  emoji: string;
  type: 'tech' | 'idea';
  topics: string[];
  published: boolean;
  publicationName?: string;
};

const filterBody = (body: string) => {
  const lines = body.split('\n');
  return lines
    .filter((line) => {
      return !line.includes('dangerouslySetInnerHTML');
    })
    .join('\n');
};
export const build = async (setting: Setting.Enable<any>) => {
  const { fileId } = setting;

  // Meta情報
  const meta = Meta[`${fileId}.mdx`];

  const zennMeta: ZennMeta = {
    title: meta.title,
    emoji: setting?.zenn?.emoji || '📝',
    type: 'tech',
    topics: meta.tags,
    published: true,
    publicationName: setting?.zenn?.publication_name,
  };

  const article = [
    '---',
    `title: "${zennMeta.title}"`,
    `emoji: "${zennMeta.emoji}"`,
    `type: "${zennMeta.type}"`,
    `topics: [${zennMeta.topics.map((t) => `"${t}"`).join(', ')}]`,
    `published: ${zennMeta.published}`,
    ...(zennMeta.publicationName ? [`publication_name: "${zennMeta.publicationName}"`] : []),
    '---',
    '',
    filterBody(loadBody(fileId)),
    '',
  ].join('\n');

  const zennArticleFileName = setting?.zenn.slug;
  fs.writeFileSync(path.resolve(__dirname, `../../../../articles/${zennArticleFileName}.md`), article);
};
