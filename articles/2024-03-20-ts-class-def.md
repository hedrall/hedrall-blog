---
title: "[TypeScript]: モデル定義、上からするか、下からするか？"
emoji: "🤔"
type: "tech"
topics: ["typescript"]
published: true
---


  [自ブログ](https://blog.hedrall.work/posts/2024-03-20-ts-class-def)からの引用です。
  
  ## 概要

TypeScriptは非常に柔軟である一方で、様々な特徴があることで、実装方法に悩むことがあります。
その一つとして、モデルの定義方法が挙げられます。<br />
DDDなどを実践するにあたって、`class`構文や`Object Literal 型`など、モデル定義の方法が複数あるために、どのパターンで実装するべきか悩むことがあります。<br />
本記事では、TypeScriptでのモデル定義の方法について、まずはパターンを洗い出してから、有効なパターンを絞りこみ、その利点や具体的な実装パターンを整理していきます。

## 結論

**下**から、**Object Literal 型**で定義する方法がよさそう。

## モデル実装パターンの洗い出し

今回は以下の2軸でモデルの実装パターンを考えていきます。

1. 上から定義するか(継承)？下から定義するか？(Union型)
2. class(公称型) or Object Literal(構造的部分型)

`1.`に関して、「上から」「下から」というのは私の造語になりますが、
上からというのは一般的なオブジェクト志向言語のクラス定義方法で、はじめに親classを定義してから、継承(extend)を利用して子classを定義していく方法です。<br />
一方で、下からというのはUnion Typeの性質を使って、子クラスの組み合わせを全体の集合(クラス)として定義する方法です。

`2.`に関して、TypeScriptでは主に公称型の性質を持つ`class`構文と、主に構造的部分型の性質を持つ`Object Literal 型`の2つが存在します(詳細は後述)。
<br />
`1.`と`2.`の組み合わせとして、4通りの具体的なパターンを以下に示します。

題材としてはよくあるTodoタスク管理アプリを想定しており、
単純化して、`Todo`と`Completed`の2つのタスクを管理することを考えます。


**Case1**: 上からclassで定義

```typescript
class Task { constructor(public title: string) {} }
class TodoTask extends Task {}
class CompletedTask extends Task {
  constructor(title: string, public completedAt: Date) {
    super(title);
  }
}
```

**Case2**: 下からclassで定義

```typescript
class TodoTask {
  constructor(public title: string) {}
}
class CompletedTask {
  constructor(public title: string, public completedAt: Date) {}
}
type Task = TodoTask | CompletedTask;
```

**Case3**: 上から Object Literalで定義

```typescript
type Task = { title: string };
type TodoTask = Task;
type CompletedTask = Task & { completedAt: Date };
```

**Case4**: 下から Object Literalで定義

```typescript
type TodoTask = { title: string }
type CompletedTask = { title: string, completedAt: Date }
type Task = TodoTask | CompletedTask
```

本記事ではそれぞれのpros/consを整理していきます。

## 上から定義する方法の課題

上から定義する方法はCase1, Case3になります。
この方法の課題は、親から見てどのような子孫が存在するのかがわからない点です。

これにより、主に2つのデメリットが考えられます。<br />
1つはドキュメンテーションの低下です。

```typescript
class Task { constructor(public title: string) {} }
```

このような定義をみただけでは、Taskの定義が抽象的なため、実際にはどのようなTaskが存在しうるのかイメージすることができません。

一方で、

```typescript
type Task = TodoTask | CompletedTask;
```

このような定義がある場合は、Taskという概念が、具体的にTodoとCompletedから構成されることを明確に読み取ることができます。

このように、クラスは集合は表現するものであるため、集合の要素が明示されている定義方法の方がよりドキュメンテーションがよいと言えます。

2つ目は、ポリモーフィズムを利用した処理を記述する際に発生する課題です。
以下のように、Taskの種類ごとに処理を分岐させるケースを考えます。

```typescript
declare const task: Task;
switch (task) {
  case isTodo(task):
    console.log('これから');
    break;
  case isCompleted(task):
    console.log('完了');
    break;
  default:
    console.log('不明');
}
```

このようなコードがあった時に、`Case1`, `Case3`の上から実装するパターンだと網羅されているかどうかに確信を持つことができません。
例えば第3のTaskとして、`CanceledTask`を追加した場合に、静的に解析によってcaseが足りないことを検知することができないため、
似たような分岐処理が多数ある場合にバグを生みやすくなってしまします。

一方、`Case2`, `Case4`の定義方法を利用することで、静的解析で網羅されているかどうかを確認することができます。

```typescript
declare const task: Task;
switch (task) {
  case isTodo(task /* <= Todo or Completed */):
    console.log('これから');
    break;
  case isCompleted(task /* <= Completed */):
    console.log('完了');
    break;
  default: {
    const _exhaustiveCheck: never = task /* <= never */;
    break;
  }
}
```

> ちなみに、オブジェクト志向言語のKotlinでは、継承を利用する場合でも`sealed class`を利用することで、継承先を限定し、網羅性を保証することができますが、TypeScriptではそのような機能がありません。

## Classか？Object Literalか？

続いて、`Case2`, `Case4`の方法を比較していきます。

### 公称型と構造的部分型

まずは、TypeScriptの型システムについて簡単に確認します。
Kotlinなどの一般的なOOP言語の型システムは公称型と呼ばれるものです。
公称型は型チェックの際に、オブジェクトの血統に焦点が当てられます。
一方で、TypeScriptは構造的部分型という特徴があり、静的解析の際には血統ではなく構造に焦点が当てられます。

以下ではコードで例を示します。

```typescript
// 構造的部分型
class A { constructor(public prop1: string) {} }
class B { constructor(public prop1: string) {} }
const a = new A('hoge');
const b: B = a; // OK: aとbは構造が同じ
```

```kotlin
// Kotlinの世界 (公称型)
class A (val prop1: String)
class B (val prop1: String)
val a = A("test")
val b: B = a // NG: aとbはクラス(血統)が違う
```

### classは公称型と構造的部分型の中間的な性質を持つ

上記の通り、TypeScriptでは`class`構文を利用した場合でも、変数への代入時には構造的部分型の性質を持ちます。
一方で、条件分岐で型の絞り込みを行う際には構造的部分型の性質を持ちません。

```typescript
export class TodoTask {
  public type = 'Todo';
  constructor(public title: string) {}
}
export class CompletedTask {
  public type = 'Completed';
  constructor(public title: string, public completedAt: Date) {}
}
export type Task = TodoTask | CompletedTask;

declare const task: Task;
if (task.type === 'Todo') {
  console.log(task); // Task 絞り込まれない
}
```

一方で、以下のような絞り込みができるため、公称型の性質を持つと考えられます。

```typescript
if (task instanceof TodoTask) {
  console.log('TODO', task); // TodoTask 絞り込まれる
}
if (task.constructor === TodoTask) {
  console.log('TODO', task); // TodoTask 絞り込まれる
}
```

まとめると、class構文で定義した場合、公称型と構造的部分型の中間的な、いわば**中途半端な性質**を持つことになります。

ちなみに、代入の際も公称型として扱う方法は存在します。<br />
[こちら](https://typescriptbook.jp/reference/object-oriented/class/class-nominality)の通り、privateなプロパティをもつclassは公称型の性質を持ちます。

```typescript
class A1 {
  private type = 'A';
  constructor() {}
}
class A2 {
  private type = 'A';
  constructor() {}
}
const a2: A2 = new A1(); // NG
```

ただ、以下にあげる点などで公称型は使いづらいことがあります。

- switch文では(`instanceof`で)型を絞り込むことができない
  - [Issue](https://github.com/microsoft/TypeScript/issues/16035)
- `JSON.stringify()`でprivateなプロパティも出力される
  - ※ [`toJSON`関数を実装することで回避可能](https://ja.javascript.info/json#ref-1967)
- privateなフィールドがクラスの型に含まれるので、Constructorの引数の型に`A1`, `A2`を直接利用できない

## 結論、下からObject Literalで定義すると良さそう！

これまでの議論より、消去法的にCase4が最適な方法であると考えられました！

本記事ではTypeScriptの言語仕様や実装上の利点などの制約から検討してきましたが、
より具体的な知識をもって論理的に説明するされているすばらしい資料が公開されているので引用させていただきます。

[ビジネスロジックを「型」で表現するOOPのための関数型DDD](https://speakerdeck.com/yuitosato/functional-and-type-safe-ddd-for-oop)

この資料では、**代数的データ型**や**全域関数**と言った概念を用いて最適な方法が説明されており大変わかりやすいです。(脱帽です！)<br />
本記事で結論づけているCase4に関しても、この資料で説明されている手法と一致していると考えられます。
Kotlinの場合は、`sealed class`という機能を利用することで、特定のクラスの継承先を制限することができますが、
[TypeScriptではそのような機能はない](https://typescriptbook.jp/reference/object-oriented/class/final-sealed-class)ため、`Case4`の方法を利用することがベストな選択になると考えています。

## 具体的な実装パターン

では具体的にTypeScriptではどのような実装をすれば良いのかを検討していきます。

### 1.まずは単純な形

最小限の構成だと、このように表現ができます。

```typescript
type TodoTask = { title: string };
type CompletedTask = { title: string, completedAt: Date };
type Task = TodoTask | CompletedTask;
```

### 2.タグを追加

1.の状態だと、`Task`の絞り込みが少しわかりにくいことがあります。

```typescript
if ('completedAt' in task) {
  console.log('CompletedTask');
} else {
  console.log('TodoTask');
}
```

このように条件分岐自体は可能ですが、やや暗黙的だったり、判定の順番に影響を受けたりと問題が発生することがあります。
この場合はタグとなる要素を追加して解決します。

今回の場合は、Taskのstatusが各クラス固有になるので、statusを追加します。

```typescript
type TodoTask = { status: 'todo' /* <= 追加 */, title: string };
type CompletedTask = { status: 'completed' /* <= 追加 */, title: string, completedAt: Date };
type Task = TodoTask | CompletedTask;

declare const task: Task;
if (task.status === 'todo' /* わかりやすい分岐, 判定の順番も自由に変えられる */) {
  console.log('TodoTask');
} else if (task.status === 'completed') {
  console.log('CompletedTask');
}
````

### 3.関数を追加

TodoTaskは完了させて、CompletedTaskに変化させることができます。
この関数の命名を`complete()`とします。

まず、この関数をどこに設置するかですが、
TodoTaskのみ完了操作ができて、CompletedTaskをもう一度完了させることができないので、
TodoTaskに関連する関数として設置するのが適切です。

次に実装方法ですが、`class`構文を利用している場合は、インスタンスメソッドとして実装するのが一般的ですが、
Object Literal型を利用している場合は、[コンパニオンオブジェクト](https://typescriptbook.jp/tips/companion-object)というパターンを利用することで、classでいうstaticメソッドとして定義する方法があります。

```typescript
type TodoTask = { status: 'todo', title: string };
// ここを追加
const TodoTask = {
  complete(task: TodoTask): CompletedTask {
    return {status: 'completed', title: task.title, completedAt: new Date()};
  }
};
type CompletedTask = { status: 'completed', title: string, completedAt: Date };
type Task = TodoTask | CompletedTask;

// 利用側: タスクを完了させてみる
declare const task: Task;
if (task.status === 'todo') {
  const completedTask = TodoTask.complete(task);
}
```

### 4.TypeGuardを追加

型の絞り込みをスムーズにするために、TypeGuardを追加したいことがあります。
3.の関数追加と同様に見えますが、TypeGuardを利用する場面では、まだ`Task`の型が`TodoTask`か`CompletedTask`かがわからない想定であるため、
`Task`型に関連して関数を定義するのが適切です。
こちらも、コンパニオンオブジェクトパターンが利用できます。

```typescript
type TodoTask = { status: 'todo', title: string };
const TodoTask = {
  complete(task: TodoTask): CompletedTask {
    return {status: 'completed', title: task.title, completedAt: new Date()};
  }
};
type CompletedTask = { status: 'completed', title: string, completedAt: Date };
type Task = TodoTask | CompletedTask;
// ここを追加
const Task = {
  isTodo(task: Task): task is TodoTask {
    return task.status === 'todo';
  },
  isCompleted(task: Task): task is CompletedTask {
    return task.status === 'completed';
  }
};

declare const task: Task;
if (Task.isTodo(task)) {
  console.log('TodoTask');
} else if (Task.isCompleted(task)) {
  console.log('CompletedTask');
}
```

### 5.共通型の括りだし

Taskの子Taskたちには共通点があり、`title: string`を必ず持ちます。
そのため、共通する部分を括り出すことで、statusごとに**何が共通していて、何が違うのか**を明確に表現することができます。

```typescript
type Common = { title: string };
type TodoTask = Common & { status: 'todo' };
type CompletedTask = Common & { status: 'completed', completedAt: Date };
type Task = TodoTask | CompletedTask;
````

このように、Object Literal型はインターセクション型(`&`)を利用することで**Propertyレベルで因数分解**することができます。
必要に応じて分解してあげることで、より重要な特徴が際立った表現をすることができます。

### 6.子の型を制限する

Taskの子としては様々なタイプのTaskを追加することができますが、守って欲しいルールとして、必ず`status`を持って欲しいということがあります。
必要に応じて、statusの定義を`Common`にジェネリクスとして追加することでガイドしていくことができます。

```typescript
type Common<S extends string> = { status: S, title: string }
type TodoTask = Common<'todo'>;
type CompletedTask = Common<'completed'> & { completedAt: Date };
type Task = TodoTask | CompletedTask;
````

### 7.Enum型を利用する

Taskのstatusの型をどこかで再利用したくなることがあります。
その場合、オリジナルの定義はなるべく一箇所にまとめた方が保守性が高く無難であるため、
Task型から抜き出すのが良いと考えられます。

```typescript
type TaskStatus = Task['status'];
```

また、StatusはTaskレベルに存在する概念なので、個人的には`namespace`を利用してTaskという名前に閉じ込めてしまうとスッキリすると考えています。

```typescript
type Task = TodoTask | CompletedTask;
namespace Task { /* namespaceでもコンパニオンオブジェクトパターンが利用できる */
  export type Status = Task['status'];
}

// 利用側
import { Task } from './Task';
const status: Task.Status = 'todo';
```

namespaceの活用方法に関しては以前[記事](https://qiita.com/hedrall/items/61a322b8fc7b98208274)を書いているので、もしよければ参考にしてみて下さい

## まとめ

TypeScriptでのモデル定義方法について、上下(extends vs union)、class vs Object Literalの二軸から検討してみました。<br />
主にデメリットの部分から消去法的に絞り込んだ結果、パターン4の**下からObject Literal**で定義する方法が最適であると考えました。<br />
また、パターン4にも考慮点が存在するため、克服方法に関しても具体的な実装パターンを紹介しました。<br />
<br />
今回紹介したTaskのように、親クラスに対して子クラスが有限なバリエーションを持つ関係におけるモデル定義については非常に効果的な整理になると考えておりますので、ぜひ1つの参考にしていきますと幸いです。<br />
<br />
長文になりましたが、最後まで読んでいただきありがとうございました！<br />
何かの参考になれば幸いです。


  
