import { FileId } from '../../../posts/meta/filenames';

type ZennSetting = {
  // zenn上での記事のID
  slug: string;
  emoji?: string;
};
type QiitaSetting = {
  id: string | '未投稿';
  url?: string;
  updatedAt?: string;
};
export namespace Setting {
  export type Disable = {
    enable: false;
  };
  export type Enable<ID extends FileId> = {
    enable: true;
    fileId: ID;
    zenn: ZennSetting;
    qiita: QiitaSetting;
  };
  export const isEnable = <T extends FileId>(setting: Setting<T>): setting is Setting.Enable<T> => {
    return setting.enable;
  };
}
export type Setting<ID extends FileId> = Setting.Disable | Setting.Enable<ID>;
