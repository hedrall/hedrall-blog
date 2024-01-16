import prompts from 'prompts';
import { ExternalSiteSettings } from '../externalSiteSetting';
import { _Meta as Meta } from '../../../posts/meta/meta';
import { QiitaTools } from './index';
import { Setting } from '../externalSiteSetting/type';

const main = async () => {
  const settings = Object.values(ExternalSiteSettings).filter((i) => Setting.isEnable(i)) as Setting.Enable<any>[];
  const { fileId } = await prompts({
    type: 'select',
    name: 'fileId',
    message: '投稿する記事のfileIdを選択してください',
    choices: settings.map(({ fileId }) => ({ title: fileId, value: fileId, description: Meta[`${fileId}.mdx`].title })),
  });

  const setting = ExternalSiteSettings[fileId];
  console.log({ fileId });
  console.table(setting);

  await QiitaTools.upsert(setting);
};

(async () => {
  await main();
})().catch(console.error);
