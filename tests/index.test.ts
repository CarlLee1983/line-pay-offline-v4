import { describe, expect, test } from 'bun:test'
import type {
  AuthorizationInfo,
  CaptureRequest,
  CaptureResponseInfo,
  CheckPaymentStatus,
  CheckPaymentStatusInfo,
  Currency,
  LinePayOfflineConfig,
  PackageInfo,
  PaymentDetailsInfo,
  PaymentInfo,
  PaymentMethod,
  PaymentOptions,
  PaymentProvider,
  PaymentRequest,
  PaymentResponseInfo,
  PaymentStatus,
  ProductInfo,
  PromotionRestriction,
  RefundInfo,
  RefundRequest,
  RefundResponseInfo,
  TransactionType,
} from '../src'
import {
  LinePayConfigError,
  LinePayError,
  LinePayOfflineClient,
  LinePayTimeoutError,
  LinePayUtils,
  LinePayValidationError,
} from '../src'

describe('Module Exports', () => {
  test('should export LinePayOfflineClient', () => {
    expect(LinePayOfflineClient).toBeDefined()
    expect(typeof LinePayOfflineClient).toBe('function')
  })

  test('should export error classes from core', () => {
    expect(LinePayError).toBeDefined()
    expect(LinePayTimeoutError).toBeDefined()
    expect(LinePayConfigError).toBeDefined()
  })

  test('should be able to create client instance', () => {
    const client = new LinePayOfflineClient({
      channelId: 'test',
      channelSecret: 'test',
      merchantDeviceProfileId: 'POS-001',
    })
    expect(client).toBeInstanceOf(LinePayOfflineClient)
  })

  test('should export all type definitions', () => {
    // These are compile-time checks - if the types don't exist, this file won't compile
    const _config: LinePayOfflineConfig = {
      channelId: 'test',
      channelSecret: 'test',
      merchantDeviceProfileId: 'POS-001',
    }

    const _paymentMethod: PaymentMethod = 'CREDIT_CARD'
    const _paymentProvider: PaymentProvider = 'TSP'
    const _paymentStatus: PaymentStatus = 'AUTHORIZATION'
    const _transactionType: TransactionType = 'PAYMENT'
    const _checkStatus: CheckPaymentStatus = 'COMPLETE'
    const _currency: Currency = 'TWD'

    const _paymentInfo: PaymentInfo = {
      method: 'CREDIT_CARD',
      amount: 100,
    }

    const _productInfo: ProductInfo = {
      name: 'Test',
      quantity: 1,
      price: 100,
    }

    const _packageInfo: PackageInfo = {
      id: 'PKG-001',
      amount: 100,
      products: [_productInfo],
    }

    const _paymentOptions: PaymentOptions = {
      payment: { capture: true },
    }

    const _promotionRestriction: PromotionRestriction = {
      useLimit: 50,
    }

    const _paymentRequest: PaymentRequest = {
      amount: 100,
      currency: 'TWD',
      oneTimeKey: '12345',
      orderId: 'ORDER-001',
    }

    const _paymentResponse: PaymentResponseInfo = {
      transactionId: 123,
      orderId: 'ORDER-001',
      transactionDate: '2024-01-01',
      payInfo: [],
      paymentProvider: 'TSP',
    }

    const _checkStatusInfo: CheckPaymentStatusInfo = {
      status: 'COMPLETE',
      transactionId: 123,
      orderId: 'ORDER-001',
      transactionDate: '2024-01-01',
      payInfo: [],
      paymentProvider: 'TSP',
    }

    const _authInfo: AuthorizationInfo = {
      transactionId: 123,
      transactionDate: '2024-01-01',
      transactionType: 'PAYMENT',
      productName: 'Test',
      currency: 'TWD',
      paymentProvider: 'TSP',
      authorizationExpireDate: '2024-01-08',
      payInfo: [],
      orderId: 'ORDER-001',
      payStatus: 'AUTHORIZATION',
    }

    const _captureRequest: CaptureRequest = {
      amount: 100,
      currency: 'TWD',
    }

    const _captureResponse: CaptureResponseInfo = {
      transactionId: 123,
      orderId: 'ORDER-001',
      transactionDate: '2024-01-01',
      payInfo: [],
      paymentProvider: 'TSP',
    }

    const _paymentDetails: PaymentDetailsInfo = {
      transactionId: 123,
      transactionDate: '2024-01-01',
      transactionType: 'PAYMENT',
      productName: 'Test',
      currency: 'TWD',
      payInfo: [],
      paymentProvider: 'TSP',
      orderId: 'ORDER-001',
    }

    const _refundInfo: RefundInfo = {
      refundTransactionId: 456,
      transactionType: 'REFUND',
      refundAmount: -100,
      refundTransactionDate: '2024-01-02',
    }

    const _refundRequest: RefundRequest = {
      refundAmount: 50,
    }

    const _refundResponse: RefundResponseInfo = {
      refundTransactionId: 456,
      refundTransactionDate: '2024-01-02',
    }

    // If we get here, all types are exported correctly
    expect(true).toBe(true)
  })

  test('should export LinePayUtils class', () => {
    expect(LinePayUtils).toBeDefined()
    expect(typeof LinePayUtils.generateSignature).toBe('function')
    expect(typeof LinePayUtils.verifySignature).toBe('function')
    expect(typeof LinePayUtils.isValidTransactionId).toBe('function')
    expect(typeof LinePayUtils.validateTransactionId).toBe('function')
    expect(typeof LinePayUtils.buildQueryString).toBe('function')
    expect(typeof LinePayUtils.parseConfirmQuery).toBe('function')
  })

  test('should export LinePayValidationError class', () => {
    expect(LinePayValidationError).toBeDefined()
    const error = new LinePayValidationError('Test validation error', 'testField')
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(LinePayValidationError)
    expect(error.name).toBe('LinePayValidationError')
    expect(error.message).toBe('Test validation error')
    expect(error.field).toBe('testField')
  })
})

