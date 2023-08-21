import dynamic from 'next/dynamic';
import DependencyCruiser from '*.mdx';
import { _PostFileName } from './filenames';
import React from 'react';

export const _PostComponents = {
  '2023-08-18-ts-module-and-namespace.mdx': dynamic(() => import('./2023-08-18-ts-module-and-namespace.mdx')),
  'ts-null-coding.mdx': dynamic(() => import('./ts-null-coding.mdx')),
  'doc-creation.mdx': dynamic(() => import('./doc-creation.mdx')),
  '20221120-dependency-cruiser.mdx': DependencyCruiser,
  'qwik.mdx': dynamic(() => import('./qwik.mdx')),
  '20221120-glob.mdx': dynamic(() => import('./20221120-glob.mdx')),
  '20221203-jet-brain.mdx': dynamic(() => import('./20221203-jet-brain.mdx')),
  'aws-cdk-20210207.mdx': dynamic(() => import('./aws-cdk-20210207.mdx')),
  'aws-cdk-v2-20210604.mdx': dynamic(() => import('./aws-cdk-v2-20210604.mdx')),
  'cdc-test-20220614.mdx': dynamic(() => import('./cdc-test-20220614.mdx')),
  'esbuild-2021-02-14.mdx': dynamic(() => import('./esbuild-2021-02-14.mdx')),
  'esbuild-dev-env-20211202.mdx': dynamic(() => import('./esbuild-dev-env-20211202.mdx')),
  'future-cast-202012.mdx': dynamic(() => import('./future-cast-202012.mdx')),
  'future-cast-20210213.mdx': dynamic(() => import('./future-cast-20210213.mdx')),
  'grpc-implementation-20211221.mdx': dynamic(() => import('./grpc-implementation-20211221.mdx')),
  'grpc-what-20211216.mdx': dynamic(() => import('./grpc-what-20211216.mdx')),
  'jp-coding-20230308.mdx': dynamic(() => import('./jp-coding-20230308.mdx')),
  'tsoa-20211206.mdx': dynamic(() => import('./tsoa-20211206.mdx')),
  'typescript-travel-3.7-4.2-20210516.mdx': dynamic(() => import('./typescript-travel-3.7-4.2-20210516.mdx')),
  'uvu-jest-20220302.mdx': dynamic(() => import('./uvu-jest-20220302.mdx')),
  'value-object-20220724.mdx': dynamic(() => import('./value-object-20220724.mdx')),
  'vite-20210305.mdx': dynamic(() => import('./vite-20210305.mdx')),
  'vr-20220510.mdx': dynamic(() => import('./vr-20220510.mdx')),
  'web-components-20211018.mdx': dynamic(() => import('./web-components-20211018.mdx')),
} satisfies {
  [K in _PostFileName]: React.ComponentType<any>;
};
