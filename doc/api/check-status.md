# 查詢付款狀態

`GET /v4/payments/orders/{orderId}/check`

查看付款狀態訊息。如果在付款請求過程中因 Read 逾時而沒有收到回應，可以透過呼叫該 API 查看支付狀態訊息。
**請將 Read 逾時設定為至少 20 秒以上。**

## Request

### Path Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `orderId` | String | 訂單號碼 (需 URL Encode) |

### Headers
* `Content-Type`: application/json
* `X-LINE-ChannelId`
* `X-LINE-Authorization`
* `X-LINE-Authorization-Nonce`
* `X-LINE-MerchantDeviceProfileId`

### Example
```bash
curl -X GET \
-H "Content-Type: application/json" \
-H "X-LINE-ChannelId: YOUR_CHANNEL_ID" \
-H "X-LINE-Authorization-Nonce: GENERATED_NONCE" \
-H "X-LINE-Authorization: PROCESSED_SIGNATURE" \
-H "X-LINE-MerchantDeviceProfileId: YOUR_DEVICE_PROFILE_ID" \
https://sandbox-api-pay.line.me/v4/payments/orders/merchant_test_order_1/check
```

## Response

### Success Response (200 OK)

| Field | Type | Description |
| :--- | :--- | :--- |
| `returnCode` | String | `0000` |
| `returnMessage` | String | `success` |
| `info` | Object | |
| `info.status` | String | `COMPLETE` / `FAIL` / `REFUND` ... |
| `info.transactionId` | String | |
| `info.orderId` | String | |

```json
{
    "returnCode": "0000",
    "returnMessage": "success",
    "info": {
        "status": "COMPLETE",
        "transactionId": 2019010112345678910,
        "orderId": "test_order_1",
        "transactionDate": "2019-01-01T01:01:00Z",
        "payInfo": [
            {
                "method": "CREDIT_CARD",
                "amount": 10
            },
            {
                "method": "POINT",
                "amount": 5
            }
        ],
        "paymentProvider": "TSP"
    }
}
```