describe('LinePayUtils', () => {
  describe('generateSignature', () => {
    test('should generate consistent signature', () => {
      const secret = 'test-secret'
      const uri = '/v4/payments/oneTimeKeys/pay'
      const body = JSON.stringify({ amount: 100, currency: 'TWD' })
      const nonce = 'test-nonce-12345'

      const signature1 = LinePayUtils.generateSignature(secret, uri, body, nonce)
      const signature2 = LinePayUtils.generateSignature(secret, uri, body, nonce)

      expect(signature1).toBe(signature2)
      expect(typeof signature1).toBe('string')
      expect(signature1.length).toBeGreaterThan(0)
    })

    test('should generate different signature for different inputs', () => {
      const secret = 'test-secret'
      const uri = '/v4/payments/oneTimeKeys/pay'
      const body = JSON.stringify({ amount: 100, currency: 'TWD' })

      const signature1 = LinePayUtils.generateSignature(secret, uri, body, 'nonce-1')
      const signature2 = LinePayUtils.generateSignature(secret, uri, body, 'nonce-2')

      expect(signature1).not.toBe(signature2)
    })

    test('should support queryString parameter', () => {
      const secret = 'test-secret'
      const uri = '/v4/payments'
      const body = ''
      const nonce = 'test-nonce'

      const signatureWithQuery = LinePayUtils.generateSignature(
        secret,
        uri,
        body,
        nonce,
        'orderId=ORDER-001'
      )
      const signatureWithoutQuery = LinePayUtils.generateSignature(secret, uri, body, nonce)

      expect(signatureWithQuery).not.toBe(signatureWithoutQuery)
    })
  })

  describe('verifySignature', () => {
    test('should verify valid signature', () => {
      const secret = 'test-secret'
      const uri = '/v4/payments'
      const body = ''
      const nonce = 'test-nonce'

      const data = `${secret}${uri}${body}${nonce}`
      const signature = LinePayUtils.generateSignature(secret, uri, body, nonce)

      const isValid = LinePayUtils.verifySignature(secret, data, signature)
      expect(isValid).toBe(true)
    })

    test('should reject invalid signature', () => {
      const secret = 'test-secret'
      const data = 'test-secret/v4/paymentstest-nonce'
      const invalidSignature = 'invalid-signature'

      const isValid = LinePayUtils.verifySignature(secret, data, invalidSignature)
      expect(isValid).toBe(false)
    })

    test('should reject signature with different length', () => {
      const secret = 'test-secret'
      const data = 'test-data'
      const shortSignature = 'short'

      const isValid = LinePayUtils.verifySignature(secret, data, shortSignature)
      expect(isValid).toBe(false)
    })
  })

  describe('isValidTransactionId', () => {
    test('should return true for valid 19-digit transaction ID', () => {
      expect(LinePayUtils.isValidTransactionId('1234567890123456789')).toBe(true)
    })

    test('should return false for too short ID', () => {
      expect(LinePayUtils.isValidTransactionId('123456789')).toBe(false)
    })

    test('should return false for too long ID', () => {
      expect(LinePayUtils.isValidTransactionId('12345678901234567890')).toBe(false)
    })

    test('should return false for non-numeric ID', () => {
      expect(LinePayUtils.isValidTransactionId('123456789012345678a')).toBe(false)
    })
  })

  describe('validateTransactionId', () => {
    test('should not throw for valid 19-digit transaction ID', () => {
      expect(() => {
        LinePayUtils.validateTransactionId('1234567890123456789')
      }).not.toThrow()
    })

    test('should throw for invalid transaction ID', () => {
      expect(() => {
        LinePayUtils.validateTransactionId('12345')
      }).toThrow('Invalid transactionId format')
    })
  })

  describe('buildQueryString', () => {
    test('should build query string from params', () => {
      const query = LinePayUtils.buildQueryString({ orderId: 'ORDER-001', foo: 'bar' })
      expect(query).toContain('?')
      expect(query).toContain('orderId=ORDER-001')
      expect(query).toContain('foo=bar')
    })

    test('should return empty string for undefined params', () => {
      expect(LinePayUtils.buildQueryString(undefined)).toBe('')
    })

    test('should return empty string for empty params', () => {
      expect(LinePayUtils.buildQueryString({})).toBe('')
    })
  })

  describe('parseConfirmQuery', () => {
    test('should parse transactionId and orderId', () => {
      const result = LinePayUtils.parseConfirmQuery({
        transactionId: '1234567890123456789',
        orderId: 'ORDER-001',
      })
      expect(result.transactionId).toBe('1234567890123456789')
      expect(result.orderId).toBe('ORDER-001')
    })

    test('should handle array values for transactionId', () => {
      const result = LinePayUtils.parseConfirmQuery({
        transactionId: ['1234567890123456789', '9876543210987654321'],
        orderId: 'ORDER-001',
      })
      expect(result.transactionId).toBe('1234567890123456789')
    })

    test('should handle array values for orderId', () => {
      const result = LinePayUtils.parseConfirmQuery({
        transactionId: '1234567890123456789',
        orderId: ['ORDER-001', 'ORDER-002'],
      })
      expect(result.orderId).toBe('ORDER-001')
    })

    test('should throw when transactionId is missing', () => {
      expect(() => {
        LinePayUtils.parseConfirmQuery({ orderId: 'ORDER-001' })
      }).toThrow('Missing transactionId')
    })

    test('should throw when transactionId is empty string', () => {
      expect(() => {
        LinePayUtils.parseConfirmQuery({ transactionId: '', orderId: 'ORDER-001' })
      }).toThrow('Missing transactionId')
    })

    test('should not include orderId if not provided', () => {
      const result = LinePayUtils.parseConfirmQuery({
        transactionId: '1234567890123456789',
      })
      expect(result.transactionId).toBe('1234567890123456789')
      expect(result.orderId).toBeUndefined()
    })
  })
})

