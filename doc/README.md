# Offline API v4

LINE Pay Offline API 是一種 web API，用於使用合作商店終端機處理[實體付款](https://developers-pay.line.me/zh/offline)，並透過 HTTPS 進行通訊。

無論營運系統或服務執行語言為何，如果支援 HTTPS，就可以從任何地方呼叫 API。呼叫 API 時需要[提前準備](https://developers-pay.line.me/zh/offline/prerequisites)。

## 端點 (Endpoints)

API 的端點格式如下。

```
https://{host}/{apiPath}?{queryString}
```

*   **host**: API 伺服器的主機。
    *   [Sandbox](https://developers-pay.line.me/zh/sandbox) 伺服器（用於測試）：`sandbox-api-pay.line.me`
    *   正式伺服器（用於實際服務）：`api-pay.line.me`
*   **apiPath**: 要呼叫的 API 的路徑。可以在每個端點的詳細描述中進行檢查。API 版本也包含在 apiPath 中。
*   **queryString**: 一組查詢參數。每個參數都是一個 `key=value` 對，並用 `&` 區分。

### API 列表

*   [付款請求 POST /v4/payments/oneTimeKeys/pay](./api/payment.md)
*   [查詢付款狀態 GET /v4/payments/orders/{orderId}/check](./api/check-status.md)
*   [查詢授權訊息 GET /v4/payments/authorizations](./api/authorizations.md)
*   [請款 POST /v4/payments/orders/{orderId}/capture](./api/capture.md)
*   [取消授權 POST /v4/payments/orders/{orderId}/void](./api/void.md)
*   [查詢付款明細 GET /v4/payments](./api/payment-details.md)
*   [退款 POST /v4/payments/orders/{orderId}/refund](./api/refund.md)

## 請求 (Request)

API 請求遵循以下規則：

*   所有 API 請求均透過 HTTPS 傳送。
*   參數可以作為路徑 (path)、查詢 (query) 或 JSON 格式的請求傳遞至主體。

### 請求標頭 (Request Header)

API 請求通常需要以下共同標頭。

| Header Name | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | |
| `X-LINE-Authorization` | [HMAC](https://en.wikipedia.org/wiki/HMAC) | 簽名，詳見認證文件 |
| `X-LINE-Authorization-Nonce` | [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) | 隨機字串 |
| `X-LINE-ChannelId` | Channel ID | [通訊管道](https://developers-pay.line.me/zh/glossary#channel) ID |
| `X-LINE-MerchantDeviceProfileId` | String | 唯一識別商戶設備 ID (自行定義) |
| `X-LINE-MerchantDeviceType` | String | 商戶設備類型 (POS 等) |

### Request Body

某些端點可以在 request body 中傳遞參數。Request body 採用 JSON 格式。

範例：
```json
{
    "productName": "Brown pen",
    "amount": 1000,
    "currency": "TWD",
    "orderId": "Ord2018123100000001"
}
```

## 回應 (Response)

API 回應始終傳回 [HTTP 狀態碼](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) 200 OK，並傳遞由回應標頭和 response body 組成的請求結果。

### 回應標頭 (Response Header)

| Header Name | Value |
| :--- | :--- |
| `Content-Type` | `application/json` |

### Response Body

Response body 是一個包含詳細請求結果的 JSON 對象，包含以下欄位。

| Field | Description |
| :--- | :--- |
| `returnCode` | [結果程式碼](#結果程式碼) |
| `returnMessage` | 結果訊息 |
| `info` | 結果資料 (成功時回傳) |

### 成功回應

如果 API 請求處理沒有問題，則 response body 將 `returnCode` 設為 `0000`，並且任何結果資料都會在 `info` 欄位中傳遞。

範例：
```json
{
    "returnCode": "0000",
    "returnMessage": "OK",
    "info": {
        "orderId": "MKSI_M_20180904_1000001",
        "transactionId": 2018082512345678910,
        "payInfo": [
            {
                "method": "CREDIT_CARD",
                "amount": 900
            }
        ]
    }
}
```

### 錯誤回應

如果 API 請求出現錯誤，伺服器會認為失敗，並傳回與錯誤原因對應的結果碼。失敗的 API 請求的 response body 中傳遞錯誤訊息，不傳回 `info` 欄位。

範例：
```json
{
    "resultCode": 1104,
    "statusMessage": "Merchant not found."
}
```

## 結果程式碼 (Result Codes)

API 呼叫結果以結果程式碼 (`returnCode`) 和結果訊息 (`returnMessage`) 的形式提供。

| returnCode | returnMessage | Description |
| :--- | :--- | :--- |
| `0000` | - | 成功 |
| `1101` | - | 參數錯誤 |
| `1102` | - | 參數錯誤 |
| `1104` | - | Merchant not found |
| `1105` | - | Merchant not found |
| `1106` | - | Merchant error |
| `1110` | - | Not supported |
| `1124` | - | Amount error |
| `1133` | - | User error |
| `1141` | - | Account error |
| `1142` | - | Account error |
| `1145` | - | User Transaction Limit exceeded |
| `1150` | - | Transaction not found |
| `1152` | - | Transaction error |
| `1153` | - | Transaction error |
| `1155` | - | Transaction ID error |
| `1159` | - | Need to Check Payment Status |
| `1163` | - | Refund error |
| `1164` | - | Refund error |
| `1165` | - | Refund error |
| `1169` | - | Capture error |
| `1170` | - | User account balance error |
| `1172` | - | Order ID error |
| `1177` | - | Authorization error |
| `1178` | - | Authorization error |
| `1179` | - | Failed to process |
| `1183` | - | Payment amount error |
| `1184` | - | Payment amount error |
| `1198` | - | API call error |
| `1199` | - | Internal error |
| `1280` - `1298` | - | Internal Server Error (Auto Canceled) |
| `190X` | - | System Error |
| `1999` | - | Unknown Error |
| `2020` | - | Payment Error |
| `2021` | - | Payment Error |
| `2022` | - | Payment Error |
| `2023` | - | Payment Error |
| `2024` | - | Payment Error |
| `2042` | - | Refund could not be processed |
| `2101` - `2104` | - | Parameter Error |
| `9000` | - | Internal Error |
