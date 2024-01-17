---
title: "GraphQLとOpenAPIを比較する時は「REST API」に注意する"
emoji: "📝"
type: "tech"
topics: ["open-api"]
published: true
---


  [自ブログ](https://blog.hedrall.work/posts/2023-10-24-no-more-rest)からの引用です。
  
  ## 概要

あるとき、`GraphQL`を実務で利用している友人と飲みながら、彼が携わっているシステムに関して、`GraphQL`や`BFF層`がそのチームにとって本当に必要なのか？を議論したことがありました。

個人的には、`GraphQL`は複雑性を増したり、フロントエンドスピシフィックなアーキテクチャを生み出したりするため、`GraphQL`を利用する明確な理由がなければ、基本的に`OpenAPI`を利用したプラクティスの方がよりシンプルだと考えています。

その際に、彼から「でも、RESTは使いにくいよね」という反応がありました。
私はよく他の`GraphQL`, `gRPC`利用者からも同じような反応を受けることがあるのですが、`REST`という言葉は本質的な観点を見落としている可能性があると感じています。

本記事では、なぜ`REST API`という用語に注意した方が良いのか？と、APIエンドポイントの技術選定に関する正しい観点を整理します。

## APIモデリングのパラダイム

APIのエンドポイントを開発する上で、エンドポイントのモデリング方法(どのように整理するか？)に関しては主に2つのパラダイムがあります。

1. リソース
2. 関数

`1`はリソースによる整理で、クライアントがリソースごとアクセスできるように整理します。 <br/>
`2`の場合は関数で整理する方法で、API側はクライアントのニーズに合わせてエンドポイントを整理します。

この2つはAPIエンドポイントのモデリング方針を決める上で基盤的な概念です。大まかな使いわけとしては、APIとクライアントが一体のシステムの場合は`2`のように機能ごとにモデリングすると便利なことが多く、クライアントがAPIと別のシステムになる場合、またはクライアントが不特定多数になる場合は、個別のクライアントのニーズに答え切ることが難しいため、`2`のリソースでの整理が多くなります。

## `REST`の再認識

1つ、Googleの[ポスト](https://cloud.google.com/blog/ja/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them)を引用します。

> 最も使用頻度の低い API モデルは REST です。REST という単語が広く使用（あるいは乱用）されていても、この方法で設計されている API は非常に少数です。

実は、この記述を意外に感じた方も少なくないのではないでしょうか？<br/>
現実には`REST`なAPIはほとんど存在しません。それにもかかわらず、実際の現場ではよく`REST`という用語をよく耳にすると思います。<br/>
このように、概念が間違った使われ方をしているために、正しい認識や議論が阻害されれている状況があると感じます。<br/>

では、`REST API`とは本質的にどんな物でしょうか？`REST`に関する正確な定義は、(私も詳しくないので)他の多くの情報元に譲るとして、重要な点の一つとしては、(REST)原則に則って**リソースで整理**する点です。

例えば、`id=100`のユーザを取得したければ、クライアントがAPIの実装をよく知らなくても、`GET: /user/100`にアクセスすればよいということになります。
このように、REST APIではサーバーとクライアントの示し合わせの必要性が低くなるため、`OpenAPI`などの`IDL`の利用価値がそれ程高くありません。

## RPCとは？

では、`OpenAPI`を利用したプロジェクトのほとんどが`REST`ではないとしたら、実際はどのような概念を使っているのでしょうか？<br/>
一般的に、`OpenAPI`で管理されているAPIエンドポイントのほとんどが、`RPC`エンドポイントとしてモデリングされています。

`PRC`とは、ネットワークの先にあるシステムのプログラム(手続き)を呼び出すことです。例えば、ユーザの取得用に`GET: /getUser?id={xxx}`や`GET: /search?userId={xxx}`のようなエンドポイントを公開します。
つまり、`RPC`は`リソース`ではなく、`関数`でAPIエンドポイントを整理します。

`RPC`エンドポイントの整理方法はAPI側次第なので、クライアントに対してどんなAPIエンドポイントが利用できるか？を教えてあげる必要があります。そのため、`OpenAPI`のような`IDL`を利用することで、インターフェイスを効率よく交換することができる様になります。

このように、`REST`はリソースで明示的に整理されるので`OpenAPI`の利用価値がそれほど高くない一方で、`RPC`の場合は`OpenAPI`などの`IDL`を利用しないと server - client 間のインターフェイスの調整が難しいため、`OpenAPI`を`REST`と呼ぶのはある意味矛盾した表現にもなります。

## なぜ、OpenAPIをRESTと呼ぶとよくないのか？

`OpenAPI`を`REST`と表現する場合、`REST`と`RPC`の特徴の区別を曖昧にするからです。<br/>
これは前述の、`リソース`と`関数`のどちらでモデリングするか？という重要な観点を曖昧にし、APIの技術選定において大きな認識の齟齬を生むことがあります。

例えば、あるシステムのバックエンドとフロントエンドを同じ組織で開発をしている場合は、本来一体であるシステムがたまたまネットワークで分断されているためにHTTPを利用しなければならないだけであって、両者が向き合っているドメインや抱えるニーズは全く同じなので、`RPC`を利用することで仮想的に一体のシステムとして開発を進めることができ、認知不可を軽減し、開発効率を高めることができます。

一方で、クライアント側が不特定多数の顧客で、多様なニーズに合わせて機能提供する必要がある場合には、より汎用的かつ明示的に`リソース`で整理する方が良いかもしれません。

その他にもたくさんのパターンが考えられますが、`リソース`と`関数`のどちらでモデリングするかは選定のベースラインになります。

また、`GraphQL`や`gRPC`などの他のAPIプロトコルと比較検討する際も、`リソース`と`関数`の観点が重要です。
冒頭に述べた「RESTはなぁ〜」という議論は本質的でなく、`OpenAPI`と比較する場合はそもそもほとんどが`RPC`になるため、`リソース`でモデリングしたいのか？`RPC`でモデリングする場合どちらの技術の方が現況にマッチするか？といった観点が重要になります。

## まとめ

本記事では、`REST`と`RPC`の違いに関して整理し、`OpenAPI`を不用意に`REST`と呼ぶことは、重要な論点を曖昧にするために好ましくないことを説明しました。<br/>
API構築は一連の開発業務の中でもコアな部分になるため、`リソース`と`関数`の観点を意識して状況にあった技術選定を検討していけると良いと思います。


  