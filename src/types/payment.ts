import type { Currency, PackageInfo, PaymentInfo, PaymentOptions, PaymentProvider } from './common'

/**
 * Payment request body
 */
export interface PaymentRequest {
  /**
   * Payment amount
   */
  amount: number

  /**
   * Currency code (ISO 4217)
   */
  currency: Currency

  /**
   * One-time key from user's barcode
   * Valid for 5 minutes
   */
  oneTimeKey: string

  /**
   * Merchant order ID
   */
  orderId: string

  /**
   * Payment options (optional)
   */
  options?: PaymentOptions

  /**
   * Package information (optional)
   */
  packages?: PackageInfo[]
}

/**
 * Payment response info
 */
export interface PaymentResponseInfo {
  /**
   * Transaction ID (19 digits)
   */
  transactionId: number

  /**
   * Merchant order ID
   */
  orderId: string

  /**
   * Transaction date (ISO 8601)
   */
  transactionDate: string

  /**
   * Payment information array
   */
  payInfo: PaymentInfo[]

  /**
   * Payment provider
   */
  paymentProvider: PaymentProvider
}
