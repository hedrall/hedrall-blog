---
title: "AlloyDB へ 踏み台サーバを経由して接続する方法"
emoji: "📗"
type: "tech"
topics: ["Google Cloud"]
published: true
publication_name: "righttouch"
---


  [自ブログ](https://blog.hedrall.work/posts/2024-11-01-alloydb-bastion)からの引用です。
  
  ## 概要

今働いている RightTouch では、Google Cloud の AlloyDB を利用して基盤の立ち上げを進めています。
AlloyDB には踏み台サーバを利用して接続してみたので、方法をまとめておきたいと思います。

## 構成

![image](https://github.com/user-attachments/assets/5b9a2995-477a-4b0b-a958-a2fd12a43037)

踏み台サーバは VPC 内にありますが、`Identity-Aware Proxy (IAP)` を利用することでローカルPCから簡単に SSH 接続することができます。

## VPC の 設定

自前で VPC を構築しているものとします。
AlloyDB は Google Cloud が管理するサービスプロデューサー VPC 上に存在するので、AlloyDB に接続するには、作成した VPC と VPC Peering をしておく必要があります。
詳細な手順は [こちら](https://blog.g-gen.co.jp/entry/cloudrun-with-alloydb-auth-proxy-using-sidecar#VPC-%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%AE%E4%BD%9C%E6%88%90) で詳しく解説されているので参照してください。

また、VPC に SSH 接続するためには、接続を許可するためのファイアウォールルールを追加する必要があります。
[参考](https://cloud.google.com/architecture/building-internet-connectivity-for-private-vms?hl=ja#create_firewall_rules_to_allow_tunneling)

こちらに記載の通り、`35.235.240.0/20` から 22 番ポートでのアクセスを許可してください。

![image](https://github.com/user-attachments/assets/a3f6f94c-5115-4e03-9986-e7097ab413b2)


## VM インスタンスの起動

コンソールで Compute Engine の画面から VM インスタンスを作成します。
サービスアカウントはデフォルトのもので問題ありません。

VPCに配置するため、<br/>
`詳細オプション - ネットワーキング - ネットワーク インターフェース` の設定を追加するようにしてください。

![image](https://github.com/user-attachments/assets/36877cfa-ea83-4b17-9aed-6627c1fe4824)

## サービスアカウントの作成

AlloyDB Auth Proxy が利用するサービスアカウントを作成します。必要な権限は以下の通りです。

- `roles/alloydb.databaseUser`
- `roles/serviceusage.serviceUsageConsumer`
- `roles/alloydb.client`

作成したら、JSON 形式で key ファイルをダウンロードしておきます。

また、AlloyDBにアクセスするユーザにもなるので、AlloyDB にユーザを追加しておきます。

![image](https://github.com/user-attachments/assets/59b5894a-0a5e-45f5-b84c-a7ab44b47aea)


## 踏み台サーバに SSH する

準備が整ったら、ローカルPCから踏み台サーバに SSH します。

```bash
gcloud compute ssh eva-knowledge-bastion-test --tunnel-through-iap
```

`--tunnel-through-iap` オプションをつけることで、IAP を経由して VPC 内のインスタンスに SSH 接続することができます。

ログインしたら、VMのセットアップをします。以下のコマンドで、`psql` と `Alloydb Auth Proxy` をインストールします。

```bash
sudo apt update
# psql
sudo apt install -y postgresql-client
# Alloydb Auth Proxy
wget https://storage.googleapis.com/alloydb-auth-proxy/v1.11.2/alloydb-auth-proxy.linux.amd64 -O alloydb-auth-proxy
chmod +x alloydb-auth-proxy
```

続いて、`Alloydb Auth Proxy` を起動します。

```bash
nohup ./alloydb-auth-proxy "{接続名}" \
  --address=0.0.0.0 \
  --port=5432 \
  --credentials-file {Creadential File} \
  --auto-iam-authn &
```

`{接続名}` は AlloyDB のインスタンスの `接続性 - 接続 URI` から取得してください。<br/>
`--credentials-file` には、作成したサービスアカウントの JSON ファイルパスを指定しますので、Uploadしておいてください。<br/>
`nohup` コマンドでバックグラウンドでプロセスを永続化します。<br/>

最後に、`psql` で AlloyDB に接続してみます。

```bash
psql -h localhost -p 5432 {DB名} -U {サービスアカウント名}
```

`{サービスアカウント名}` には `AlloyDB Auth Proxy` で指定したサービスアカウント名を指定してください。

これで、ローカルPCから AlloyDB に接続することができました。


# おわり

`IAP` や `AlloyDB` の IAM ユーザを利用することで、簡単に接続の管理ができました。
何かの参考になれば幸いです！



  
