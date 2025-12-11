# LINE Pay Offline V4 Node.js SDK

[![npm version](https://img.shields.io/npm/v/line-pay-offline-v4.svg)](https://www.npmjs.com/package/line-pay-offline-v4)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

公式 LINE Pay Offline V4 API SDK for Node.js/Bun - 型安全、依存関係ゼロ、`line-pay-core-v4` をベースに構築。

**Language / 語言 / 言語 / ภาษา:**
[English](./README.md) | [繁體中文](./README_ZH.md) | [日本語](./README_JA.md) | [ไทย](./README_TH.md)

## 機能

✅ **Offline API v4 完全対応**
- 決済リクエスト（oneTimeKey バーコード使用）
- 決済ステータス確認
- 認可情報照会
- 決済確定（Capture）
- 認可取消（Void）
- 決済詳細照会
- 返金

✅ **型安全** - 包括的な型定義を含む完全な TypeScript サポート  
✅ **依存関係ゼロ** - `line-pay-core-v4` のみに依存  
✅ **モダン** - Node.js 18+ と Bun 向けに構築  
✅ **デュアルパッケージ** - ESM と CommonJS の両方をサポート  
✅ **テストカバレッジ 100%** - 包括的なテストスイート

## インストール

```bash
npm install line-pay-offline-v4
```

Bun を使用する場合：

```bash
bun add line-pay-offline-v4
```

pnpm を使用する場合：

```bash
pnpm add line-pay-offline-v4
```

yarn を使用する場合：

```bash
yarn add line-pay-offline-v4
```

## クイックスタート

```typescript
import { LinePayOfflineClient } from 'line-pay-offline-v4'

const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: 'POS-001',
  merchantDeviceType: 'POS',
  env: 'sandbox', // または 'production'
})

// 顧客のバーコードで決済をリクエスト
const payment = await client.requestPayment({
  amount: 100,
  currency: 'JPY',
  oneTimeKey: '12345678901245678', // 顧客の LINE Pay バーコードから
  orderId: 'ORDER-001',
})

console.log(payment.info.transactionId)
```

## API ドキュメント

詳細な API ドキュメントは [`doc` ディレクトリ](./doc/README.md) を参照してください。

### 決済リクエスト

```typescript
const payment = await client.requestPayment({
  amount: 100,
  currency: 'JPY',
  oneTimeKey: '12345678901245678',
  orderId: 'ORDER-001',
  packages: [{
    id: 'PKG-001',
    amount: 100,
    products: [{
      name: '商品名',
      quantity: 1,
      price: 100
    }]
  }]
})
```

### 決済ステータス確認

```typescript
const status = await client.checkPaymentStatus('ORDER-001')
console.log(status.info.status) // 'COMPLETE' | 'FAIL' | 'REFUND'
```

### 認可情報照会

```typescript
const auths = await client.queryAuthorizations({ orderId: 'ORDER-001' })
console.log(auths.info[0].payStatus) // 'AUTHORIZATION' | 'VOIDED_AUTHORIZATION'
```

### 決済確定

認可と決済確定が分離されたフローの場合：

```typescript
const capture = await client.capturePayment('ORDER-001', {
  amount: 100,
  currency: 'JPY'
})
```

### 認可取消

決済確定前に認可済みの決済をキャンセル：

```typescript
await client.voidAuthorization('ORDER-001')
```

### 決済詳細照会

```typescript
const details = await client.retrievePaymentDetails({ orderId: 'ORDER-001' })
console.log(details.info[0])
```

### 返金

```typescript
// 全額返金
await client.refundPayment('ORDER-001')

// 部分返金
await client.refundPayment('ORDER-001', {
  refundAmount: 50
})
```

## エラーハンドリング

```typescript
import { 
  LinePayError, 
  LinePayTimeoutError,
  LinePayConfigError 
} from 'line-pay-offline-v4'

try {
  const payment = await client.requestPayment({...})
} catch (error) {
  if (error instanceof LinePayTimeoutError) {
    // タイムアウトを処理 - checkPaymentStatus で確認
    const status = await client.checkPaymentStatus(orderId)
  } else if (error instanceof LinePayError) {
    console.error('LINE Pay エラー:', error.returnCode, error.returnMessage)
    
    // エラータイプを確認
    if (error.isAuthError) {
      // 認証/認可エラー (1xxx)
    } else if (error.isPaymentError) {
      // 決済エラー (2xxx)
    } else if (error.isInternalError) {
      // 内部エラー (9xxx)
    }
  } else {
    console.error('不明なエラー:', error)
  }
}
```

## 設定オプション

| オプション | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `channelId` | string | はい | LINE Pay Channel ID |
| `channelSecret` | string | はい | LINE Pay Channel Secret |
| `merchantDeviceProfileId` | string | はい | 一意の加盟店デバイス ID |
| `merchantDeviceType` | string | いいえ | デバイスタイプ（デフォルト："POS"）|
| `env` | 'production' \| 'sandbox' | いいえ | 環境（デフォルト：'sandbox'）|
| `timeout` | number | いいえ | リクエストタイムアウト（ミリ秒、デフォルト：20000）|

## セキュリティのベストプラクティス

```typescript
// ❌ NG：シークレットをハードコード
const client = new LinePayOfflineClient({
  channelId: '1234567890',
  channelSecret: 'my-secret-key', // 絶対にハードコードしないでください！
  merchantDeviceProfileId: 'POS-001'
})

// ✅ OK：環境変数を使用
const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: process.env.MERCHANT_DEVICE_ID!
})
```

## コントリビューション

詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ライセンス

MIT - 詳細は [LICENSE](./LICENSE) を参照してください。

## 関連パッケージ

- [line-pay-core-v4](https://www.npmjs.com/package/line-pay-core-v4) - コアユーティリティとベースクライアント
- [line-pay-v4](https://www.npmjs.com/package/line-pay-v4) - オンライン決済 SDK
