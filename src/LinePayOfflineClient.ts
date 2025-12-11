import { LinePayBaseClient, type LinePayBaseResponse, LinePayConfigError } from 'line-pay-core-v4'
import type {
  AuthorizationInfo,
  CaptureRequest,
  CaptureResponseInfo,
  CheckPaymentStatusInfo,
  LinePayOfflineConfig,
  PaymentDetailsInfo,
  PaymentRequest,
  PaymentResponseInfo,
  RefundRequest,
  RefundResponseInfo,
} from './types'

/**
 * LINE Pay Offline Client
 *
 * Client for LINE Pay Offline API v4.
 * Handles payments through merchant terminal devices (POS systems).
 *
 * **Key Features:**
 * - ✅ Payment Request (Pay with oneTimeKey)
 * - ✅ Check Payment Status
 * - ✅ Query Authorization Information
 * - ✅ Capture Payment
 * - ✅ Void Authorization
 * - ✅ Retrieve Payment Details
 * - ✅ Refund
 *
 * @example
 * ```typescript
 * const client = new LinePayOfflineClient({
 *   channelId: process.env.LINE_PAY_CHANNEL_ID!,
 *   channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
 *   merchantDeviceProfileId: 'POS-001',
 *   merchantDeviceType: 'POS',
 *   env: 'sandbox'
 * })
 *
 * // Request payment with oneTimeKey (from customer's barcode)
 * const payment = await client.requestPayment({
 *   amount: 100,
 *   currency: 'TWD',
 *   oneTimeKey: '12345678901245678',
 *   orderId: 'ORDER-001'
 * })
 * ```
 */
export class LinePayOfflineClient extends LinePayBaseClient {
  /**
   * Merchant Device Profile ID
   * @private
   */
  private readonly merchantDeviceProfileId: string

  /**
   * Merchant Device Type
   * @private
   */
  private readonly merchantDeviceType: string

  /**
   * Creates a new LinePayOfflineClient instance
   *
   * @param config - Offline client configuration
   * @throws {LinePayConfigError} If merchantDeviceProfileId is empty
   */
  constructor(config: LinePayOfflineConfig) {
    super(config)

    const merchantDeviceProfileId = config.merchantDeviceProfileId.trim()
    if (merchantDeviceProfileId === '') {
      throw new LinePayConfigError('merchantDeviceProfileId is required and cannot be empty')
    }

    this.merchantDeviceProfileId = merchantDeviceProfileId
    this.merchantDeviceType = config.merchantDeviceType?.trim() || 'POS'
  }

  /**
   * Get device-specific headers for offline API requests
   *
   * @returns Headers object with device information
   * @private
   */
  private getDeviceHeaders(): Record<string, string> {
    return {
      'X-LINE-MerchantDeviceProfileId': this.merchantDeviceProfileId,
      'X-LINE-MerchantDeviceType': this.merchantDeviceType,
    }
  }

  /**
   * Payment Request
   *
   * Request payment using customer's one-time barcode.
   * The payment is completed after this API call (unless capture is separated).
   *
   * **Important:**
   * - Set read timeout to at least 40 seconds
   * - Verify payment amount matches requested amount
   * - If timeout occurs, use checkPaymentStatus to verify result
   *
   * @param request - Payment request data
   * @returns Payment response with transaction ID
   *
   * @example
   * ```typescript
   * const payment = await client.requestPayment({
   *   amount: 100,
   *   currency: 'TWD',
   *   oneTimeKey: '12345678901245678',
   *   orderId: 'ORDER-001',
   *   packages: [{
   *     id: 'PKG-001',
   *     amount: 100,
   *     products: [{
   *       name: 'Test Product',
   *       quantity: 1,
   *       price: 100
   *     }]
   *   }]
   * })
   * console.log(payment.info.transactionId)
   * ```
   */
  async requestPayment(request: PaymentRequest): Promise<LinePayBaseResponse<PaymentResponseInfo>> {
    return this.sendRequest<LinePayBaseResponse<PaymentResponseInfo>>(
      'POST',
      '/v4/payments/oneTimeKeys/pay',
      request,
      undefined,
      this.getDeviceHeaders()
    )
  }

  /**
   * Check Payment Status
   *
   * Query payment status by order ID.
   * Use this when read timeout occurs during payment request.
   *
   * **Important:**
   * - Set read timeout to at least 20 seconds
   *
   * @param orderId - Merchant order ID (URL encoded)
   * @returns Payment status information
   *
   * @example
   * ```typescript
   * const status = await client.checkPaymentStatus('ORDER-001')
   * console.log(status.info.status) // 'COMPLETE' | 'FAIL' | 'REFUND'
   * ```
   */
  async checkPaymentStatus(orderId: string): Promise<LinePayBaseResponse<CheckPaymentStatusInfo>> {
    const encodedOrderId = encodeURIComponent(orderId)
    return this.sendRequest<LinePayBaseResponse<CheckPaymentStatusInfo>>(
      'GET',
      `/v4/payments/orders/${encodedOrderId}/check`,
      undefined,
      undefined,
      this.getDeviceHeaders()
    )
  }

