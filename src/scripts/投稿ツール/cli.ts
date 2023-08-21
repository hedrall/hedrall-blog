import prompts from 'prompts';
import { ExternalSiteSettings } from '../../posts/meta/externalSiteSettings';
import { _Meta as Meta } from '../../posts/meta/meta';
import { QiitaTools } from './qiita';

const main = async () => {
  const 投稿可能な記事の一覧 = Object.entries(ExternalSiteSettings)
    .filter(([, value]) => {
      return value.enable;
    })
    .map(([key]) => key);
  const { 投稿する記事のfilename } = await prompts({
    type: 'select',
    name: '投稿する記事のfilename',
    message: '投稿する記事のfilenameを選択してください',
    choices: 投稿可能な記事の一覧.map((filename) => ({ title: filename, value: filename, description: Meta[filename].title })),
  });

  await QiitaTools.upsert(投稿する記事のfilename);

  console.log({ 投稿する記事のfilename });
};

(async () => {
  await main();
})().catch(console.error);
