/**
 * 他サイトへの投稿可否を設定する
 */
import { _PostFileName, FileId } from './filenames';
import { _Meta } from './meta';

export const ExternalSiteSettings: { [K in FileId]?: { enable: boolean; emoji?: string } } | undefined = {
  '2023-08-18-ts-module-and-namespace': { enable: true, emoji: '📝' },
  'ts-null-coding': { enable: true },
  // 'qwik': { enable: false },
  // 'doc-creation': { enable: false },
  // '20221120-dependency-cruiser': { enable: false },
  // '20221120-glob': { enable: false },
  // '20221203-jet-brain': { enable: false },
  // 'aws-cdk-20210207': { enable: false },
  // 'aws-cdk-v2-20210604': { enable: false },
  // 'cdc-test-20220614': { enable: false },
  // 'esbuild-2021-02-14': { enable: false },
  // 'esbuild-dev-env-20211202': { enable: false },
  // 'future-cast-202012': { enable: false },
  // 'future-cast-20210213': { enable: false },
  // 'grpc-implementation-20211221': { enable: false },
  // 'grpc-what-20211216': { enable: false },
  // 'jp-coding-20230308': { enable: false },
  // 'tsoa-20211206': { enable: false },
  // 'typescript-travel-3.7-4.2-20210516': { enable: false },
  // 'uvu-jest-20220302': { enable: false },
  // 'value-object-20220724': { enable: false },
  // 'vite-20210305': { enable: false },
  // 'vr-20220510': { enable: false },
  // 'web-components-20211018': { enable: false },
};
