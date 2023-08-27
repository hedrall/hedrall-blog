type ZennSetting = {
  // zenn上での記事のID
  slug: string;
  emoji?: string;
};
type QiitaSetting = {
  id: string | '未投稿';
};
export namespace Setting {
  export type Disable = {
    enable: false;
  };
  export type Enable<FileId extends string> = {
    enable: true;
    fileId: FileId;
    zenn: ZennSetting;
    qiita: QiitaSetting;
  };
  export const isEnable = <T extends string>(setting: Setting<T>): setting is Setting.Enable<T> => {
    return setting.enable;
  };
}
export type Setting<FileId extends string> = Setting.Disable | Setting.Enable<FileId>;
