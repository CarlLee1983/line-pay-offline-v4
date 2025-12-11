/**
 * Payment method type
 */
export type PaymentMethod = 'CREDIT_CARD' | 'BALANCE' | 'POINT' | 'DISCOUNT'

/**
 * Payment provider type
 */
export type PaymentProvider = 'TSP' | 'PGW'

/**
 * Payment status for authorization queries
 */
export type PaymentStatus = 'AUTHORIZATION' | 'VOIDED_AUTHORIZATION' | 'EXPIRED_AUTHORIZATION'

/**
 * Transaction type
 */
export type TransactionType = 'PAYMENT' | 'PARTIAL_REFUND' | 'REFUND'

/**
 * Payment status for check status API
 */
export type CheckPaymentStatus = 'COMPLETE' | 'FAIL' | 'REFUND'

/**
 * Currency code (ISO 4217)
 */
export type Currency = 'USD' | 'TWD' | 'THB'

/**
 * Payment information
 */
export interface PaymentInfo {
  /**
   * Payment method
   */
  method: PaymentMethod

  /**
   * Payment amount
   */
  amount: number
}

/**
 * Product information in a package
 */
export interface ProductInfo {
  /**
   * Product name
   */
  name: string

  /**
   * Product quantity
   */
  quantity: number

  /**
   * Product price
   */
  price: number

  /**
   * Product image URL (optional)
   */
  imageUrl?: string
}

/**
 * Package information
 */
export interface PackageInfo {
  /**
   * Package ID
   */
  id: string

  /**
   * Package amount
   */
  amount: number

  /**
   * Products in this package
   */
  products: ProductInfo[]

  /**
   * User agreement (optional)
   */
  userAgreement?: {
    /**
     * Agreement URL
     */
    agreementUrl: string
  }
}

/**
 * Payment options
 */
export interface PaymentOptions {
  /**
   * Extra payment information (optional)
   */
  extra?: {
    /**
     * Branch ID (optional)
     */
    branchId?: string

    /**
     * Branch name (optional)
     */
    branchName?: string
  }

  /**
   * Payment settings (optional)
   */
  payment?: {
    /**
     * Whether to capture payment immediately
     * @default true
     */
    capture?: boolean

    /**
     * Payment type (optional)
     */
    payType?: 'NORMAL' | 'PREAPPROVED'
  }
}

/**
 * Promotion restriction information
 */
export interface PromotionRestriction {
  /**
   * Amount not eligible for promotion
   */
  useLimit: number
}

/**
 * Refund information
 */
export interface RefundInfo {
  /**
   * Refund transaction ID
   */
  refundTransactionId: number

  /**
   * Transaction type
   */
  transactionType: TransactionType

  /**
   * Refund amount (negative value)
   */
  refundAmount: number

  /**
   * Refund transaction date (ISO 8601)
   */
  refundTransactionDate: string
}
