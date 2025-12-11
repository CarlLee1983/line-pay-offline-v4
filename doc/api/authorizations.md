# 查詢授權訊息

`GET /v4/payments/authorizations`

在分開付款授權和請款的情況下查詢已授權或取消授權的明細。若要查看請款或退款的付款明細，請[查詢付款明細](./payment-details.md)。
**請將 Read 逾時設定為至少 20 秒以上。**

## Request

### Query Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `orderId` | String | 訂單號碼 |
| `transactionId` | String | 付款交易 ID |

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
https://sandbox-api-pay.line.me/v4/payments/authorizations?orderId=merchant_test_order_1
```

## Response

### Success Response (200 OK)

```json
{
    "returnCode": "0000",
    "returnMessage": "success",
    "info": [
        {
            "transactionId": 2019049910005498410,
            "transactionDate": "2019-04-08T07:02:38Z",
            "transactionType": "PAYMENT",
            "productName": "test product",
            "currency": "TWD",
            "paymentProvider": "TSP",
            "authorizationExpireDate": "2019-04-13T07:02:38Z",
            "payInfo": [
                {
                    "method": "CREDIT_CARD",
                    "amount": 100
                }
            ],
            "orderId": "20190408003",
            "payStatus": "VOIDED_AUTHORIZATION"
        }
    ]
}
```
