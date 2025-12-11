# 退款

`POST /v4/payments/orders/{orderId}/refund`

完成付款請求或請款付款的退款。
**請將 Read 逾時設定為至少 20 秒以上。**

## Request

### Path Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `orderId` | String | 訂單號碼 (需 URL Encode) |

### Body Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `refundAmount` | Number | (Optional) 退款金額。若省略，將退還已付款的全部金額。 |
| `promotionRestriction` | Object | (Optional) 促銷限制訊息。指定此欄位時，將不支援部分退款，只能全額退款。 |

### Example
```bash
curl -X POST \
-H "Content-Type: application/json" \
-H "X-LINE-ChannelId: YOUR_CHANNEL_ID" \
-H "X-LINE-Authorization-Nonce: GENERATED_NONCE" \
-H "X-LINE-Authorization: PROCESSED_SIGNATURE" \
-H "X-LINE-MerchantDeviceProfileId: YOUR_DEVICE_PROFILE_ID" \
-d '{
    "refundAmount": 100
}' \
https://sandbox-api-pay.line.me/v4/payments/orders/merchant_test_order_1/refund
```

## Response

### Success Response (200 OK)

```json
{
    "returnCode": "0000",
    "returnMessage": "success",
    "info": {
        "refundTransactionId": 2018082512345678911,
        "refundTransactionDate": "2018-08-25T09:15:01Z"
    }
}
```

注意：使用優惠券交易或包含手續費的交易進行部分退款時，可能會傳回 `1115` 錯誤。這種情況，需要採取全額退款處理。
