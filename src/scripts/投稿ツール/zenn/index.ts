import * as child_process from 'child_process';
import { ExternalSiteSettings } from '../../../posts/meta/externalSiteSettings';
import { _Meta as Meta } from '../../../posts/meta/meta';
import { loadBody } from '../common';
import fs from 'fs';
import path from 'path';
import { ZennPosted } from './posted';
import { FileId } from '../../../posts/meta/filenames';

type ZennMeta = {
  title: string;
  emoji: string;
  type: 'tech' | 'idea';
  topics: string[];
  published: boolean;
};
const build = async (fileId: FileId) => {
  /* do */
  const res = child_process.execSync('npx zenn list:articles').toString();

  // Meta情報
  const meta = Meta[`${fileId}.mdx`];

  // 過去に投稿済みのデータ
  const posted = ZennPosted.get(fileId);

  // 23/08/22以降 Gitで投稿を管理しているデータ
  const extSetting = ExternalSiteSettings[fileId];

  const zennMeta: ZennMeta = {
    title: meta.title,
    emoji: extSetting?.emoji || posted.emoji,
    type: 'tech',
    topics: meta.tags,
    published: true,
  };

  const article = `---
title: "${zennMeta.title}"
emoji: "${zennMeta.emoji}"
type: "${zennMeta.type}"
topics: [${zennMeta.topics.map((t) => `"${t}"`).join(', ')}]
published: ${zennMeta.published}
---

${loadBody(fileId)}
`;

  const zennArticleFileName = posted?.slug || fileId;

  fs.writeFileSync(path.resolve(__dirname, `../../../../articles/${zennArticleFileName}.md`), article);
};

(async () => {
  const fileIds = [...Object.values(ZennPosted.items).map((i) => i.fileId), ...Object.keys(ExternalSiteSettings)] as FileId[];
  for (const id of fileIds) {
    console.log(`>>> id: ${id}`);
    await build(id);
  }
})().catch(console.error);
