import prompts from 'prompts';
import { ExternalSiteSettings } from '../../../posts/meta/externalSiteSettings';
import { _Meta as Meta } from '../../../posts/meta/meta';
import { QiitaTools } from './index';
import { FileId } from '../../../posts/meta/filenames';

const main = async () => {
  const 投稿可能な記事の一覧 = Object.entries(ExternalSiteSettings)
    .filter(([, value]) => {
      return value.enable;
    })
    .map(([key]) => key) as FileId[];
  const { 投稿する記事のfileId } = await prompts({
    type: 'select',
    name: '投稿する記事のfileId',
    message: '投稿する記事のfileIdを選択してください',
    choices: 投稿可能な記事の一覧.map((fileId) => ({ title: fileId, value: fileId, description: Meta[`${fileId}.mdx`].title })),
  });

  console.log({ 投稿する記事のfileId });

  await QiitaTools.upsert(投稿する記事のfileId as FileId);
};

(async () => {
  await main();
})().catch(console.error);
