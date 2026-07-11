# Care Salon Fleur ウェブサイト

Care Salon Fleur（ケアサロン フルール）の公式ウェブサイトです。

## 概要

心と身体を癒すプライベートサロンのための、ナチュラルで優しい雰囲気のシングルページウェブサイトです。

## 特徴

- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに完全対応
- **スムーズなアニメーション**: スクロールに応じたフェードインエフェクト
- **シングルページレイアウト**: スムーズなページ内ナビゲーション
- **ナチュラルなデザイン**: 癒しのセージグリーン系の配色
- **オリジナルロゴ**: ブランドイメージに合わせたロゴデザインを使用

## ファイル構成

```
caresalonfleur/
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css      # スタイルシート
├── js/
│   └── script.js      # JavaScriptファイル
├── img/
│   └── caresalonfleur.png  # ロゴ画像
├── images/             # その他の写真素材用
└── README.md          # このファイル
```

## セクション構成

1. **HOME** - メインビジュアル
2. **ABOUT** - サロンについて（骨盤整体・よもぎ蒸し）
3. **MENU** - メニュー・料金
4. **SALON** - サロン紹介
5. **BLOG** - ブログ記事（WordPress連携、営業時間案内）
6. **ACCESS** - アクセス情報
7. **CONTACT** - お問い合わせ（LINE予約）

## 使用技術

- HTML5
- CSS3 (CSS Grid, Flexbox, CSS Variables)
- Vanilla JavaScript
- WordPress REST API（ブログ記事取得）
- Google Fonts (Noto Sans JP, Playfair Display)

## カラーパレット

- **プライマリー**: `#b8d4b0` (セージグリーン)
- **セカンダリー**: `#c8dcc4` (ミントグリーン)
- **アクセント**: `#8db88a` (フォレストグリーン)
- **背景**: `#f5f8f5` (グリーンアイボリー)

※ロゴのカラーリングに合わせたナチュラルで癒しのある配色です。

## 機能

### ナビゲーション

- 固定ヘッダー
- スムーズスクロール
- 現在のセクションのハイライト
- レスポンシブハンバーガーメニュー（モバイル）

### アニメーション

- スクロールに応じたフェードインアニメーション
- ホバーエフェクト
- スムーズなトランジション

## セットアップ

1. ファイルをMAMPの`htdocs`フォルダに配置
2. ブラウザで `http://localhost/caresalonfleur/` にアクセス

## カスタマイズ

### 写真素材の追加

現在、画像は`placeholder-image`として表示されています。
実際の写真に置き換える場合：

1. `images`フォルダを作成
2. 画像ファイルを配置
3. HTMLの該当箇所を以下のように置き換え：

```html
<!-- 置き換え前 -->
<div class="placeholder-image">MAIN VISUAL</div>

<!-- 置き換え後 -->
<img src="images/hero.jpg" alt="メインビジュアル">
```

### 色の変更

`css/style.css`の`:root`セクションでカラー変数を変更できます：

```css
:root {
    --primary-color: #c9a88f;
    --secondary-color: #d4b5a0;
    --accent-color: #b8956a;
    /* ... */
}
```

### テキストの編集

`index.html`内のテキストを直接編集してください。

### WordPress ブログ連携

サイトにWordPressのブログ記事を表示できます。

#### 設定方法

1. WordPressサイトを用意（既存のWordPressサイトでも可）
2. `js/script.js`の`WORDPRESS_API_URL`を設定：

```javascript
// 例: https://your-blog.com の場合
const WORDPRESS_API_URL = 'https://your-blog.com/wp-json/wp/v2/posts';
```

#### 仕様

- 最新3件の記事を自動取得
- アイキャッチ画像、タイトル、抜粋、投稿日を表示
- 記事カードをクリックするとWordPressの記事ページへ遷移
- レスポンシブ対応（PC: 3カラム、タブレット: 2カラム、モバイル: 1カラム）

#### トラブルシューティング

- **CORS エラーが出る場合**: WordPressサイトでCORSを許可する必要があります
- **記事が表示されない場合**: WordPress REST APIが有効か確認してください（通常はデフォルトで有効）

## ブラウザ対応

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- モバイルブラウザ

## 今後の追加予定

- [ ] 実際の写真素材の追加
- [x] WordPress ブログ連携
- [ ] 予約システムの統合
- [ ] お客様の声セクション

## ライセンス

このプロジェクトはCare Salon Fleurの所有物です。

---

**制作日**: 2024年
**バージョン**: 1.1.0 (WordPress連携機能追加)
