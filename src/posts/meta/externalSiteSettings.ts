/**
 * 他サイトへの投稿可否を設定する
 */
import { _PostFileName } from './filenames';
import { _Meta } from './meta';

export const ExternalSiteSettings = {
  '2023-08-18-ts-module-and-namespace.mdx': { enable: true },
  'ts-null-coding.mdx': { enable: true },
  'qwik.mdx': { enable: false },
  'doc-creation.mdx': { enable: false },
  '20221120-dependency-cruiser.mdx': { enable: false },
  '20221120-glob.mdx': { enable: false },
  '20221203-jet-brain.mdx': { enable: false },
  'aws-cdk-20210207.mdx': { enable: false },
  'aws-cdk-v2-20210604.mdx': { enable: false },
  'cdc-test-20220614.mdx': { enable: false },
  'esbuild-2021-02-14.mdx': { enable: false },
  'esbuild-dev-env-20211202.mdx': { enable: false },
  'future-cast-202012.mdx': { enable: false },
  'future-cast-20210213.mdx': { enable: false },
  'grpc-implementation-20211221.mdx': { enable: false },
  'grpc-what-20211216.mdx': { enable: false },
  'jp-coding-20230308.mdx': { enable: false },
  'tsoa-20211206.mdx': { enable: false },
  'typescript-travel-3.7-4.2-20210516.mdx': { enable: false },
  'uvu-jest-20220302.mdx': { enable: false },
  'value-object-20220724.mdx': { enable: false },
  'vite-20210305.mdx': { enable: false },
  'vr-20220510.mdx': { enable: false },
  'web-components-20211018.mdx': { enable: false },
} satisfies { [K in _PostFileName]: { enable: boolean } };
