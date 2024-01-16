import * as fs from 'fs';
import * as path from 'path';
import filenames from '../posts/meta/_filename';
import meta from '../posts/meta/_meta';
import externalSetting from './投稿ツール/externalSiteSetting/_index';
import { input } from '@inquirer/prompts';
import { Post } from '../posts/meta';
import dayjs from 'dayjs';

// rootPath
const rootPath = path.resolve(__dirname, '../../');
const postsPath = path.resolve(rootPath, 'src/posts');
const filenamePath = path.resolve(postsPath, 'meta/_filename.ts');
const metaPath = path.resolve(postsPath, 'meta/_meta.ts');
const externalSettingPath = path.resolve(rootPath, 'src/scripts/投稿ツール/externalSiteSetting/_index.ts');

const main = async () => {
  const slug = await input({ message: 'slug (ファイル名の .mdx の前まで)' });
  const ファイル名 = `${slug}.mdx`;
  const newMetaItem = {
    slug,
    title: await input({ message: 'タイトル' }),
    date: dayjs().format('YYYY-MM-DD'),
    author: 'hedrall',
    image: '/images/typescript/logo.png',
    tags: (await input({ message: 'タグ (カンマ区切り)' })).split(','),
  };

  console.log('1. src/postsに空のmdxファイルを作成します。');
  const filePath = path.resolve(postsPath, ファイル名);
  fs.writeFileSync(filePath, '本文を書いてください。');
  console.log(`>>> ${filePath}`);
  console.log('');

  console.log('2. src/posts/meta/filenames.ts に追加する');
  fs.writeFileSync(
    filenamePath,
    [
      //
      '/* eslint-disable */',
      '// prettier-ignore',
      `export default ${JSON.stringify([ファイル名, ...filenames], null, 2)} as const;`,
    ].join('\n'),
  );
  console.log(`>>> ${filenamePath}`);
  console.log('');

  console.log('3. src/posts/meta/_meta.tsに追加する');
  fs.writeFileSync(
    metaPath,
    [
      //
      '/* eslint-disable */',
      '// prettier-ignore',
      `export default ${JSON.stringify({ [ファイル名]: newMetaItem, ...meta }, null, 2)} as const;`,
    ].join('\n'),
  );
  console.log(`>>> ${metaPath}`);
  console.log('');

  console.log('4. src/scripts/投稿ツール/externalSiteSetting/index.tsに追加する');
  const newExternalSettingItem = {
    fileId: slug,
    enable: true,
    zenn: {
      emoji: '',
      slug,
    },
    qiita: {
      id: '未投稿',
    },
  };
  fs.writeFileSync(
    externalSettingPath,
    [
      //
      '/* eslint-disable */',
      '// prettier-ignore',
      `export default ${JSON.stringify({ [slug]: newExternalSettingItem, ...externalSetting }, null, 2)} as const;`,
    ].join('\n'),
  );
  console.log(`>>> ${externalSettingPath}`);
  console.log('');

  console.log('<<<<<< 完了 >>>>>>');
  console.log(`${path.resolve(postsPath, 'meta/components.ts')} は手動で更新してください`);
  console.log('以下を追加する');
  const newComponent = `'${ファイル名}': dynamic(() => import('../${ファイル名}')),`;
  console.log(newComponent);
};

(async () => {
  await main();
})().catch(console.error);
