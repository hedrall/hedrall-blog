/* eslint-disable */
// prettier-ignore
/**
 * このファイルは updater.ts により自動生成されています
 */
import { FileId } from '../../../posts/meta/filenames';
import { Setting } from './type';
import _ExternalSiteSettings from './_index';

/**
 * 他サイトへの投稿内容を設定する
 * 旧記事は足さない
 */
export const ExternalSiteSettings: { [K in FileId]?: Setting<K> } | undefined = _ExternalSiteSettings;
