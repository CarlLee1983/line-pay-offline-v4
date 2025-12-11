# LINE Pay Offline V4 Node.js SDK

[![npm version](https://img.shields.io/npm/v/line-pay-offline-v4.svg)](https://www.npmjs.com/package/line-pay-offline-v4)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

SDK อย่างเป็นทางการสำหรับ LINE Pay Offline V4 API สำหรับ Node.js/Bun - Type-safe, ไม่มี dependency, สร้างบน `line-pay-core-v4`

**Language / 語言 / 言語 / ภาษา:**
[English](./README.md) | [繁體中文](./README_ZH.md) | [日本語](./README_JA.md) | [ไทย](./README_TH.md)

## คุณสมบัติ

✅ **รองรับ Offline API v4 อย่างสมบูรณ์**
- คำขอชำระเงิน (ใช้ oneTimeKey barcode)
- ตรวจสอบสถานะการชำระเงิน
- สอบถามข้อมูลการอนุมัติ
- ยืนยันการชำระเงิน (Capture)
- ยกเลิกการอนุมัติ (Void)
- ดึงรายละเอียดการชำระเงิน
- คืนเงิน

✅ **Type-Safe** - รองรับ TypeScript อย่างสมบูรณ์พร้อมคำจำกัดความ type ครบถ้วน  
✅ **ไม่มี Dependency** - ขึ้นอยู่กับ `line-pay-core-v4` เท่านั้น  
✅ **ทันสมัย** - สร้างสำหรับ Node.js 18+ และ Bun  
✅ **Dual Package** - รองรับทั้ง ESM และ CommonJS  
✅ **Test Coverage 100%** - ชุดทดสอบครบถ้วน

## การติดตั้ง

```bash
npm install line-pay-offline-v4
```

ใช้ Bun:

```bash
bun add line-pay-offline-v4
```

ใช้ pnpm:

```bash
pnpm add line-pay-offline-v4
```

ใช้ yarn:

```bash
yarn add line-pay-offline-v4
```

## เริ่มต้นอย่างรวดเร็ว

```typescript
import { LinePayOfflineClient } from 'line-pay-offline-v4'

const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: 'POS-001',
  merchantDeviceType: 'POS',
  env: 'sandbox', // หรือ 'production'
})

// ขอชำระเงินด้วย barcode ของลูกค้า
const payment = await client.requestPayment({
  amount: 100,
  currency: 'THB',
  oneTimeKey: '12345678901245678', // จาก LINE Pay barcode ของลูกค้า
  orderId: 'ORDER-001',
})

console.log(payment.info.transactionId)
```

## เอกสาร API

สำหรับเอกสาร API ละเอียด ดูที่ [ไดเรกทอรี `doc`](./doc/README.md)

### คำขอชำระเงิน

```typescript
const payment = await client.requestPayment({
  amount: 100,
  currency: 'THB',
  oneTimeKey: '12345678901245678',
  orderId: 'ORDER-001',
  packages: [{
    id: 'PKG-001',
    amount: 100,
    products: [{
      name: 'ชื่อสินค้า',
      quantity: 1,
      price: 100
    }]
  }]
})
```

### ตรวจสอบสถานะการชำระเงิน

```typescript
const status = await client.checkPaymentStatus('ORDER-001')
console.log(status.info.status) // 'COMPLETE' | 'FAIL' | 'REFUND'
```

### สอบถามข้อมูลการอนุมัติ

```typescript
const auths = await client.queryAuthorizations({ orderId: 'ORDER-001' })
console.log(auths.info[0].payStatus) // 'AUTHORIZATION' | 'VOIDED_AUTHORIZATION'
```

### ยืนยันการชำระเงิน

สำหรับกระบวนการแยกการอนุมัติและการยืนยัน:

```typescript
const capture = await client.capturePayment('ORDER-001', {
  amount: 100,
  currency: 'THB'
})
```

### ยกเลิกการอนุมัติ

ยกเลิกการชำระเงินที่อนุมัติแล้วก่อนการยืนยัน:

```typescript
await client.voidAuthorization('ORDER-001')
```

### ดึงรายละเอียดการชำระเงิน

```typescript
const details = await client.retrievePaymentDetails({ orderId: 'ORDER-001' })
console.log(details.info[0])
```

### คืนเงิน

```typescript
// คืนเงินเต็มจำนวน
await client.refundPayment('ORDER-001')

// คืนเงินบางส่วน
await client.refundPayment('ORDER-001', {
  refundAmount: 50
})
```

## การจัดการข้อผิดพลาด

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
    // จัดการ timeout - ใช้ checkPaymentStatus เพื่อยืนยัน
    const status = await client.checkPaymentStatus(orderId)
  } else if (error instanceof LinePayError) {
    console.error('LINE Pay Error:', error.returnCode, error.returnMessage)
    
    // ตรวจสอบประเภทข้อผิดพลาด
    if (error.isAuthError) {
      // ข้อผิดพลาดการยืนยันตัวตน/การอนุมัติ (1xxx)
    } else if (error.isPaymentError) {
      // ข้อผิดพลาดการชำระเงิน (2xxx)
    } else if (error.isInternalError) {
      // ข้อผิดพลาดภายใน (9xxx)
    }
  } else {
    console.error('ข้อผิดพลาดที่ไม่รู้จัก:', error)
  }
}
```

## ตัวเลือกการกำหนดค่า

| ตัวเลือก | ประเภท | จำเป็น | คำอธิบาย |
|---------|--------|--------|---------|
| `channelId` | string | ใช่ | LINE Pay Channel ID |
| `channelSecret` | string | ใช่ | LINE Pay Channel Secret |
| `merchantDeviceProfileId` | string | ใช่ | ID อุปกรณ์ร้านค้าที่ไม่ซ้ำกัน |
| `merchantDeviceType` | string | ไม่ | ประเภทอุปกรณ์ (ค่าเริ่มต้น: "POS") |
| `env` | 'production' \| 'sandbox' | ไม่ | สภาพแวดล้อม (ค่าเริ่มต้น: 'sandbox') |
| `timeout` | number | ไม่ | timeout ของคำขอ (มิลลิวินาที, ค่าเริ่มต้น: 20000) |

## แนวปฏิบัติที่ดีด้านความปลอดภัย

```typescript
// ❌ อย่าทำ: เขียน secret ในโค้ด
const client = new LinePayOfflineClient({
  channelId: '1234567890',
  channelSecret: 'my-secret-key', // ห้ามเขียนในโค้ด!
  merchantDeviceProfileId: 'POS-001'
})

// ✅ ทำแบบนี้: ใช้ environment variables
const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: process.env.MERCHANT_DEVICE_ID!
})
```

## การมีส่วนร่วม

ดูรายละเอียดที่ [CONTRIBUTING.md](./CONTRIBUTING.md)

## สัญญาอนุญาต

MIT - ดูรายละเอียดที่ [LICENSE](./LICENSE)

## แพ็คเกจที่เกี่ยวข้อง

- [line-pay-core-v4](https://www.npmjs.com/package/line-pay-core-v4) - ยูทิลิตี้หลักและ base client
- [line-pay-v4](https://www.npmjs.com/package/line-pay-v4) - SDK ชำระเงินออนไลน์
