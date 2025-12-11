# 查詢付款明細

`GET /v4/payments`

查詢已授權或已請款的付款明細。可以使用參數查詢指定交易 ID (transaction ID) 或訂單號碼的付款明細，也可以只查詢交易訊息或訂單訊息。
**請將 Read 逾時設定為至少 20 秒以上。**

## Request

### Query Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `orderId` | String | 訂單號碼 |
| `transactionId` | String | 付款交易 ID |

### Example
```bash
curl -X GET \
-H "Content-Type: application/json" \
-H "X-LINE-ChannelId: YOUR_CHANNEL_ID" \
-H "X-LINE-Authorization-Nonce: GENERATED_NONCE" \
-H "X-LINE-Authorization: PROCESSED_SIGNATURE" \
-H "X-LINE-MerchantDeviceProfileId: YOUR_DEVICE_PROFILE_ID" \
https://sandbox-api-pay.line.me/v4/payments?orderId=20190408001
```

## Response

### Success Response (200 OK)

```json
{
    "returnCode": "0000",
    "returnMessage": "success",
    "info": [
        {
            "transactionId": 2019049910005496810,
            "transactionDate": "2019-04-08T06:31:19Z",
            "transactionType": "PAYMENT",
            "productName": "test product",
            "currency": "TWD",
            "payInfo": [
                {
                    "method": "CREDIT_CARD",
                    "amount": 100
                }
            ],
            "paymentProvider": "TSP",
            "refundList": [
                {
                    "refundTransactionId": 2019049910005497012,
                    "transactionType": "PARTIAL_REFUND",
                    "refundAmount": -1,
                    "refundTransactionDate": "2019-04-08T06:33:17Z"
                }
            ],
            "orderId": "20190408001"
        }
    ]
}
```
