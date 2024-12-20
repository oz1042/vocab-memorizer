# vocab-memorizer
- 言語学習において効果的に語彙を習得することを目的としたアプリです。
- 現在のバージョンの主要機能は、「タイマー機能」です。
- 単語帳(自作を含む)と一緒に使うことを想定しています。

## 使い方
1. https://oz1042.github.io/vocab-memorizer/ を開いてください。
2. 英単語の意味を確認しましょう。このとき、日本語訳ではなく単語が意味するイメージや感覚を想像してください。
3. 英単語のイメージ・感覚を頭に思い浮かべながら、発音記号(や音声)に沿って数回発音しましょう。<br>
コツは、成りきることです。恥ずかしさやカタカナ読みは辞めて、ネイティブに成りきりましょう。
4. 英単語を使って自分だけの文章を作ります。<br>
例文も参考にしながら、自分の日常や学校/仕事の場面などに合ったオリジナルの一文をつくります。<br>
はじめのうちは難しいので、時間が経過したら、次の単語に移ってください。何周もするうちに少しずつ作れるようになります。<br>

⭐️短期間に何度も単語に触れることが大事です！！！

## 開発の動機
開発の動機は二つあります。
1. まず、現在語学留学をしており、自分の考えを相手へより的確に伝えるために自分の語彙力を高めたいと思いました。<br>
語彙の増やし方を調べたところ、上記のような方法が数多く見られました。
しかし、上記の作業と一単語(一作業)あたりの目安の時間を同時に管理するのは困難だったため、音で時間の経過を知らせるタイマーを作ろうと考えました。<br>
2. 次に、JavaScriptの学習のためです。[memex-localstorage-version](https://github.com/oz1042/memex-localstorage-version)のリポジトリにも書きましたが、現在は自分の目標のためにテクノロジー、
特にJavaScriptを学んでいます。学習した知識を応用するプロジェクトの一つとして、上記のアイデアを思いついたので開発を始めました。

## 工夫した点
- 最初に使い方の説明表示を設けました。
- タイマーを見なくても、効果音を出力してユーザーに時間の経過を知らせることで、次のフェーズに移行できるような設計にしました。

## 学んだこと
- <追記中>

## 今後
- フェーズ毎に音声を変えて、ユーザーがどのフェーズにいるのかを音声的に区別して学習できるように変更する。
- 単語リスト(単語・発音記号・例文)を追加して表示できる機能を追加する。
- カレンダー形式でこのアプリを使用した日が塗りつぶされるような習慣化を促す視覚要素を追加する。
- データの扱いをLocalStorage以外にする。
