# LINE Pay Offline V4 Node.js SDK

[![npm version](https://img.shields.io/npm/v/line-pay-offline-v4.svg)](https://www.npmjs.com/package/line-pay-offline-v4)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

官方 LINE Pay Offline V4 API SDK for Node.js/Bun - 型別安全、零依賴，建構於 `line-pay-core-v4`。

**Language / 語言 / 言語 / ภาษา:**
[English](./README.md) | [繁體中文](./README_ZH.md) | [日本語](./README_JA.md) | [ไทย](./README_TH.md)

## 特色功能

✅ **完整支援 Offline API v4**
- 付款請求（使用 oneTimeKey 條碼）
- 查詢付款狀態
- 查詢授權資訊
- 請款（Capture）
- 取消授權（Void）
- 查詢付款詳情
- 退款

✅ **型別安全** - 完整的 TypeScript 支援，包含完整的型別定義  
✅ **零依賴** - 僅依賴 `line-pay-core-v4`  
✅ **現代化** - 專為 Node.js 18+ 和 Bun 打造  
✅ **雙模組** - 同時支援 ESM 和 CommonJS  
✅ **100% 測試覆蓋** - 完整的測試套件

## 安裝

```bash
npm install line-pay-offline-v4
```

使用 Bun：

```bash
bun add line-pay-offline-v4
```

使用 pnpm：

```bash
pnpm add line-pay-offline-v4
```

使用 yarn：

```bash
yarn add line-pay-offline-v4
```

## 快速開始

```typescript
import { LinePayOfflineClient } from 'line-pay-offline-v4'

const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: 'POS-001',
  merchantDeviceType: 'POS',
  env: 'sandbox', // 或 'production'
})

// 使用客戶的條碼請求付款
const payment = await client.requestPayment({
  amount: 100,
  currency: 'TWD',
  oneTimeKey: '12345678901245678', // 來自客戶的 LINE Pay 條碼
  orderId: 'ORDER-001',
})

console.log(payment.info.transactionId)
```

## API 文件

詳細的 API 文件請參閱 [`doc` 目錄](./doc/README.md)。

### 付款請求

```typescript
const payment = await client.requestPayment({
  amount: 100,
  currency: 'TWD',
  oneTimeKey: '12345678901245678',
  orderId: 'ORDER-001',
  packages: [{
    id: 'PKG-001',
    amount: 100,
    products: [{
      name: '商品名稱',
      quantity: 1,
      price: 100
    }]
  }]
})
```

### 查詢付款狀態

```typescript
const status = await client.checkPaymentStatus('ORDER-001')
console.log(status.info.status) // 'COMPLETE' | 'FAIL' | 'REFUND'
```

### 查詢授權資訊

```typescript
const auths = await client.queryAuthorizations({ orderId: 'ORDER-001' })
console.log(auths.info[0].payStatus) // 'AUTHORIZATION' | 'VOIDED_AUTHORIZATION'
```

### 請款

適用於授權與請款分離的流程：

```typescript
const capture = await client.capturePayment('ORDER-001', {
  amount: 100,
  currency: 'TWD'
})
```

### 取消授權

在請款前取消已授權的付款：

```typescript
await client.voidAuthorization('ORDER-001')
```

### 查詢付款詳情

```typescript
const details = await client.retrievePaymentDetails({ orderId: 'ORDER-001' })
console.log(details.info[0])
```

### 退款

```typescript
// 全額退款
await client.refundPayment('ORDER-001')

// 部分退款
await client.refundPayment('ORDER-001', {
  refundAmount: 50
})
```

## 錯誤處理

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
    // 處理逾時 - 使用 checkPaymentStatus 來驗證
    const status = await client.checkPaymentStatus(orderId)
  } else if (error instanceof LinePayError) {
    console.error('LINE Pay 錯誤:', error.returnCode, error.returnMessage)
    
    // 檢查錯誤類型
    if (error.isAuthError) {
      // 認證/授權錯誤 (1xxx)
    } else if (error.isPaymentError) {
      // 付款錯誤 (2xxx)
    } else if (error.isInternalError) {
      // 內部錯誤 (9xxx)
    }
  } else {
    console.error('未知錯誤:', error)
  }
}
```

## 設定選項

| 選項 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `channelId` | string | 是 | LINE Pay Channel ID |
| `channelSecret` | string | 是 | LINE Pay Channel Secret |
| `merchantDeviceProfileId` | string | 是 | 唯一的商家設備 ID |
| `merchantDeviceType` | string | 否 | 設備類型（預設："POS"）|
| `env` | 'production' \| 'sandbox' | 否 | 環境（預設：'sandbox'）|
| `timeout` | number | 否 | 請求逾時時間（毫秒，預設：20000）|

## 安全性最佳實踐

```typescript
// ❌ 不要：寫死密鑰
const client = new LinePayOfflineClient({
  channelId: '1234567890',
  channelSecret: 'my-secret-key', // 永遠不要寫死！
  merchantDeviceProfileId: 'POS-001'
})

// ✅ 請這樣做：使用環境變數
const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: process.env.MERCHANT_DEVICE_ID!
})
```

## 貢獻

詳細資訊請參閱 [CONTRIBUTING_ZH.md](./CONTRIBUTING_ZH.md)。

## 授權

MIT - 詳細資訊請參閱 [LICENSE](./LICENSE)。

## 相關套件

- [line-pay-core-v4](https://www.npmjs.com/package/line-pay-core-v4) - 核心工具和基礎客戶端
- [line-pay-v4](https://www.npmjs.com/package/line-pay-v4) - 線上付款 SDK
