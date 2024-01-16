import { ExternalSiteSettings } from '../externalSiteSetting';
import { build } from './build';
import { Setting } from '../externalSiteSetting/type';

/**
 * Zennへ投稿する記事をビルドする
 *
 *
 */
(async () => {
  const settings = Object.values(ExternalSiteSettings).filter(Setting.isEnable) as Setting.Enable<any>[];
  for (const setting of settings) {
    console.log(`>>> id: ${setting.zenn.slug}`);
    await build(setting);
  }
})().catch(console.error);