describe('LinePayError', () => {
  describe('isAuthError', () => {
    test('should return true for 1xxx error codes', () => {
      const error = new LinePayError('1104', 'Merchant not found', 401)
      expect(error.isAuthError).toBe(true)
    })

    test('should return false for non-1xxx error codes', () => {
      const error = new LinePayError('2101', 'Parameter error', 400)
      expect(error.isAuthError).toBe(false)
    })
  })

  describe('isPaymentError', () => {
    test('should return true for 2xxx error codes', () => {
      const error = new LinePayError('2101', 'Parameter error', 400)
      expect(error.isPaymentError).toBe(true)
    })

    test('should return false for non-2xxx error codes', () => {
      const error = new LinePayError('1104', 'Merchant not found', 401)
      expect(error.isPaymentError).toBe(false)
    })
  })

  describe('isInternalError', () => {
    test('should return true for 9xxx error codes', () => {
      const error = new LinePayError('9000', 'Internal error', 500)
      expect(error.isInternalError).toBe(true)
    })

    test('should return false for non-9xxx error codes', () => {
      const error = new LinePayError('2101', 'Parameter error', 400)
      expect(error.isInternalError).toBe(false)
    })
  })

  describe('toJSON', () => {
    test('should convert error to JSON object', () => {
      const error = new LinePayError('1104', 'Merchant not found', 401, '{"error":"details"}')
      const json = error.toJSON()

      expect(json.name).toBe('LinePayError')
      expect(json.returnCode).toBe('1104')
      expect(json.returnMessage).toBe('Merchant not found')
      expect(json.httpStatus).toBe(401)
      expect(json.rawResponse).toBe('{"error":"details"}')
      expect(json.message).toContain('1104')
      expect(json.message).toContain('Merchant not found')
    })

    test('should be JSON serializable', () => {
      const error = new LinePayError('2101', 'Parameter error', 400)
      const jsonString = JSON.stringify(error.toJSON())
      const parsed = JSON.parse(jsonString)

      expect(parsed.returnCode).toBe('2101')
      expect(parsed.returnMessage).toBe('Parameter error')
    })
  })

  describe('error properties', () => {
    test('should have correct error name', () => {
      const error = new LinePayError('1104', 'Test error', 400)
      expect(error.name).toBe('LinePayError')
    })

    test('should contain return code and message in error message', () => {
      const error = new LinePayError('1104', 'Merchant not found', 401)
      expect(error.message).toContain('1104')
      expect(error.message).toContain('Merchant not found')
    })
  })
})

