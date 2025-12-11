# 取消授權

`POST /v4/payments/orders/{orderId}/void`

取消已授權的付款。呼叫該 API 時，可透過分開付款授權和請款模式下請求付款後，取消已授權付款。請款後，完成付款，則無法透過端點取消，需進行[退款](./refund.md)處理。
**請將 Read 逾時設定為至少 20 秒以上。**

## Request

### Path Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `orderId` | String | 訂單號碼 (需 URL Encode) |

### Body
Empty

### Example
```bash
curl -X POST \
-H "Content-Type: application/json" \
-H "X-LINE-ChannelId: YOUR_CHANNEL_ID" \
-H "X-LINE-Authorization-Nonce: GENERATED_NONCE" \
-H "X-LINE-Authorization: PROCESSED_SIGNATURE" \
-H "X-LINE-MerchantDeviceProfileId: YOUR_DEVICE_PROFILE_ID" \
https://sandbox-api-pay.line.me/v4/payments/orders/merchant_test_order_1/void
```

## Response

### Success Response (200 OK)

```json
{
    "returnCode": "0000",
    "returnMessage": "success"
}
```
