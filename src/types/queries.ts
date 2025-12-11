import type {
  CheckPaymentStatus,
  Currency,
  PaymentInfo,
  PaymentProvider,
  PaymentStatus,
  PromotionRestriction,
  RefundInfo,
  TransactionType,
} from './common'

/**
 * Check payment status response info
 */
export interface CheckPaymentStatusInfo {
  /**
   * Payment status
   */
  status: CheckPaymentStatus

  /**
   * Transaction ID
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

/**
 * Authorization information item
 */
export interface AuthorizationInfo {
  /**
   * Transaction ID
   */
  transactionId: number

  /**
   * Transaction date (ISO 8601)
   */
  transactionDate: string

  /**
   * Transaction type
   */
  transactionType: TransactionType

  /**
   * Product name
   */
  productName: string

  /**
   * Currency code
   */
  currency: Currency

  /**
   * Payment provider
   */
  paymentProvider: PaymentProvider

  /**
   * Authorization expiration date (ISO 8601)
   */
  authorizationExpireDate: string

  /**
   * Payment information array
   */
  payInfo: PaymentInfo[]

  /**
   * Merchant order ID
   */
  orderId: string

  /**
   * Payment status
   */
  payStatus: PaymentStatus
}

/**
 * Capture request body
 */
export interface CaptureRequest {
  /**
   * Capture amount
   */
  amount: number

  /**
   * Currency code (ISO 4217)
   */
  currency: Currency

  /**
   * Promotion restriction (optional)
   */
  promotionRestriction?: PromotionRestriction
}

/**
 * Capture response info
 */
export interface CaptureResponseInfo {
  /**
   * Transaction ID
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

/**
 * Payment details information item
 */
export interface PaymentDetailsInfo {
  /**
   * Transaction ID
   */
  transactionId: number

  /**
   * Transaction date (ISO 8601)
   */
  transactionDate: string

  /**
   * Transaction type
   */
  transactionType: TransactionType

  /**
   * Product name
   */
  productName: string

  /**
   * Currency code
   */
  currency: Currency

  /**
   * Payment information array
   */
  payInfo: PaymentInfo[]

  /**
   * Payment provider
   */
  paymentProvider: PaymentProvider

  /**
   * Refund list (optional)
   */
  refundList?: RefundInfo[]

  /**
   * Merchant order ID
   */
  orderId: string
}

/**
 * Refund request body
 */
export interface RefundRequest {
  /**
   * Refund amount (optional)
   * If not specified, full refund will be processed
   */
  refundAmount?: number

  /**
   * Promotion restriction (optional)
   * When specified, partial refund is not supported
   */
  promotionRestriction?: PromotionRestriction
}

/**
 * Refund response info
 */
export interface RefundResponseInfo {
  /**
   * Refund transaction ID
   */
  refundTransactionId: number

  /**
   * Refund transaction date (ISO 8601)
   */
  refundTransactionDate: string
}