describe('LinePayTimeoutError', () => {
  test('should create timeout error with timeout and URL', () => {
    const error = new LinePayTimeoutError(30000, 'https://api-pay.line.me/v4/payments')
    expect(error.name).toBe('LinePayTimeoutError')
    expect(error.timeout).toBe(30000)
    expect(error.url).toBe('https://api-pay.line.me/v4/payments')
    expect(error.message).toContain('30000')
  })

  test('should create timeout error without URL', () => {
    const error = new LinePayTimeoutError(15000)
    expect(error.timeout).toBe(15000)
    expect(error.url).toBeUndefined()
  })
})

describe('LinePayConfigError', () => {
  test('should create config error with message', () => {
    const error = new LinePayConfigError('channelId is required')
    expect(error.name).toBe('LinePayConfigError')
    expect(error.message).toBe('channelId is required')
  })
})

describe('LinePayValidationError', () => {
  test('should create validation error with message and field', () => {
    const error = new LinePayValidationError('Amount must be positive', 'amount')
    expect(error.name).toBe('LinePayValidationError')
    expect(error.message).toBe('Amount must be positive')
    expect(error.field).toBe('amount')
  })

  test('should create validation error without field', () => {
    const error = new LinePayValidationError('Invalid request')
    expect(error.field).toBeUndefined()
  })
})
