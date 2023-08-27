import { PostedItems } from './data';
import fs from 'fs';
import path from 'path';

export namespace QiitaRegistry {
  export const getIdFromFilename = (filename: string): string | undefined => {
    return PostedItems.find((item) => item.filename === filename)?.qiitaId;
  };

  export const upsertPostedItem = (qiitaId: string, filename: string) => {
    const index = PostedItems.findIndex((item) => item.qiitaId === qiitaId && item.filename === filename);
    if (index === -1) {
      // 未投稿
      PostedItems.push({ qiitaId, filename });
    } else {
      PostedItems[index] = { qiitaId, filename };
    }
    fs.writeFileSync(
      path.resolve(__dirname, './data.ts'),
      [
        '/* eslint-disable */',
        '// prettier-ignore',
        `export const PostedItems = ${JSON.stringify(PostedItems, null, 2)} satisfies { qiitaId: string, filename: string }[];`,
      ].join('\n'),
    );
  };
}
