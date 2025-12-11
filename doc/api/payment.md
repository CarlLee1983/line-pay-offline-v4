# 付款請求

`POST /v4/payments/oneTimeKeys/pay`

使用合作商店終端機傳遞的訊息向 LINE Pay 伺服器請求付款。付款訊息中請註明顧客要付款的產品訊息和顧客向合作商店終端機提供的我的條碼 (oneTimeKey) 訊息以及合作商店訊息。付款請求處理完畢即完成付款。

如果[分開付款授權和請款](https://developers-pay.line.me/zh/offline/implement-capture-separated-payment)，即使呼叫此 API，也不會完成付款，後續要請款或取消授權。

交易 ID 傳回回應，可以使用該交易 ID 請求取消授權、請款、退款。若發生 Read 逾時，無法接收回應，可查詢付款狀態確認結果，並確保交易 ID。

**請將 Read 逾時設定為至少 40 秒以上。**

若已完成付款，請務必確認回應中的付款總金額 (`info.payInfo[].amount`) 與所要求的付款金額一致。若金額不一致，需在 LINE Pay 請求退款。

## Request

### Headers
* `Content-Type`: application/json
* `X-LINE-ChannelId`
* `X-LINE-Authorization`
* `X-LINE-Authorization-Nonce`
* `X-LINE-MerchantDeviceProfileId`
* `X-LINE-MerchantDeviceType`

### Body Parameters

| Field | Type | Description |
| :--- | :--- | :--- |
| `amount` | Number | 付款金額 |
| `currency` | String | 付款貨幣代碼 (ISO 4217)。支援: "USD", "TWD", "THB" |
| `oneTimeKey` | String | LINE Pay 用戶的我的條碼。5分鐘內有效。 |
| `orderId` | String | 訂單號碼 (商戶定義) |
| `options` | Object | (Optional) 付款請求設定訊息 |
| `packages` | Array | (Optional) 套裝產品訊息 |

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
    "orderId": "merchant_test_order_1",
    "oneTimeKey": "12345678901245678",
    "currency": "TWD",
    "packages": [
        {
            "id": "29d2397-357f-3446-58315",
            "amount": 100,
            "products": [
                {
                    "name": "test product",
                    "quantity": 1,
                    "price": 100
                }
            ]
        }
    ]
}' \
https://sandbox-api-pay.line.me/v4/payments/oneTimeKeys/pay
```

## Response

### Success Response (200 OK)

| Field | Type | Description |
| :--- | :--- | :--- |
| `returnCode` | String | `0000` |
| `returnMessage` | String | `success` |
| `info` | Object | |
| `info.transactionId` | String | 交易 ID (19 digits) |
| `info.orderId` | String | 訂單號碼 |
| `info.transactionDate` | String | 交易時間 (ISO 8601) |
| `info.payInfo` | Array | 付款資訊 |

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

### Error Codes
Common error codes: 1101, 1102, 1104, 1105, 1106, 1150 (Transaction not found), etc.
See [Result Codes](../README.md#結果程式碼-result-codes) for details.
