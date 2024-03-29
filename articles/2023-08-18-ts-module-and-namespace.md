---
title: "TypeScriptで型と値を一体化し、モジュールを形成する重要性と手法"
emoji: "📝"
type: "tech"
topics: ["typescript"]
published: true
---


  [自ブログ](https://blog.hedrall.work/posts/2023-08-18-ts-module-and-namespace)からの引用です。
  
  # 概要

`TypeScript`のコードベースを綺麗に保つためには、他の言語でも同じ様に上手にモジュール化して論理構造をきれいに整理する技術が必要になります。<br/>
一方で、`TypeScript`では値と型のモジュール化方法が異なるために、うまく実践できていないことがあります。
本記事では、`型`と`値`の管理を共通化する方法と、`namespace`を利用して両者をモジュール化していく方法について検討します。

本記事の要点

- `TypeScript`で型のモジュール化は案外難しい
- コンパニオンオブジェクトを活用して`値`と`型`を一体化する
- `namespace`を利用して、型をモジュール化する

# はじめに

本記事で`型`と`値`を比較する場合の`値`の意味合いとして、`ランタイム`に影響する要素という意味で利用しています。
`型`はコンパイル後にコードから削除されますが、`const`, `class`などはコンパイル後も残ります。これらを`型`と対比して`値`と呼ばせていただきます。

# 問題提起

早速ですが、普段から`TypeScript`を愛用されている方あるあるとして、`やたらと長い変数名`に出くわすことってありませんでしょうか？

イメージとしてはこんな感じです。
```typescript
// 関西風の和風ピザのトッピング
export type JapaneseWestPizzaTopping = 'takoyaki' | 'okonomiyaki';
// 関西風の和風ピザクラス
export class JapaneseWestPizza {
  topping: JapaneseWestPizzaTopping;
}
```

これには以下の事情が考えられます。

1. Globalで通用する名前でつける必要がある
    - 名前が衝突しない様に区別できる様にしたい
2. 型と値の関係性を命名で表現したい
    - `JapaneseWestPizzaTopping`が`JapaneseWestPizza`クラスで利用されることを示したい
3. 命名でコンテクストを表現したい
    - ピザが関西風に属し、さらに和風に属すことを示したい

この様に、本来モジュールなどで対応するべきことを、命名の工夫で対応してしまっていることが多々あります。
そして、当然ですが命名での解決には限界があります。

`1`に関して、命名が長大化しすぎる場合は、通常は命名が簡略されるのでトレードオフが発生します。逆に、短すぎてコンテクストが読み取れない命名も認知負荷の点で問題です。<br/>
また、`2`の`型`と`値`の対応関係を命名で表現している場合は、システムの肥大化とともに保守の難易度が上がっていきます。

ここまでの話を整理すると、うまく`TypeScript`のコードを整理していくためには以下の2つの要素が欠かせないということになります。

1. 型と値を一体として扱う
2. (型を)モジュール化する

# 課題

ではなぜ、1, 2が実践しにくいかを考えると、それぞれ`TypeScript`特有の難点があります。

以下では、それぞれの原因や解決方法を検討していきます。

## 課題1. 型と値を一体として扱う

TypeScriptユーザには自明な話と思いますが、`型`と`値`は別のレイヤーに存在します。

- 型: 静的解析 (TS only)
- 値: RunTime (JS)

これによって、`JavaScript`で書かれたライブラリに外側から`TS`の型をつけることもできる様になっています。

([DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)など)

つまり、`型`と`値`は本来分離して書ける仕様のため、明確に意識して保守しない限りは必然的に`型`と`値`の関係性が崩れて行ってしまいます。

`class`の様に元々`型`と`値`が一体となっている要素もありますが、そのほかの`const`や`type`の様な要素はどのように一体化させるのが良いでしょうか？

ここで、活用できるプラクティスとして、[コンパニオンオブジェクトパターン](https://typescriptbook.jp/tips/companion-object)があります。
パターンの内容はリンクの通りですが、簡単にいうと「**型と値を同名で定義する**」実装パターンです。これにより`型`と`値`を1つの命名に閉じ込めることができます。

メリットは柔軟に利用できる点です。
例えば、以下の様な様々な組み合わせで同名の定義を行うことができます。

- `const + type`
- `class + namespace`
- `type` + `namespace`
- `const + type + namespace`

ここまでの説明ではコンパニオンオブジェクトパターンを利用するメリットはさほど大きく感じられませんが、`次節(課題2)`で検討する`namespace`を利用したモジュール化と併用することで威力を発揮します。

## 課題2. (型を)モジュール化する

### 型のモジュール化方法は2つだけ

`モジュール化`自体は多くの人が普段当たり前に実践しているいることと思います。

`値`の世界ではオブジェクトを利用して簡単にモジュール化を行うことができます。また、SPA以前の世界ではJSのGlobal汚染が問題になることがしばしばあったので、オブジェクトやIIFEを利用したスコープを制限により、擬似的に名前空間を伴ったモジュール化も実践されています。
そのほか、[バレルファイル](https://typescript-jp.gitbook.io/deep-dive/main-1/barrel)を利用したモジュール整理方法もあります。

一方で、そういったプラクティスは`値`の世界のものであり、`型`の領域には適用できないことがあります。<br/>
実は**型のモジュール化方法は2つ**しかありません。 <br/>
(より正確にはnamaspaceを発生させる方法です。)

こちらの記事で解説されています。

[令和5年に知っているべきTypeScriptのnamespaceの知識](https://zenn.dev/uhyo/articles/ts-namespace-2023)

summary
- [モジュール名前空間オブジェクト](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/import#%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%E5%90%8D%E5%89%8D%E7%A9%BA%E9%96%93%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88)
    - `import * as Hoge from 'xxx';`した時に、`Hoge`に代入される値
- `namespace`宣言

> こちらの記事ではnamespaceの利用にネガティブな様です

つまり、TypeScriptでモジュール化していくためには、どちらかの方法を使いこなす必要があります。

### モジュール名前空間オブジェクトの欠点

まず、両者を検索すると`namespace`に関する否定的な意見をよく目にする傾向があるのは事実だと思いますので、まずは議論の入り口からつまづかない様にこちらの記事を引用いたします。

[TypeScriptのnamespaceは非推奨ではない](https://qiita.com/yuki153/items/a51878ad6a1ce913af48#namespace-%E3%81%AE%E4%BD%BF%E7%94%A8n%E3%81%8C%E6%95%AC%E9%81%A0%E3%81%95%E3%82%8C%E3%82%8B%E7%90%86%E7%94%B1)

この記事で紹介されている通り、`namespace`は確立された機能の一つです。

では、`モジュール名前空間オブジェクト`を利用した方法が推奨される背景にはどの様なことがあるのでしょうか。

1. JSの標準機能であること。`namespace`は`TypeScript`専用の機能である。
2. `namespace`は`RunTime`に影響を与える

一方で、筆者としては`モジュール名前空間オブジェクト`にも以下の様な欠点があると考えています。

`モジュール名前空間オブジェクト`の欠点

1. `reexport`の挙動はフラットになるので、階層化ができない
1. モジュールがディレクトリ単位なので、小回りが効かない、リファクタが面倒
1. モジュールシステム周りは仕様がかなり複雑化している部分なので、使いこなすのが難しかったり、エコシステムによって移行コストがかかる
    - (相当な種類の書き方がある...)

`1`に関して補足ですが、以下の様に`dep1/index.ts`での`reexport`の結果がフラットになっており、構造化されません。

```typescript
// dep1/dep2/index.ts
export const dep2 = 'dep2';

// dep1/index.ts
export * from './dep2';
export const dep1 = 'dep1';

// index.ts
import * as m from './dep1';
const a = m.dep1;
const b = m.dep2;
```

この様に`export / import`機能はあくまで`JS`のモジュール機能であって、`TypeScript`の独自機能である`型`を構造化するために、独自の`namespace`が存在する点は自然なことと感じています。

ちなみに、`namespace`は`enum`と並んで唯二`RunTime`(=`JS`にコンパイル後のコード)に影響を与える`TS`独自機能であることは事実です。ただし、`namespace`が`型`のみを含む場合は当然ですが`RunTime`には影響を与えません。
RunTimeへの影響うんぬんへの意見は好みの問題も大きいと思いますので、本記事では型の領域だけで利用する方法を中心に検討していきます。

ただし、`enum`には公称型になるという明確な欠点があるに対し、個人的には`namespace`の変換は軽微であり、`値`と`型`を一緒に扱えるメリットの方が勝ると考えています。

ts
```typescript
namespace A {
    const a = 'A';
    export const b = 'B';
    type C = 'C'
}
```
変換後
```javascript
var A;
(function (A) {
  const a = 'A';
  A.b = 'B';
})(A || (A = {}));
```

# 実践パターン

ここまで検討してきたことを元に、いくつかの実践パターンを紹介いたします。

## 1. Class + Union Type

ドメイン駆動設計でいう、Entityの定義をイメージするとわかりやすいと思います。
例としてユーザクラスの定義をあげます。

まずはモジュール化前のパターンです。

before

```typescript
// models/user/index.ts
export const USER_MEMBERSHIP_TYPE = {
    MEMBER: '会員',
    NON_MEMBER: '非会員',
} as const;
export type UserMembershipType = ValueOf<typeof USER_MEMBERSHIP_TYPE>;

export const USER_PHONE_TYPE = {
    CELL_PHONE: '携帯電話',
    HOME: '自宅',
    COMPANY: '会社',
} as const;
export type UserPhoneType = ValueOf<typeof USER_PHONE_TYPE>;

export class User {
    membership: {
        type: UserMembershipType,
    };
    phone: {
        type: Type,
        number: string,
    };

    constructor(memberShipType: UserMembershipType, phoneType: UserPhoneType) {
        /* ... */
    }
}
```

beforeコードのポイントは命名で対応関係や構造を表現している点です。
よく目にするコードではないでしょうか？ただし、利用側では少し煩雑になります。

```typescript
// 利用側 hoge.ts
import {
    User,
    USER_MEMBERSHIP_TYPE,
    UserMembershipType,
    USER_PHONE_TYPE,
    UserPhoneType,
} from './models/user';

const userMembershipType: UserMembershipType = USER_MEMBERSHIP_TYPE.MEMBER;
const userPhoneType: UserPhoneType = USER_PHONE_TYPE.CELL_PHONE;

const user: User = new User(userMembershipType, userPhoneType);
```

このコードをモジュール化すると以下の様になります。

after

```typescript
// models/user/index.ts

// 1. exportしない
const MEMBERSHIP_TYPE = {
    MEMBER: '会員',
    NON_MEMBER: '非会員',
} as const;

const PHONE_TYPE = {
    CELL_PHONE: '携帯電話',
    HOME: '自宅',
    COMPANY: '会社',
} as const;

// 2. クラスと同名でnamespaceを定義する
export namespace User {
    export namespace Membership {
        export type Type = ValueOf<typeof USER_MEMBERSHIP_TYPE>;
    }
    export namespace Phone {
        export type Type = ValueOf<typeof USER_PHONE_TYPE>;
    }
}
export class User {
    /**
     * 3. 値は型と同名で定義する
     * namespaceに値が入ることが気にならない場合は、namespace内に定義するとなお分かりやすい
     */
    static Membership = { Type: MEMBERSHIP_TYPE };
    static Phone = { Type: PHONE_TYPE };

    membership: {
        // 4. namespaceが参照できる
        type: User.Membership.Type
    };
    phone: {
        type: User.Phone.Type,
        number: string,
    };

    constructor(memberShipType: User.Membership.Type, phoneType: User.Phone.Type) {
        /* ... */
    }
}
```

見慣れない方は少し煩雑になった印象を持つと思いますが、beforeコードと比べると、`値`と`型`の結びつきがより強くなったことがわかると思います。これは以下の利用側のコードを見ると実感しやすいです。

また、副次的な効果として命名が楽になっています。一度に `UserMembershipType` と考えるより、
「`User`の`Membership`の`Type`の〜」と段階を追って考えることができるので、脳内メモリを節約できます。また、構造かすることで頭の中も整理されていきます。

利用側のafterコード

```typescript
// 利用側 hoge.ts
import { User } from './models/user'; // 1. importが簡単になる

// 2. 変数名が '.' で区切られる
// 3. 変数名と型の構造が一致している
const userMembershipType: User.Membership.Type = User.Membership.Type.MEMBER;
const userPhoneType: User.Phone.Type = User.Phone.Type.PHONE;

const user: User = new User(userMembershipType, userPhoneType);
```

この手法により、**型と値を全く同じ構造**で定義することができます。
また、コメント`2`の通り、`.`で区切られているので単語の区切りが明確になり単純に読みやすくなるのと、エディターの補完を利用する際にも段階式にアクセスできるので検索性能がグッと上がっています。

## 2. Layer定義

`CleanArchitecture`など基本的なアーキテクチャを採用している場合は、`repository`, `service`, `controller`などのレイヤーに関して`Interface`を定義することがよくあります。
今回は`repository`の`interface`定義を例にとってみます。

beforeコード

```typescript
// ユーザの取得操作は id指定 or 会員種別
export type IUserRepositoryGetParams = {
    userId: string,
} | {
    membershipType: UserMembershipType,
}
export type IUserRepositorySaveResponse = {
    result: 'success' | 'failure',
    savedUser: User;
}
export type IUserRepository = {
    list: (params: IUserRepositoryGetParams) => Promise<User | undefined>;
    save: (user: User, operatorId: string) => Promise<IUserRepositorySaveResponse>;
}
```

`interface`内に定義されるメソッド(`list`など)の引数や戻り値の型が複雑になった場合に、`型`に切り出したいことがありますが、命名が長くなったり、利用箇所と離れてしまったりという問題が生じます。

そこで、`type`と`namespace`の定義の組み合わせを活用します。

afterコード

```typescript
// 1. namespaceとtypeを同名で定義する
export type IUserRepository = {
    list: IUserRepository.List;
    save: IUserRepository.Save;
}
export namespace IUserRepository {
    export namespace Get {
        export type Params = {
            userId: string,
        } | {
            membershipType: User.Membership.Type,
        }
        export type Response = User | undefined
    }
    export type Get = (params: Get.Params) => Promise<Get.Response>;

    export namespace Save {
        export type Params = User;
        export type Response = {
            result: 'success' | 'failure',
            savedUser: User;
        }
    }
    export type Save = (params: Save.Params) => Promise<Save.Response>;
}
```

この様に構造化することで、`interface`内のメソッド同士をより疎に定義することができます。また、この様に実装を構造化することの副次的な効果として、`github copilot`の様な生成AIの精度向上も期待されます。(手元ではサジェストがかなり効いている印象があります。)

実装側のコードは共通になります。

repositoryの実装 (before = after)
```typescript
import { IUserRepository as I } from './repository/user/index.ts';
export class UserRepository implements I {
    list: I.List = async (params) => { /* ... */ }
    save(params: I.Save.Params): Promise<I.Save.Response> { /* ... */ }
}
```

最後に利用者側のコードですが、少し見映えが変わります。

before

```typescript
import {
    IUserRepository,
    IUserRepositoryGetParams,
    IUserRepositorySaveResponse,
} from './repository/user/index.ts';
const userRepository: IUserRepository = new UserRepository();
const getParam: IUserRepositoryGetParams = { userId: 'hoge' };
const user = await userRepository.get(getParams);
```

after

```typescript
import { IUserRepository } from './repository/user/index.ts';
const userRepository: IUserRepository = new UserRepository();
const getParam: IUserRepository.Get.Params = { userId: 'hoge' };
const user = await userRepository.get(getParams);
```

重ねてになりますが、パターン1, 2は`型`の世界に閉じた実装になっているため、`RunTime`には一切影響を与えません。

## 3. writer + reader

このパターンは`RunTime`に影響するパターンです。
あるエンティティに関して`Write`モデルと`Read`モデルを分けたい場合の定義方法です。
今回はafterコードだけ紹介します。

```typescript
export namespace User {
    class UserBase {
        name: string;
    }

    const writerFactory: factory = (user) => { /* ... */ }
    export namespace Write {
      export type factory = (name: string) => User.Write;
    }
    export class Write extends User {
        static factory = writerFactory;
    }

    export class Read extends User {
        // Readモデルだけ id がある
        id: string;
    }
}
```

利用側

```typescript
import { User } from './user.ts';
const userWriteModel = User.Write.factory('foo');
```

# namespaceのtips

## namespaceの一部をファイル分割する

`namespace`内の`namespace`は`import`で取り出すことができます。

ex)
```typescript
import Membership = User.Membership;
```

これを、利用してモジュールの`reexport`の様なことができます。

```typescript
// user/membership.ts
export namespace _Membership {
    export type Type = '会員' | '非会員';
}

// user/index.ts
import { _Membership } from './membership.ts';
export namespace User {
    export import Membership = _Membership;
}
```

## Storybookのビルド (23/09/06追記)

`Storybook`は`Babel`を利用してビルドしていますが、`Babel`が`namespace`と`class`の同名宣言に対応していないため、ビルドエラーが起こる場合があります。

その場合は、`swc`でのビルドをONにしてください。

公式から
https://storybook.js.org/docs/react/configure/babel#swc-alternative-experimental

```js
// .storybook/main.ts

// Replace your-framework with the webpack-based framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/your-framework',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};

export default config;
```

ただし、各コンポーネントで`import React from 'react';`を明示的に記載する必要がある様なので、`React`の`import`エラーに遭遇した場合は`preview.js`に`import`を追加してください。

# FAQ (おまけ)

本記事の概念を実務で実施する際に、周囲のエンジニアからFBいただいたことを順次追記できればと思っています。

## 型の構造化は `A['b']` の様なアクセスも可能なのでは？ (2023/09/22)

`型をまとめる`という目的に関しては、`namespace`を利用しなくても実現可能です。

```typescript
type Pet = {
  Cat: { nakigoe: 'にゃー' },
  Dog: { nakigoe: 'わん' },
}
// 取り出し
type Cat = Pet['Cat'];
```

上記の例では、取り出し側の構文が `Pet.Cat` => `Pet['Cat']` になるだけです。

しかし、ユースケースによっては、`Pet`自体を`モジュール`ではなく`エンティティ`として扱いたい場面があります。その場合はオブジェクト型を利用した型定義では対応できないため、やはり `namespace` を利用すると便利です。

```typescript
// namespaceがモジュールとしてのPetの定義
namespace Pet {
  export type Cat = { nakigoe: 'にゃー' };
  export type Dog = { nakigoe: 'わん' };
}
// エンティティとしてのPetの型定義
type Pet = Pet.Cat | Pet.Dog;
```

# まとめ

TypeScriptでコーディングすることの**最大のメリット**は、型を利用することで**コードの保守性を高めること**であると思っています。一方で、`JavaScript`には**モジュールの概念が曖昧**に存在しているために、論理構造の整理が適切に進められていないケースを見かけます。

`namespace`はマイナスのイメージを持たれることが多いことも事実ですが、モジュールの概念を明確に考慮したコーディングを行っていくことが`TS`本来の目的にとって非常に有用なことだと思います。

また、`型`と`値`の2つの世界をうまく融合させていくのにも苦労している人が多いと感じており、コンパニオンオブジェクトパターンの重要性も感じます。

-------------

上記の知見が少しでもみなさんのお役に立てば幸いです。

末筆ながら、長い記事になりましたが、読んでいただいたみなさんありがとうございましたmm

  
