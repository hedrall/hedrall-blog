import React from 'react';
import dynamic from 'next/dynamic';
import DependencyCruiser from './20221120-dependency-cruiser.mdx';

type _Meta = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
};

const _PostFileName = [
  '20221120-dependency-cruiser.mdx',
  '20221120-glob.mdx',
  '20221203-jet-brain.mdx',
  'aws-cdk-20210207.mdx',
  'aws-cdk-v2-20210604.mdx',
  'cdc-test-20220614.mdx',
  'esbuild-2021-02-14.mdx',
  'esbuild-dev-env-20211202.mdx',
  'future-cast-202012.mdx',
  'future-cast-20210213.mdx',
  'grpc-implementation-20211221.mdx',
  'grpc-what-20211216.mdx',
  'jp-coding-20230308.mdx',
  'tsoa-20211206.mdx',
  'typescript-travel-3.7-4.2-20210516.mdx',
  'uvu-jest-20220302.mdx',
  'value-object-20220724.mdx',
  'vite-20210305.mdx',
  'vr-20220510.mdx',
  'web-components-20211018.mdx',
  'qwik.mdx',
  'doc-creation.mdx',
] as const;

type _PostFileName = (typeof _PostFileName)[number];

const _Meta: { [K in _PostFileName]: _Meta & { slug: _PostFileName extends `${infer N}.mdx` ? N : string } } = {
  'qwik.mdx': {
    slug: 'qwik',
    title: 'qwikをざっくり調べてみた',
    date: '2023-06-12',
    author: 'hedrall',
    image: 'https://github.com/hedrall/hedrall-blog/assets/20538481/e724cf4e-0c79-488f-a0c8-003ceac28e0b',
    tags: ['typescript', 'spa'],
  },
  'doc-creation.mdx': {
    slug: 'doc-creation',
    title: 'エンジニアが考える、情報対象性の高い資料作成に重要なこと',
    date: '2023-06-25',
    author: 'hedrall',
    image: '',
    tags: ['doc'],
  },
  '20221120-dependency-cruiser.mdx': {
    slug: '20221120-dependency-cruiser',
    title: 'ESLintだけでは守れない。Dependency cruiserによるアーキテクチャー保護',
    date: '2022-11-29',
    author: 'hedrall',
    image: '/images/dependency-cruiser/logo.png',
    tags: ['typescript'],
  },
  '20221120-glob.mdx': {
    slug: '20221120-glob',
    title: 'Node.jsでglobパターンを、RegExpに変換するBetterな法方',
    date: '2022-11-20',
    author: 'hedrall',
    image: '/images/typescript/logo.png',
    tags: ['tips', 'typescript'],
  },
  '20221203-jet-brain.mdx': {
    slug: '20221203-jet-brain',
    title: '[TBD]JetBrainに関するTips集',
    date: '2023-03-01',
    author: 'hedrall',
    image: '/images/jetbrain/logo.png',
    tags: ['typescript'],
  },
  'aws-cdk-20210207.mdx': {
    slug: 'aws-cdk-20210207',
    title: '改めて「AWS CDK」を深掘りしてみた',
    date: '2021-02-07',
    author: 'hedrall',
    image: '/images/aws-cdk/logo.jpg',
    tags: ['infra', 'cdk', 'typescript'],
  },
  'aws-cdk-v2-20210604.mdx': {
    slug: 'aws-cdk-v2-20210604',
    title: 'AWS CDK v2 RCが出たので変更点をまとめます！',
    date: '2021-06-04',
    author: 'hedrall',
    image: '/images/aws-cdk/logo.jpg',
    tags: ['infra', 'cdk', 'typescript'],
  },
  'cdc-test-20220614.mdx': {
    slug: 'cdc-test-20220614',
    title: 'マイクロサービス間の整合性を守る、消費者駆動契約テストをNode.jsで試してみる',
    date: '2022-06-14',
    author: 'hedrall',
    image: '/images/pact/logo.png',
    tags: ['typescript', 'test'],
  },
  'esbuild-2021-02-14.mdx': {
    slug: 'esbuild-2021-02-14',
    title: 'さっくりとesbuildを調査してみた',
    date: '2021-02-14',
    author: 'hedrall',
    image: '/images/esbuild/logo.png',
    tags: ['build', 'typescript', 'react'],
  },
  'esbuild-dev-env-20211202.mdx': {
    slug: 'esbuild-dev-env-20211202',
    title: 'esbuild + React(TS) で実現する超軽量な開発環境',
    date: '2021-12-02',
    author: 'hedrall',
    image: '/images/esbuild/logo.png',
    tags: ['build', 'typescript', 'react'],
  },
  'future-cast-202012.mdx': {
    slug: 'future-cast-202012',
    title: '[Nuxt + Firebase + Lambda] で実現したLow CostなSSR環境 (結構辛い)',
    date: '2020-12-01',
    author: 'hedrall',
    image: '/images/future-cast/top.png',
    tags: ['typescript', 'firebase', 'nuxt'],
  },
  'future-cast-20210213.mdx': {
    slug: 'future-cast-20210213',
    title: 'FUTURE CASTという近未来の出来事を予想して遊べるサイトを公開しました！',
    date: '2021-02-13',
    author: 'hedrall',
    image: '/images/future-cast/top.jpg',
    tags: ['typescript', 'firebase', 'nuxt'],
  },
  'grpc-implementation-20211221.mdx': {
    slug: 'grpc-implementation-20211221',
    title: 'Node.js + TypeScript で gRPCに入門する [後編: 実装編]',
    date: '2021-12-21',
    author: 'hedrall',
    image: '/images/grpc/logo.jpg',
    tags: ['api', 'typescript', 'node.js'],
  },
  'grpc-what-20211216.mdx': {
    slug: 'grpc-what-20211216',
    title: 'Node.js + TypeScript で gRPCに入門する [前編: gRPCとは]',
    date: '2021-12-16',
    author: 'hedrall',
    image: '/images/grpc/logo.jpg',
    tags: ['api', 'typescript', 'node.js'],
  },
  'jp-coding-20230308.mdx': {
    slug: 'jp-coding-20230308',
    title: 'Webエンジニアはそろそろ日本語変数名の利用を検討してもいいのでは？',
    date: '2023-03-08',
    author: 'hedrall',
    image: '/images/typescript/logo.png',
    tags: ['typescript'],
  },
  'tsoa-20211206.mdx': {
    slug: 'tsoa-20211206',
    title: 'Code Firstで疲弊しないOpenApi活用方法',
    date: '2021-12-10',
    author: 'hedrall',
    image: '/images/typescript/logo.png',
    tags: ['api', 'open-api', 'typescript'],
  },
  'typescript-travel-3.7-4.2-20210516.mdx': {
    slug: 'typescript-travel-3.7-4.2-20210516',
    title: 'TypeScript 3.7 ~ 4.2 までの主な変更をまとめて復習する',
    date: '2021-05-16',
    author: 'hedrall',
    image: '/images/typescript/logo.png',
    tags: ['typescript'],
  },
  'uvu-jest-20220302.mdx': {
    slug: 'uvu-jest-20220302',
    title: '既存のJestで書かれたテストを爆速実行するツール、uvu-jest を作りました',
    date: '2022-03-02',
    author: 'hedrall',
    image: '/images/aws-cdk/logo.jpg',
    tags: ['test', 'front', 'typescript', 'api'],
  },
  'value-object-20220724.mdx': {
    slug: 'value-object-20220724',
    title: 'ドメイン駆動設計: TypeScriptでの値オブジェクトの書き方',
    date: '2022-07-24',
    author: 'hedrall',
    image: '/images/typescript/logo-wide.svg',
    tags: ['typescript', 'architecture', 'ddd'],
  },
  'vite-20210305.mdx': {
    slug: 'vite-20210305',
    title: '[Vueの開発体験を爆上げする] Viteを調査',
    date: '2021-03-05',
    author: 'hedrall',
    image: '/images/aws-cdk/logo.jpg',
    tags: ['front', 'typescript', 'vue', 'build'],
  },
  'vr-20220510.mdx': {
    slug: 'vr-20220510',
    title: 'Visual Regression テストのやり方を詳しく解説',
    date: '2022-05-10',
    author: 'hedrall',
    image: '/images/aws-cdk/logo.jpg',
    tags: ['typescript', 'test', 'cdk'],
  },
  'web-components-20211018.mdx': {
    slug: 'web-components-20211018',
    title: 'WebComponentsとは何だったのか？基礎から再入門する',
    date: '2021-10-18',
    author: 'hedrall',
    image: '/images/aws-cdk/logo.jpg',
    tags: ['front', 'web-standard'],
  },
};

const _PostComponents = {
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

export namespace Post {
  export const Meta = _Meta;
  export type Meta = _Meta;
  export const FileNames = _PostFileName;
  export type FileName = _PostFileName;
  export const Components = _PostComponents;
}
