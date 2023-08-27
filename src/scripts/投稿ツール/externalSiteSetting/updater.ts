import { FileId } from '../../../posts/meta/filenames';
import { ExternalSiteSettings } from './index';
import * as prettier from 'prettier';
import fs from 'fs';
import path from 'path';

const code = (settings: any) => {
  let pre = 'export const ExternalSiteSettings: { [K in FileId]?: Setting<K> } | undefined = ';
  return prettier.format(pre + JSON.stringify(settings, null, 2), {
    parser: 'typescript',
    printWidth: 150,
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    endOfLine: 'lf',
  });
};
const template = (settings: any) =>
  '' +
  `/* eslint-disable */
// prettier-ignore
/**
 * このファイルは updater.ts により自動生成されています
 */
import { FileId } from '../../../posts/meta/filenames';
import { Setting } from './type';

/**
 * 他サイトへの投稿内容を設定する
 * 旧記事は足さない
 */
${code(settings)}; 
`;

// qiitaへ投稿後のパラメータ
type Qiita = {
  type: 'qiita';
  id: string;
  url: string;
  updatedAt: string;
};
type Params = Qiita;
export const externalSiteUpdater = async (id: FileId, params: Params) => {
  const setting = ExternalSiteSettings[id];

  if (!setting.enable) throw new Error('設定が無効です');

  if (params.type === 'qiita') {
    setting.qiita = {
      id: params.id,
      url: params.url,
      updatedAt: params.updatedAt,
    };
  }

  let newCode = template(ExternalSiteSettings);
  fs.writeFileSync(path.resolve(__dirname, './index.ts'), newCode);
};
