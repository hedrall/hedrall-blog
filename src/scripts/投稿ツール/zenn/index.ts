import * as child_process from 'child_process';
import { ExternalSiteSettings } from '../../../posts/meta/externalSiteSettings';
import { _Meta as Meta } from '../../../posts/meta/meta';
import { loadBody } from '../common';
import fs from 'fs';
import path from 'path';

type ZennMeta = {
  title: string;
  emoji: string;
  type: 'tech' | 'idea';
  topics: string[];
  published: boolean;
};
const main = async () => {
  /* do */
  const id = '2023-08-18-ts-module-and-namespace';
  const res = child_process.execSync('npx zenn list:articles').toString();
  const articles = res.split('\n').filter(Boolean);

  const isExist = articles.includes(id);

  const extSetting = ExternalSiteSettings[`${id}.mdx`];
  if (!extSetting) throw new Error('extSetting is not found');
  const { emoji } = extSetting;
  const { title, tags } = Meta[`${id}.mdx`];
  const zennMeta = {
    title,
    emoji,
    type: 'tech',
    topics: tags,
    publish: true,
  };

  const article = `---
title: "${zennMeta.title}"
emoji: "${zennMeta.emoji}"
type: "${zennMeta.type}"
topics: [${zennMeta.topics.map((t) => `"${t}"`).join(', ')}]
published: ${zennMeta.publish}
---

${loadBody(id)}
`;

  fs.writeFileSync(path.resolve(__dirname, `../../../../articles/${id}.md`), article);
};

(async () => {
  await main();
})().catch(console.error);
