import axios from 'axios';
import assert from 'assert';
import { Qiita } from './type';
import { _Meta } from '../../../posts/meta/meta';
import { loadBody } from '../common';
import { Setting } from '../externalSiteSetting/type';
import { externalSiteUpdater } from '../externalSiteSetting/updater';
import { FileId } from '../../../posts/meta/filenames';

const token = process.env.QIITA_TOKEN;
assert(token, '環境変数 QIITA_TOKEN が設定されていません。');

export const _upsert = async <T extends FileId>(setting: Setting.Enable<T>) => {
  const {
    fileId,
    qiita: { id: qiitaId },
  } = setting;
  // 記事の情報を準備する
  const meta = _Meta[`${fileId}.mdx`];

  // APIのリクエストパラム
  const postParams: Qiita.PostParams = {
    title: meta.title,
    body: loadBody(fileId),
    tags: meta.tags.map((t) => ({ name: t })),
  };

  // APIをコールする
  let apiUrl: string;
  let method: 'post' | 'patch';
  if (qiitaId !== '未投稿') {
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

  console.log('>>> OK !!!');
  console.log(res.data.url);

  externalSiteUpdater(fileId, {
    type: 'qiita',
    id: res.data.id,
    url: res.data.url,
    updatedAt: res.data.updated_at,
  });
};
