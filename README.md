# LINE Pay Offline V4 Node.js SDK

[![npm version](https://img.shields.io/npm/v/line-pay-offline-v4.svg)](https://www.npmjs.com/package/line-pay-offline-v4)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Official LINE Pay Offline V4 API SDK for Node.js/Bun - Type-safe, zero dependencies, built on `line-pay-core-v4`.

**Language / 語言 / 言語 / ภาษา:**
[English](./README.md) | [繁體中文](./README_ZH.md) | [日本語](./README_JA.md) | [ไทย](./README_TH.md)

## Features

✅ **Full Offline API v4 Support**
- Payment Request (with oneTimeKey barcode)
- Check Payment Status
- Query Authorization Information
- Capture Payment
- Void Authorization  
- Retrieve Payment Details
- Refund

✅ **Type-Safe** - Full TypeScript support with comprehensive type definitions  
✅ **Zero Dependencies** - Only depends on `line-pay-core-v4`  
✅ **Modern** - Built for Node.js 18+ and Bun  
✅ **Dual Package** - ESM and CommonJS support  
✅ **100% Test Coverage** - Comprehensive test suite

## Installation

```bash
npm install line-pay-offline-v4
```

or with Bun:

```bash
bun add line-pay-offline-v4
```

or with pnpm:

```bash
pnpm add line-pay-offline-v4
```

or with yarn:

```bash
yarn add line-pay-offline-v4
```

## Quick Start

```typescript
import { LinePayOfflineClient } from 'line-pay-offline-v4'

const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: 'POS-001',
  merchantDeviceType: 'POS',
  env: 'sandbox', // or 'production'
})

// Request payment with customer's barcode
const payment = await client.requestPayment({
  amount: 100,
  currency: 'TWD',
  oneTimeKey: '12345678901245678', // from customer's LINE Pay barcode
  orderId: 'ORDER-001',
})

console.log(payment.info.transactionId)
```

## API Documentation

For detailed API documentation, see the [`doc` directory](./doc/README.md).

### Payment Request

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
      name: 'Product Name',
      quantity: 1,
      price: 100
    }]
  }]
})
```

### Check Payment Status

```typescript
const status = await client.checkPaymentStatus('ORDER-001')
console.log(status.info.status) // 'COMPLETE' | 'FAIL' | 'REFUND'
```

### Query Authorization Information

```typescript
const auths = await client.queryAuthorizations({ orderId: 'ORDER-001' })
console.log(auths.info[0].payStatus) // 'AUTHORIZATION' | 'VOIDED_AUTHORIZATION'
```

### Capture Payment

For separated authorization and capture flow:

```typescript
const capture = await client.capturePayment('ORDER-001', {
  amount: 100,
  currency: 'TWD'
})
```

### Void Authorization

Cancel authorized payment before capture:

```typescript
await client.voidAuthorization('ORDER-001')
```

### Retrieve Payment Details

```typescript
const details = await client.retrievePaymentDetails({ orderId: 'ORDER-001' })
console.log(details.info[0])
```

### Refund

```typescript
// Full refund
await client.refundPayment('ORDER-001')

// Partial refund
await client.refundPayment('ORDER-001', {
  refundAmount: 50
})
```

## Error Handling

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
    // Handle timeout - use checkPaymentStatus to verify
    const status = await client.checkPaymentStatus(orderId)
  } else if (error instanceof LinePayError) {
    console.error('LINE Pay Error:', error.returnCode, error.returnMessage)
    
    // Check error type
    if (error.isAuthError) {
      // Authentication/authorization error (1xxx)
    } else if (error.isPaymentError) {
      // Payment error (2xxx)
    } else if (error.isInternalError) {
      // Internal error (9xxx)
    }
  } else {
    console.error('Unknown error:', error)
  }
}
```

## Configuration

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `channelId` | string | Yes | LINE Pay Channel ID |
| `channelSecret` | string | Yes | LINE Pay Channel Secret |
| `merchantDeviceProfileId` | string | Yes | Unique merchant device ID |
| `merchantDeviceType` | string | No | Device type (default: "POS") |
| `env` | 'production' \| 'sandbox' | No | Environment (default: 'sandbox') |
| `timeout` | number | No | Request timeout in ms (default: 20000) |

## Security Best Practices

```typescript
// ❌ DON'T: Hard-code secrets
const client = new LinePayOfflineClient({
  channelId: '1234567890',
  channelSecret: 'my-secret-key', // Never hard-code!
  merchantDeviceProfileId: 'POS-001'
})

// ✅ DO: Use environment variables
const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: process.env.MERCHANT_DEVICE_ID!
})
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE](./LICENSE) for details.

## Related Packages

- [line-pay-core-v4](https://www.npmjs.com/package/line-pay-core-v4) - Core utilities and base client
- [line-pay-v4](https://www.npmjs.com/package/line-pay-v4) - Online payment SDK
