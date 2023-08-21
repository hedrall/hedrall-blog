import axios from 'axios';
import assert from 'assert';
import { Qiita } from './type';
import { _Meta } from '../../../posts/meta/meta';
import fs from 'fs';
import path from 'path';
import { QiitaRegistry } from './registry/投稿済み管理';

const token = process.env.QIITA_TOKEN;
assert(token, '環境変数 QIITA_TOKEN が設定されていません。');

export const _upsert = async (_filename: string) => {
  // _filename = '2023-08-18-ts-module-and-namespace.mdx';
  const id = _filename.replace('.mdx', '');

  // 記事の情報を準備する
  const meta = _Meta[`${id}.mdx`];
  const body = fs.readFileSync(path.resolve(__dirname, `../../../posts/${id}.mdx`)).toString();
  console.log({
    meta,
    body: body.slice(0, 40),
  });

  // 本文に引用を追加する
  const modBody = `
  [自ブログ](https://blog.hedrall.work/posts/${id})からの引用です。
  
  ${body}
  `;

  // APIのリクエストぱらむ
  const postParams: Qiita.PostParams = {
    title: meta.title,
    body: modBody,
    tags: meta.tags.map((t) => ({ name: t })),
  };

  // APIをコールする
  const qiitaId = QiitaRegistry.getIdFromFilename(id);
  let apiUrl: string;
  let method: 'post' | 'patch';
  if (qiitaId) {
    // 更新
    console.log(`>>> 更新します id: ${qiitaId}`);
    apiUrl = `https://qiita.com/api/v2/items/${qiitaId}`;
    method = 'patch';
  } else {
    // 新規投稿
    console.log('>>> 新規作成します');
    apiUrl = 'https://qiita.com/api/v2/items';
    method = 'post';
  }

  // 結果を表示
  const res = await axios[method](apiUrl, postParams, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(res.data);

  // QiitaのItemIDを保存する
  QiitaRegistry.upsertPostedItem(res.data.id, id);
};
