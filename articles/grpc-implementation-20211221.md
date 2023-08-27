---
title: "Node.js + TypeScript で gRPCに入門する [後編: 実装編]"
emoji: "📦"
type: "tech"
topics: ["api", "typescript", "node.js"]
published: true
---


  [自ブログ](https://blog.hedrall.work/posts/grpc-implementation-20211221)からの引用です。
  
  ![TopPage](/images/grpc/logo.png)
[出典: https://cncf-branding.netlify.app/projects/grpc/]

この記事は2021年度の「株式会社カケハシ x TypeScript」アドベントカレンダーの21日目の記事として執筆いたしました。
こんにちは！今年最後の記事になりますが、`gRPC`の実装を`Node.js`で実装する方法をまとめていきます！

## 概要

本記事では `Node.js + TypeScript` 環境で `gRPC`の基本的な実装方法ができる様に、1からご紹介していきます。
本記事から読み始める事も可能ですが、[前半](https://blog.hedrall.work/posts/grpc-what-20211216) では`gRPC`とは？という部分や、必要なツール群の詳細をフロントエンドエンジニアの視点で解説いたしましたので、適宜参考にしていただけると幸いです。

## 全体の流れ

結構長い記事になっておりますが、順を追って実装内容を深めておりますので、先にアジェンダを確認しておきたいと思います！

■ 最初は基本的な `Node.js + TypeScript` 環境でgRPC通信をデモしていきます

1. `.proto`ファイルを作成し、API定義を作成する
1. `protoc`で`.proto`ファイルをコンパイルし、`gRPC`クライアントとサーバの雛形を作成する
1. `gRPC`サーバを実装する
1. クライアントを利用するコードを実装する
1. 動作を確認する

■ さらに、WEBブラウザから呼び出しができる様に `grpc-web` を利用してクライアントを実装して見ます

1. `grpc-web` を利用して、`gRPC`のWEBクライアントを作成する
1. クライアントを利用するHTMLページを作成する
1. クライアントを利用するためのプロキシを準備する
1. 動作を確認する

■ 最後に、`gRPC`の醍醐味であるストリームに関して、`Node.js` で実装するとどうなるのかを紹介します

今回紹介するコードは[Gitレポジトリ](https://github.com/hedrall/grpc-with-ts-sample) に公開しましたので、ご参考にしてください。

## 基本的な実装

完成したコードは[こちら](https://github.com/hedrall/grpc-with-ts-sample/tree/master/ts-protoc-gen) を参照してください。

### `.proto`ファイルを作成する

`Protocol Buffers`の定義ファイル(`.proto`)を作成します。今回は簡単な例としてECショップのAPIの定義を作って見たいと思います。

```protobuf
syntax = "proto3";
// Googleによって事前定義された型を利用できます
import "google/protobuf/timestamp.proto";

// APIの定義です
service ShopService {
  // 注文を作成するAPIです 入力値が CreateOrderRequest で, 返却値が CreateOrderResponse です
  // それぞれ後ほど定義します
  rpc CreateOrder(CreateOrderRequest) returns (CreateOrderResponse) {}
  // 注文を一覧するAPIです
  rpc ListOrder(ListOrderRequest) returns (ListOrderResponse) {}
}

// 注文を表すモデルです
message Order {
  // 支払い方法をenumで定義します
  enum PaymentMethod {
    UNKNOWN = 0;
    CACHE = 1;
    CREDIT_CARD = 2;
    QR_CODE = 3;
  }

  string product_id = 1; // それぞれのプロパティには一意な数字を振ります

  int32 price = 2;

  PaymentMethod payment_method = 3;

  string by = 4;

  google.protobuf.Timestamp at = 5;
}

message CreateOrderRequest {
  string product_id = 1;

  Order.PaymentMethod payment_method = 2;
}

message CreateOrderResponse {
  Order order = 1;
}

message ListOrderRequest {
  string user_name = 1;
}

message ListOrderResponse {
  repeated Order orders = 1;
}
```

上記の通り、「注文作成」「注文一覧」のみができる簡単なAPIの定義になります。TSを利用している方にとってはおそらく違和感なく読みやすい記述方式で、`OpenAPI`と比較してもかなり可読性が高いと思います。

それぞれのプロパティには一意な数字を振る必要がありますが、これは`Protocol Buffers`がプロパティを名前でなく番号で把握しているためです。プロパティ名を変更してもシリアライズ後の結果は変わらないので、リファクタリングができる様になっています。

### `.proto` ファイルをコンパイルする

`protoc`を利用してコードを生成します。
生成コマンドは長くなるので、下記の通り`Makefile`にまとめます。

```shell
NPM_BIN=$(shell npm bin)
OUT_DIR="./gen"

# ツールのパス
NODE_PROTOC=$(NPM_BIN)/grpc_tools_node_protoc
NODE_PROTOC_PLUGIN="$(NPM_BIN)/grpc_tools_node_protoc_plugin"
PROTOC_GEN_TS="$(NPM_BIN)/protoc-gen-ts"

.PHONY: gen
gen:
	rm -rf $(OUT_DIR) && mkdir -p $(OUT_DIR)
	$(NODE_PROTOC) \
	--plugin="protoc-gen-ts=$(PROTOC_GEN_TS)" \
	--js_out="import_style=commonjs,binary:$(OUT_DIR)" \
	--grpc_out="grpc_js:$(OUT_DIR)" \
	--ts_out="service=grpc-node,mode=grpc-js:$(OUT_DIR)" \
	-I ../ \
	../proto/*.proto
```

長いコマンドなので、順を追って解説します。

まず実行するコマンドが、`$(NODE_PROTOC) = node_modules/.bin/grpc_tools_node_protoc` ですが、これは`protoc`の`npm`版です。
最初のオプションは`--plugin`ですが、生成される`.js`ファイルに対応する型定義ファイル(`.d.ts`)を生成するためのプラグインを指定します。公式でTS対応していないため、 [ts-protoc-gen](https://github.com/improbable-eng/ts-protoc-gen) をプライグインとして利用しています。
3種類の出力設定(`--js_out`, `--grpc_out`, `--ts_out`)はそれぞれ、モデル定義、`gRPC`のコード(クライアント、サーバの雛形)、双方の型定義ファイルの出力先になります。
最後に `-I ../ ../proto/*.proto` でコンパイルする`.proto`ファイルを指定します。

準備ができたので、コンパイルを実行してみましょう。`Makefile`を配置しているディレクトリで `make gen` を実行すると、`./gen` ディレクトリの配下に下記の4つのファイルが生成されます。

- `shop_grpc_pb.d.ts`
- `shop_grpc_pb.js` ← gRPCのコード
- `shop_pb.d.ts`
- `shop_pb.js` ← モデル定義

### `gRPC`サーバを実装する

生成したコードを利用してサーバを実装していきます。

まずはサーバの起動部分を記述していきます。

`./node-server.ts`

```typescript
// gRPCフレームワーク
import { Server, ServerCredentials } from '@grpc/grpc-js';
// protocで生成したjsファイル
import { ShopServiceService } from './gen/proto/shop_grpc_pb';

const startServer = () => {
  // サーバインスタンスを生成
  const server = new Server();

  // APIのハンドラを紐づける
  server.addService(
    ShopServiceService,
    // ↓ 後ほど実装する
    new ServerImplement( createOrder, listOrder ),
  );

  server.bindAsync(
    // http://localhost:9000 でアクセスできる様にする
    '0.0.0.0:9000',
    // SSLを利用しない場合の設定
    ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(error);
        return;
      }

      // サーバを起動する
      server.start();
      console.log(`server start, port: ${port}`);
    }
  )
}

startServer();
```

この部分はほぼテンプレになりますが、`protoc`で生成したコードとgRPCのフレームワークを利用しながらコードを実装していきます。

続いて `ServerImplement` クラスを実装していきます。

```typescript
import * as grpc from '@grpc/grpc-js';
import { IShopServiceServer } from './gen/proto/shop_grpc_pb';

class ServerImplement implements IShopServiceServer {
  [name: string]: grpc.UntypedHandleCall;
  constructor (
    public createOrder: IShopServiceServer['createOrder'],
    public listOrder: IShopServiceServer['listOrder'],
  ) {}
}
```

一例ですが、上記の様にすることでサーバの実装が`.proto`の定義と一致する様`TypeScript`の型でうまく縛ることができます。

続いては `ServerImplement` をnewする時に渡すハンドラを実装していきます。

```typescript
import { IShopServiceServer } from './gen/proto/shop_grpc_pb';
import { CreateOrderResponse, ListOrderResponse, Order } from './gen/proto/shop_pb';

const createOrder: IShopServiceServer['createOrder'] = ( call, callback ) => {
  console.log('[start]: createOrder');

  // orderを作成
  const order = new Order();
  order.setProductId(call.request.getProductId());
  order.setPaymentMethod(call.request.getPaymentMethod());
  order.setPrice(Math.round(Math.random() * 10_000));
  order.setBy('dummy-user-name');
  order.setAt(Timestamp.fromDate(new Date()));

  // responseオブジェクトを作成
  const response = new CreateOrderResponse();
  response.setOrder(order);
  orderList.push(order);

  // 第一引数がerror, 第二引数がレスポンス
  callback(null, response);
  console.log('[end]: createOrder');
}

const listOrder: IShopServiceServer['listOrder'] = ( call, callback ) => {
  console.log('[start]: listOrder');

  const response = new ListOrderResponse();
  response.setOrdersList(orderList.filter(order => {
    return order.getBy() === 'dummy-user-name';
  }));

  callback(null, response);
  console.log('[end]: listOrder');
}
```

`Order` や `CreateOrderResponse`などのモデルは `getter/setter` が生えているので、`setter`を利用して必要な値をセットしていきます(必須の値もsetterで登録しなければならないのは少し不安な部分ですが、、)。

以上で、サーバの実装が完成しました！

### クライアントを利用するコードを実装する

`IDL`を利用したAPI定義を活用する醍醐味の1つは型付きのクライアントを自動生成できる点ですね！`protoc`で生成されたコードを用いてAPIリクエストを実行して見たいと思います。

`node-client.ts`

```typescript
import { ShopServiceClient } from './gen/proto/shop_grpc_pb';
import { credentials } from '@grpc/grpc-js';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  ListOrderRequest,
  ListOrderResponse,
  Order
} from './gen/proto/shop_pb';
import * as dayjs from 'dayjs';

// APIクライアントを生成する
const createClient = () => {
  return new ShopServiceClient(
    'localhost:9000',
    credentials.createInsecure(), // SSLを利用しない場合の設定
  );
}

// 注文作成APIへリクエストする
const createOrderRequest = async (client: ShopServiceClient) => {
  // リクエストオブジェクトを作成
  const request = new CreateOrderRequest();
  request.setProductId( 'dummy-product-id' );
  request.setPaymentMethod( Order.PaymentMethod.CREDIT_CARD );

  const response = await new Promise<CreateOrderResponse>( ( resolve, reject ) => {
    // APIクライアントを利用して、gRPCエンドポイントにリクエストを実行する
    client.createOrder( request, ( error, response ) => {
      if ( error ) {
        console.error( 'エラーが発生しました。' );
        console.error( error );
        reject( error );
      }
      resolve( response );
    } );
  } );

  console.log( '注文作成 => 成功' );
  console.log( response.getOrder().toObject() );
};

// 注文一覧APIへリクエストする
const listOrderRequest = async (client: ShopServiceClient) => {
  const request = new ListOrderRequest();
  request.setUserName('dummy-user-name')

  const response = await new Promise<ListOrderResponse>( ( resolve, reject ) => {
    client.listOrder( request, ( error, response ) => {
      if ( error ) {
        console.error( 'エラーが発生しました。' );
        console.error( error );
        reject( error );
      }
      resolve( response );
    } );
  } );

  console.log( '注文一覧 => 成功' );
  console.log(
    // 戻り値のオブジェクトの型付けもリッチな感じ
    response
      .getOrdersList()
      .map(_ => _.toObject())
      .map(_ => ({
        ..._,
        at: dayjs.unix(_.at.seconds).format(),
      }))
  );
};

(async () => {
  const client = createClient();
  await createOrderRequest(client);
  await listOrderRequest(client);
  await client.close();
})().catch(console.error)
```

### 動作を確認する

基本的なサーバ・クライアントの実装が終わったので動作を確認してみます。TSファイルのコンパルを省略するため今回は `esbuild-register` を利用して実行してみます。

まずはサーバを起動します。

```bash
$ node -r esbuild-register node-server.ts
> grpc-with-ts-sample_case-when-ts-protoc-gen@1.0.0 start:server
> node -r esbuild-register node-server.ts

server start, port: 9000
```

9000番ポートでサーバ起動した旨メッセージが確認できます。

続いてクライアントを実行します。

```bash
$ node -r esbuild-register node-client.ts
> grpc-with-ts-sample_case-when-ts-protoc-gen@1.0.0 exec:client
> node -r esbuild-register node-client.ts

注文作成 => 成功
{
  productId: 'dummy-product-id',
  price: 2548,
  paymentMethod: 2,
  by: 'dummy-user-name',
  at: { seconds: 1639814743, nanos: 679000000 }
}
注文一覧 => 成功
[
  {
    productId: 'dummy-product-id',
    price: 2085,
    paymentMethod: 2,
    by: 'dummy-user-name',
    at: '2021-12-18T17:04:15+09:00'
  }
]
```

この通り、`gRPC`をNode.jsで実行することができました！2回目以降実行すと、注文一覧で返ってくる注文の数も増えていくことが確認できます。

## WEBブラウザから呼び出す

[全編](https://blog.hedrall.work/posts/grpc-what-20211216) で説明した通り、ブラウザから `gRPC` 通信を直接することはできないので、先ほど紹介した`Node.js`のクライアントとは全く別のクライアントが必要になります。以下ではブラウザから`gRPC`エンドポイントへのアクセスを、公式が出している `grpc-web` を利用して実現する方法を解説します。

完成したコードはサンプルレポジトリの[./grpc-web ディレクトリ配下](https://github.com/hedrall/grpc-with-ts-sample/tree/master/grpc-web) を参照してください。

### `grpc-web`を利用したクライアントの生成

`protoc`に何か追加でプライグインを挿す必要はありませんが、生成コマンドを以下の様にします。

`Makefile`

```shell
NPM_BIN=$(shell npm bin)
OUT_DIR="./gen"

# protocのパス
NODE_PROTOC=$(NPM_BIN)/grpc_tools_node_protoc

.PHONY: gen
gen:
	rm -rf $(OUT_DIR) && mkdir -p $(OUT_DIR)
	$(NODE_PROTOC) \
	--js_out=import_style=commonjs:$(OUT_DIR) \
	--grpc-web_out=import_style=typescript,mode=grpcwebtext:$(OUT_DIR) \
	-I ../ \
	../proto/*.proto
```

今回は `--grpc-web_out` を指定して、WEBクライアント用のコードを生成します。`grpc-web`は`TypeScript`に対応しているので、吐き出されるコードは`TypeScript`で実装されています。

- `shop_pb.d.ts`
- `shop_pb.js`
- `ShopServiceClientPb.ts`

### クライアントを利用するHTMLページを作成する

まずはHTMLファイルで読み込むスクリプトを作成します。

`./web-client.ts`

```typescript
// 8081番ポートが後述するプロキシの番号
const createClient = () => new ShopServiceClient( 'http://localhost:8081' );

const createOrderRequest = // Node.jsの時と同じ
const listOrderRequest = // Node.jsの時と同じ

// HTMLが読み込まれたタイミングで、APIリクエストをおこないます。
window.addEventListener('load', () => {
  const client = createClient();

  document.querySelector('button.order').addEventListener('click', async () => {
    await createOrderRequest(client);
  });

  document.querySelector('button.list').addEventListener('click', async () => {
    await listOrderRequest(client);
  });
});
```

`createOrderRequest`, `listOrderRequest`の実装自体は`Node.js`の場合と同じなので省略します。

続いて、フロントで利用するために`js`にバンドルしますが、今回は`esbuild`を利用します。

```shell
# ./bundle//web-client.js を作成して, ./public配下にシンボリックリンクを貼ります
.PHONY: build
build:
	rm -rf bundle
	node -r esbuild-register build.ts
	rm -f public/web-client.js
	ln bundle/web-client.js public/web-client.js
```

```typescript
import * as path from 'path';
// @ts-ignore
import dayjs from 'dayjs';
import { build } from 'esbuild';

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';

console.log(`${dayjs().format('HH:mm:ss')}: ビルド開始`);

build({
  define: {
    'process.env.NODE_ENV': JSON.stringify( NODE_ENV ),
  },
  entryPoints: [path.resolve(__dirname, 'web-client.ts'),],
  bundle: true,
  outfile: 'bundle/web-client.js',
  minify: !IS_DEV,
  legalComments: 'none',
  sourcemap: IS_DEV,
  platform: 'browser',
  target: ['chrome58'],
  treeShaking: true,
})
  .then(result => {
    console.log('===========================================');
    console.log(`${dayjs().format('HH:mm:ss')}: ビルド完了`);
    console.error('errors', result.errors);
  })
  .catch(() => process.exit(1));
```

HTMLファイルではjsバンドルを読み込むだけです。

`public/index.html`

```html
<html>
<haed><meta charset="UTF-8"></haed>
<body>
<h1>[grpc/grpc-web] のテスト</h1>

<div><button class="order">注文</button></div>
<pre class="order-result"></pre>

<div><button class="list">一覧</button></div>
<pre class="list-result"></pre>

<script src="web-client.js"></script>
</body>
</html>
```

### クライアントを利用するためのプロキシを準備する

`grpc-web`を利用したクライアントは、実際には`gRPC`通信をしておらず、`XHR`リクエストに`gRPC`通信に必要な情報をマッピングして送信します。そのため、クライアントとサーバの間に、`XHR` => `gRPC`に通信を変換するプロキシを置く必要があります。
`grpc-web`では `envoy` と言うプロキシを推奨しており、`brew install envoy` で簡単にインストール可能です。`envoy`の起動時には設定ファイルが必要になりますが、以下に例を載せます。

`envoy.yaml`

```yaml
admin:
  access_log_path: /tmp/admin_access.log
  address:
    socket_address: { address: 0.0.0.0, port_value: 9901 }

static_resources:
  listeners:
    - name: listener_0
      address:
        socket_address: { address: 127.0.0.1, port_value: 8081 }
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                codec_type: auto
                stat_prefix: ingress_http
                route_config:
                  name: local_route
                  virtual_hosts:
                    - name: local_service
                      domains: ["*"]
                      routes:
                        - match: { prefix: "/" }
                          route:
                            cluster: echo_service
                            timeout: 0s
                            max_stream_duration:
                              grpc_timeout_header_max: 0s
                      cors:
                        allow_origin_string_match:
                          - prefix: "*"
                        allow_methods: GET, PUT, DELETE, POST, OPTIONS
                        allow_headers: keep-alive,user-agent,cache-control,content-type,content-transfer-encoding,custom-header-1,x-accept-content-transfer-encoding,x-accept-response-streaming,x-user-agent,x-grpc-web,grpc-timeout
                        max_age: "1728000"
                        expose_headers: custom-header-1,grpc-status,grpc-message
                http_filters:
                  - name: envoy.filters.http.grpc_web
                  - name: envoy.filters.http.cors
                  - name: envoy.filters.http.router
  clusters:
    - name: echo_service
      connect_timeout: 0.25s
      type: logical_dns
      http2_protocol_options: {}
      lb_policy: round_robin
      load_assignment:
        cluster_name: cluster_0
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      address: 127.0.0.1
                      port_value: 9000
```

この設定で、`enovy` の8081番ポートで`XHR`を受け、`gRPC`に変換して9000番ポートに転送してくれます。

1. 動作を確認す

```bash
$ # jsをビルドする
$ make build
$ # envoyを起動する
$ envoy -c envoy.yaml
```

`envoy`を起動したら、先ほど作成したサーバも起動してから、public/index.htmlを開いてください。ボタンを押すと動作が確認できます。

![webの動作](https://user-images.githubusercontent.com/20538481/146635082-0fc36e16-ec11-4761-b9e7-f470c02f69e8.png)

## ストリームが使えるエンドポイントを作成する

`gRPC`の醍醐味の1つがストリームを利用できることです。ストリームには下記の3種類があります。

- `Client-side streams`
  - クライアントからサーバにストリームで送信する
  - ex) 画像のUpload
- `Server-side streams`
  - サーバからクライアントにストリームで送信する
  - ex) 画像のDownload
- `bi-directional streaming`
  - サーバからもクライアントからもストリームで送信する
  - ex) チャットルームでのやりとり

`grpc-web`では[Server-side streamsのみ対応しています](https://grpc.io/blog/state-of-grpc-web/#feature-sets) 。

本章では、`Node.js`を利用して`Client-side streams`で画像ファイルを分割して、ストリームでアップロードする場合の実装を紹介します。

完成したコードサンプルは [rich-sample](https://github.com/hedrall/grpc-with-ts-sample/tree/master/rich-sample) 配下を参照してください。

### .proto ファイルを作成

別途以下の様なAPI定義を作成します。

`./shop-with-stream.proto`

```protobuf
syntax = "proto3";
package shop;

import "google/protobuf/timestamp.proto";

service ShopService {
  rpc UploadImage(stream UploadImageRequest) returns (UploadImageResponse) {}
}

message UploadImageRequest {
  oneof file {
    string filename = 1;
    bytes data = 2;
  }
}

message UploadImageResponse {
  string id = 1;
  string filename = 2;
  google.protobuf.Timestamp completeDate = 3;
}
```

`UploadImageRequest` で `filename`か`data`のどちらか一方が入る様にしているのは、一連ストリームの中で、最初にファイル名、その後に画像の分割されたデータを送信することを想定しています。

### サーバのハンドラを実装する

(`.proto`ファイルからのコード生成や、サーバの基本的な実装は基本編と同じなので省略します。)

```typescript
const uploadImage: IShopServiceServer['uploadImage'] = ( call, callback ) => {
  console.log('[start]: uploadImage');

  // 受け取った画像の出力先
  const outputDir = path.resolve(__dirname, './server-image-store/server-received-image.jpg');
  let filename = '';

  // 受け取った画像データを書き込むストリーム
  const writeFileStream = fs.createWriteStream(outputDir);

  // なんらかのデータを受け取った時のイベント
  call.on('data', req /* ファイル名 or 画像データ */ => {

    // ファイル名であるか確認
    const filename = req.getFilename();
    if (filename) {
      console.log('on data', { filename });
      return;
    }

    // 画像データを受け取った場合
    const data = req.getData() /* Unit8Array */;

    // ストリームに書き込む
    writeFileStream.write(data);
    console.log('on data', { data: data.length});
  });

  // クライアントからのデータ送信が完了した時のイベント
  call.on('end', () => {
    // 書き込みのストリームも終了する
    writeFileStream.end();

    // レスポンスする
    const res = new UploadImageResponse();
    res.setId(Math.round(Math.random() * 10_000).toString())
    res.setFilename(filename);
    callback(null, res);

    console.log('[end]: uploadImage');
  });

  call.on('error', e => {
    console.log('on error', e);
  });
}
```

`JavaScript`でストリームの扱いに慣れている方は少ないかもしれませんが、ファイルの書き込みも簡単にストリーム化できるので、効率的なクライアントから受け取った内容をディスクに書き込こむことができます。

### クライアントの実装

```typescript
import { ShopServiceClient } from './gen/shop-with-stream_grpc_pb';
import { credentials } from '@grpc/grpc-js';
import {
  ListOrderRequest,
  UploadImageRequest
} from './gen/shop-with-stream_pb';
import * as fs from 'fs';
import * as path from 'path';

// クライアントを生成
const createClient = () => {
  return new ShopServiceClient(
    'localhost:9000',
    credentials.createInsecure(),
  );
}

const uploadImageRequest = async (client: ShopServiceClient) => {
  const request = new ListOrderRequest();
  request.setUserName('dummy-user-name');

  // APIリクエスト用のストリームを作成
  const apiRequestStream = client.uploadImage((err, value) => {
    // APIからレスポンスがあった際に呼ばれる
    if (err) console.error('APIエラー', err)
    console.log('API完了', {
      id: value.getId(),
      filename: value.getFilename(),
    });
  });

  const filename = 'beach-at-okinawa.jpg';
  const imagePath = path.resolve(__dirname, './images', filename);
  const kByte = 1024;

  // 画像を100kBづつ読み込むストリームを生成
  const readFileStream = fs.createReadStream(imagePath, { highWaterMark: 100 * kByte });

  // 最初にファイル名を送る
  const filenameRequest = new UploadImageRequest();
  filenameRequest.setFilename(filename);
  apiRequestStream.write(filenameRequest);

  // 画像データを送る
  let chunkNum = 1;
  readFileStream.on('data', chunk => {
    // 100kB読み出す毎に呼ばれる
    console.log('on data', {chunk: chunkNum++});
    // リクエストストリームに書き込む
    const dataRequest = new UploadImageRequest();
    dataRequest.setData(chunk);
    apiRequestStream.write( dataRequest );
  });

  readFileStream.on('end', () => {
    console.log('on end', '= 画像の読み込み完了')
    // APIに終了を伝える
    apiRequestStream.end();
  });

  readFileStream.on('error', e => {
    console.log('画像読み込みエラー', e);
  });
};

(async () => {
  const client = createClient();
  await uploadImageRequest(client);
  await client.close();
})().catch(console.error)
```

### 動作を試す

以下、サンプルレポジトリで実行する想定です。AC Photoから約2.7MBの沖縄の風景写真を拝借しております。

```bash
$ cd rich-sample
$ npm run exec:client
> grpc-with-ts-sample_case-when-ts-protoc-gen@1.0.0 exec:client
> node -r esbuild-register node-client.ts

on data { chunk: 1 }
on data { chunk: 2 }
on data { chunk: 3 }
on data { chunk: 4 }
on data { chunk: 5 }
on data { chunk: 6 }
on data { chunk: 7 }
on data { chunk: 8 }
on data { chunk: 9 }
on data { chunk: 10 }
on data { chunk: 11 }
on data { chunk: 12 }
on data { chunk: 13 }
on data { chunk: 14 }
on data { chunk: 15 }
on data { chunk: 16 }
on data { chunk: 17 }
on data { chunk: 18 }
on data { chunk: 19 }
on data { chunk: 20 }
on data { chunk: 21 }
on data { chunk: 22 }
on data { chunk: 23 }
on data { chunk: 24 }
on data { chunk: 25 }
on data { chunk: 26 }
on data { chunk: 27 }
on end = 画像の読み込み完了
API完了 { id: '4083', filename: '' }
```

この様に、100kBづつ27回に分けてデータが送信されたことが確認できました！

## まとめ

なんとなくGeekが集まって、`GO言語`でゴニョゴニョしているイメージがある`gRPC`かと思いますが、`Node.js`を利用した実装環境も比較的に充実しており親近感を持って触っていくことができました！実用に当たっては、`OpenAPI`などと比較しながら選定していく事になると思いますが、ストリームが扱える点など`gRPC`の特色もありますので、レパートリーの一つとして考えて行ければと思います。 また、WEBブラウザ対応はまだまだ弱い部分がありますので今後の動向が気になるところです。

大変長い記事になりましたが、読んで下さったかたは大変ありがとうございました。

  
