import { FileId } from '../../../posts/meta/filenames';

/**
 * 過去に投稿済みの記事はslugが決定してしまっているので、変換を用意する
 */
export const _Posted = [
  // {
  //   slug: '2023-08-18-ts-module-and-namespace',
  //   title: 'TypeScriptで型と値を一体化し、モジュールを形成する重要性と手法',
  //   emoji: '📝',
  //   fileId: '2023-08-18-ts-module-and-namespace',
  // },
  {
    slug: 'a93fb666400d5a',
    title: 'TypeScriptのコーディングでnullとundefinedを使い分けるべきか？',
    emoji: '🐕',
    fileId: 'ts-null-coding',
  },
  {
    slug: 'c15276e01725e0',
    title: 'qwikをざっくり調べてみた',
    emoji: '⚡',
    fileId: 'qwik',
  },
  {
    slug: '48dd7d8ae4fab7',
    title: 'Webエンジニアはそろそろ日本語変数名の利用を検討してもいいのでは？',
    emoji: '🧑‍🎓',
    fileId: 'jp-coding-20230308',
  },
  {
    slug: 'f565147bee5da8',
    title: 'ESLintだけでは守れない。Dependency cruiserによるアーキテクチャー保護',
    emoji: '📑',
    fileId: '20221120-dependency-cruiser',
  },
  {
    slug: '81d3812f45c02b',
    title: '[TIPS]: Node.jsでglobパターンを、RegExpに変換するBetterな法方',
    emoji: '✏️',
    fileId: '20221120-glob',
  },
  {
    slug: 'ef51d58507dc71',
    title: 'ドメイン駆動設計: TypeScriptでの値オブジェクトの書き方',
    emoji: '💎',
    fileId: 'value-object-20220724',
  },
  {
    slug: '09bfa9cd3c765f',
    title: 'Code Firstで疲弊しないOpenAPI活用方法',
    emoji: '💨',
    fileId: 'tsoa-20211206',
  },
  // {
  //   slug: '8bbe98a9d0595e',
  //   title: 'TypeScriptのライブラリ内で参照されているライブラリを差し替えるちょっとしたTIPS',
  //   emoji: '😊',
  // },
  {
    slug: '0c2981db19a952',
    title: 'AWS CDK v2 RCが出たので変更点をまとめます！',
    emoji: '✨',
    fileId: 'aws-cdk-v2-20210604',
  },
  {
    slug: '6f94763fc6a1cc',
    title: 'TypeScript 3.7 ~ 4.2 までの主な変更をまとめて復習する',
    emoji: '🛠️',
    fileId: 'typescript-travel-3.7-4.2-20210516',
  },
  // {
  //   slug: '251441f391990f',
  //   title: '重い腰を上げて、NPMの取りこぼしを回収する',
  //   emoji: '🕳️',
  // },
  {
    slug: '05ddbca496ba51',
    title: '[Vueの開発体験を爆上げする] Viteを調査',
    emoji: '⚡',
    fileId: 'vite-20210305',
  },
  // {
  //   slug: 'f992ac2c76c485',
  //   title: 'Webエンジニアが勉強できるGit Repository 10選',
  //   emoji: '🔥',
  // },
  // { slug: 'c4a6d89c848a24', title: 'Jestでスナップショットのパスを変更する', emoji: '😁' },
] satisfies { slug: string; emoji?: string; title: string; fileId: FileId }[];

export namespace ZennPosted {
  export const items = _Posted;

  export const isPosted = (fileId: FileId) => {
    const found = _Posted.find((p) => p.fileId === fileId);
    return !!found;
  };

  export const get = (fileId: FileId) => {
    return _Posted.find((p) => p.fileId === fileId);
  };
}