  /**
   * Query Authorization Information
   *
   * Query authorized or voided authorization details.
   * For captured or refunded payments, use retrievePaymentDetails instead.
   *
   * **Important:**
   * - Set read timeout to at least 20 seconds
   *
   * @param params - Query parameters (orderId or transactionId)
   * @returns Array of authorization information
   *
   * @example
   * ```typescript
   * const auths = await client.queryAuthorizations({ orderId: 'ORDER-001' })
   * console.log(auths.info[0].payStatus) // 'AUTHORIZATION' | 'VOIDED_AUTHORIZATION'
   * ```
   */
  async queryAuthorizations(params: {
    orderId?: string
    transactionId?: string
  }): Promise<LinePayBaseResponse<AuthorizationInfo[]>> {
    return this.sendRequest<LinePayBaseResponse<AuthorizationInfo[]>>(
      'GET',
      '/v4/payments/authorizations',
      undefined,
      params as Record<string, string>,
      this.getDeviceHeaders()
    )
  }

  /**
   * Capture Payment
   *
   * Execute capture for separated authorization and capture flow.
   * Must be called after requestPayment with capture=false.
   *
   * **Important:**
   * - Set read timeout to at least 20 seconds
   * - Capture amount can differ from authorized amount
   *
   * @param orderId - Merchant order ID (URL encoded)
   * @param request - Capture request data
   * @returns Capture response with transaction details
   *
   * @example
   * ```typescript
   * const capture = await client.capturePayment('ORDER-001', {
   *   amount: 100,
   *   currency: 'TWD'
   * })
   * console.log(capture.info.transactionId)
   * ```
   */
  async capturePayment(
    orderId: string,
    request: CaptureRequest
  ): Promise<LinePayBaseResponse<CaptureResponseInfo>> {
    const encodedOrderId = encodeURIComponent(orderId)
    return this.sendRequest<LinePayBaseResponse<CaptureResponseInfo>>(
      'POST',
      `/v4/payments/orders/${encodedOrderId}/capture`,
      request,
      undefined,
      this.getDeviceHeaders()
    )
  }

  /**
   * Void Authorization
   *
   * Cancel authorized payment before capture.
   * After capture, use refund instead.
   *
   * **Important:**
   * - Set read timeout to at least 20 seconds
   *
   * @param orderId - Merchant order ID (URL encoded)
   * @returns Void response
   *
   * @example
   * ```typescript
   * await client.voidAuthorization('ORDER-001')
   * ```
   */
  async voidAuthorization(orderId: string): Promise<LinePayBaseResponse> {
    const encodedOrderId = encodeURIComponent(orderId)
    return this.sendRequest<LinePayBaseResponse>(
      'POST',
      `/v4/payments/orders/${encodedOrderId}/void`,
      undefined,
      undefined,
      this.getDeviceHeaders()
    )
  }

  /**
   * Retrieve Payment Details
   *
   * Query captured or authorized payment details.
   * Can filter by orderId or transactionId.
   *
   * **Important:**
   * - Set read timeout to at least 20 seconds
   *
   * @param params - Query parameters (orderId or transactionId)
   * @returns Array of payment details
   *
   * @example
   * ```typescript
   * const details = await client.retrievePaymentDetails({ orderId: 'ORDER-001' })
   * console.log(details.info[0].refundList)
   * ```
   */
  async retrievePaymentDetails(params: {
    orderId?: string
    transactionId?: string
  }): Promise<LinePayBaseResponse<PaymentDetailsInfo[]>> {
    return this.sendRequest<LinePayBaseResponse<PaymentDetailsInfo[]>>(
      'GET',
      '/v4/payments',
      undefined,
      params as Record<string, string>,
      this.getDeviceHeaders()
    )
  }

  /**
   * Refund Payment
   *
   * Refund completed payment (after capture).
   * Supports both partial and full refund.
   *
   * **Important:**
   * - Set read timeout to at least 20 seconds
   * - For coupon/fee payments, partial refund may fail (error 1115)
   * - When promotionRestriction is specified, only full refund is supported
   *
   * @param orderId - Merchant order ID (URL encoded)
   * @param request - Refund request data (optional for full refund)
   * @returns Refund response with refund transaction ID
   *
   * @example
   * ```typescript
   * // Full refund
   * const refund = await client.refundPayment('ORDER-001')
   *
   * // Partial refund
   * const partialRefund = await client.refundPayment('ORDER-001', {
   *   refundAmount: 50
   * })
   * ```
   */
  async refundPayment(
    orderId: string,
    request?: RefundRequest
  ): Promise<LinePayBaseResponse<RefundResponseInfo>> {
    const encodedOrderId = encodeURIComponent(orderId)
    return this.sendRequest<LinePayBaseResponse<RefundResponseInfo>>(
      'POST',
      `/v4/payments/orders/${encodedOrderId}/refund`,
      request,
      undefined,
      this.getDeviceHeaders()
    )
  }
}
