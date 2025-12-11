# 請款

`POST /v4/payments/orders/{orderId}/capture`

執行請款。在分開付款授權和請款模式下，先[請求付款](./payment.md)取得授權後，合作商店呼叫此 API 執行請款，方能完成付款。
請款金額可能與請求付款時輸入的付款金額不同。
**請將 Read 逾時設定為至少 20 秒以上。**

## Request

### Path Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `orderId` | String | 訂單號碼 (需 URL Encode) |

### Headers
Standard headers (see [README](../README.md)).

### Body Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `amount` | Number | 付款金額 |
| `currency` | String | 付款貨幣代碼 (e.g. "TWD") |
| `promotionRestriction` | Object | (Optional) 促銷限制訊息 |

### Example
```bash
curl -X POST \
-H "Content-Type: application/json" \
-H "X-LINE-ChannelId: YOUR_CHANNEL_ID" \
-H "X-LINE-Authorization-Nonce: GENERATED_NONCE" \
-H "X-LINE-Authorization: PROCESSED_SIGNATURE" \
-H "X-LINE-MerchantDeviceProfileId: YOUR_DEVICE_PROFILE_ID" \
-d '{
    "amount": 100,
    "currency": "TWD"
}' \
https://sandbox-api-pay.line.me/v4/payments/orders/merchant_test_order_1/capture
```

## Response

### Success Response (200 OK)

```json
{
    "returnCode": "0000",
    "returnMessage": "success",
    "info": {
        "transactionId": 2019010112345678910,
        "orderId": "test_order_1",
        "transactionDate": "2019-01-01T01:01:00Z",
        "payInfo": [
            {
                "method": "CREDIT_CARD",
                "amount": 95
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

注意：若回傳 `1199`, `1280` 至 `1298` 代碼，付款將自動取消。
