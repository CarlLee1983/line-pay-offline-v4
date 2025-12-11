import { describe, expect, mock, test } from 'bun:test'
import { LinePayConfigError, LinePayError, LinePayTimeoutError } from 'line-pay-core-v4'
import { LinePayOfflineClient } from '../src/LinePayOfflineClient'
import type { PaymentRequest } from '../src/types'

describe('LinePayOfflineClient', () => {
  const config = {
    channelId: 'test-channel-id',
    channelSecret: 'test-channel-secret',
    merchantDeviceProfileId: 'POS-001',
    merchantDeviceType: 'POS',
    env: 'sandbox' as const,
  }

  describe('Constructor', () => {
    test('should create instance with valid config', () => {
      const client = new LinePayOfflineClient(config)
      expect(client).toBeInstanceOf(LinePayOfflineClient)
    })

    test('should throw error when merchantDeviceProfileId is empty', () => {
      expect(() => {
        new LinePayOfflineClient({
          ...config,
          merchantDeviceProfileId: '',
        })
      }).toThrow('merchantDeviceProfileId is required and cannot be empty')
    })

    test('should throw error when merchantDeviceProfileId is whitespace only', () => {
      expect(() => {
        new LinePayOfflineClient({
          ...config,
          merchantDeviceProfileId: '   ',
        })
      }).toThrow('merchantDeviceProfileId is required and cannot be empty')
    })

    test('should use default merchantDeviceType when not provided', () => {
      const client = new LinePayOfflineClient({
        channelId: 'test-channel-id',
        channelSecret: 'test-channel-secret',
        merchantDeviceProfileId: 'POS-001',
        env: 'sandbox',
      })
      expect(client).toBeInstanceOf(LinePayOfflineClient)
    })

    test('should trim merchantDeviceProfileId', () => {
      const client = new LinePayOfflineClient({
        ...config,
        merchantDeviceProfileId: '  POS-001  ',
      })
      expect(client).toBeInstanceOf(LinePayOfflineClient)
    })

    test('should trim merchantDeviceType', () => {
      const client = new LinePayOfflineClient({
        ...config,
        merchantDeviceType: '  KIOSK  ',
      })
      expect(client).toBeInstanceOf(LinePayOfflineClient)
    })

    test('should throw LinePayConfigError for empty channelId', () => {
      expect(() => {
        new LinePayOfflineClient({
          ...config,
          channelId: '',
        })
      }).toThrow(LinePayConfigError)
    })

    test('should throw LinePayConfigError for empty channelSecret', () => {
      expect(() => {
        new LinePayOfflineClient({
          ...config,
          channelSecret: '',
        })
      }).toThrow(LinePayConfigError)
    })

    test('should throw LinePayConfigError for negative timeout', () => {
      expect(() => {
        new LinePayOfflineClient({
          ...config,
          timeout: -1,
        })
      }).toThrow(LinePayConfigError)
    })

    test('should use production URL when env is production', () => {
      const client = new LinePayOfflineClient({
        ...config,
        env: 'production',
      })
      expect(client).toBeInstanceOf(LinePayOfflineClient)
    })
  })

  describe('requestPayment', () => {
    test('should call API with correct parameters and device headers', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          transactionId: 1234567890123,
          orderId: 'ORDER-001',
          transactionDate: '2019-01-01T01:01:00Z',
          payInfo: [{ method: 'CREDIT_CARD', amount: 100 }],
          paymentProvider: 'TSP',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      const request: PaymentRequest = {
        amount: 100,
        currency: 'TWD',
        oneTimeKey: '12345678901245678',
        orderId: 'ORDER-001',
      }

      const response = await client.requestPayment(request)

      expect(response.returnCode).toBe('0000')
      expect(fetchMock).toHaveBeenCalledTimes(1)

      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments/oneTimeKeys/pay')
      expect(init.method).toBe('POST')

      const headers = init.headers as Record<string, string>
      expect(headers['X-LINE-MerchantDeviceProfileId']).toBe('POS-001')
      expect(headers['X-LINE-MerchantDeviceType']).toBe('POS')
      expect(headers['X-LINE-ChannelId']).toBe('test-channel-id')
      expect(headers['X-LINE-Authorization']).toBeDefined()
      expect(headers['X-LINE-Authorization-Nonce']).toBeDefined()
    })

    test('should include packages in request body', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          transactionId: 1234567890123,
          orderId: 'ORDER-001',
          transactionDate: '2019-01-01T01:01:00Z',
          payInfo: [{ method: 'CREDIT_CARD', amount: 100 }],
          paymentProvider: 'TSP',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      const request: PaymentRequest = {
        amount: 100,
        currency: 'TWD',
        oneTimeKey: '12345678901245678',
        orderId: 'ORDER-001',
        packages: [
          {
            id: 'PKG-001',
            amount: 100,
            products: [{ name: 'Test Product', quantity: 1, price: 100 }],
          },
        ],
      }

      await client.requestPayment(request)

      const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(init.body).toContain('"packages"')
      expect(init.body).toContain('"PKG-001"')
    })
  })

  describe('checkPaymentStatus', () => {
    test('should call API with correct URL and device headers', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          status: 'COMPLETE',
          transactionId: 1234567890123,
          orderId: 'ORDER-001',
          transactionDate: '2019-01-01T01:01:00Z',
          payInfo: [{ method: 'CREDIT_CARD', amount: 100 }],
          paymentProvider: 'TSP',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      const response = await client.checkPaymentStatus('ORDER-001')

      expect(response.returnCode).toBe('0000')

      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments/orders/ORDER-001/check')
      expect(init.method).toBe('GET')

      const headers = init.headers as Record<string, string>
      expect(headers['X-LINE-MerchantDeviceProfileId']).toBe('POS-001')
      expect(headers['X-LINE-MerchantDeviceType']).toBe('POS')
    })

    test('should URL encode orderId with special characters', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          status: 'COMPLETE',
          transactionId: 1234567890123,
          orderId: 'ORDER/001',
          transactionDate: '2019-01-01T01:01:00Z',
          payInfo: [],
          paymentProvider: 'TSP',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.checkPaymentStatus('ORDER/001')

      const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments/orders/ORDER%2F001/check')
    })
  })

  describe('queryAuthorizations', () => {
    test('should call API with orderId parameter', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: [
          {
            transactionId: 1234567890123,
            transactionDate: '2019-01-01T01:01:00Z',
            transactionType: 'PAYMENT',
            productName: 'Test',
            currency: 'TWD',
            paymentProvider: 'TSP',
            authorizationExpireDate: '2019-01-08T01:01:00Z',
            payInfo: [{ method: 'CREDIT_CARD', amount: 100 }],
            orderId: 'ORDER-001',
            payStatus: 'AUTHORIZATION',
          },
        ],
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      const response = await client.queryAuthorizations({ orderId: 'ORDER-001' })

      expect(response.returnCode).toBe('0000')

      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments/authorizations')
      expect(url).toContain('orderId=ORDER-001')
      expect(init.method).toBe('GET')

      const headers = init.headers as Record<string, string>
      expect(headers['X-LINE-MerchantDeviceProfileId']).toBe('POS-001')
    })

    test('should call API with transactionId parameter', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: [],
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.queryAuthorizations({ transactionId: '12345678901230' })

      const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('transactionId=12345678901230')
    })
  })

  describe('capturePayment', () => {
    test('should call API with correct parameters', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          transactionId: 1234567890123,
          orderId: 'ORDER-001',
          transactionDate: '2019-01-01T01:01:00Z',
          payInfo: [{ method: 'CREDIT_CARD', amount: 100 }],
          paymentProvider: 'TSP',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      const response = await client.capturePayment('ORDER-001', {
        amount: 100,
        currency: 'TWD',
      })

      expect(response.returnCode).toBe('0000')

      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments/orders/ORDER-001/capture')
      expect(init.method).toBe('POST')
      expect(init.body).toContain('"amount":100')
      expect(init.body).toContain('"currency":"TWD"')

      const headers = init.headers as Record<string, string>
      expect(headers['X-LINE-MerchantDeviceProfileId']).toBe('POS-001')
    })

    test('should include promotionRestriction in request', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          transactionId: 1234567890123,
          orderId: 'ORDER-001',
          transactionDate: '2019-01-01T01:01:00Z',
          payInfo: [],
          paymentProvider: 'TSP',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.capturePayment('ORDER-001', {
        amount: 100,
        currency: 'TWD',
        promotionRestriction: { useLimit: 50 },
      })

      const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(init.body).toContain('"promotionRestriction"')
      expect(init.body).toContain('"useLimit":50')
    })
  })

  describe('voidAuthorization', () => {
    test('should call API with correct URL', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      const response = await client.voidAuthorization('ORDER-001')

      expect(response.returnCode).toBe('0000')

      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments/orders/ORDER-001/void')
      expect(init.method).toBe('POST')

      const headers = init.headers as Record<string, string>
      expect(headers['X-LINE-MerchantDeviceProfileId']).toBe('POS-001')
    })

    test('should URL encode orderId', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = { returnCode: '0000', returnMessage: 'success' }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.voidAuthorization('ORDER/001&test')

      const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments/orders/ORDER%2F001%26test/void')
    })
  })

  describe('retrievePaymentDetails', () => {
    test('should call API with orderId parameter', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: [
          {
            transactionId: 1234567890123,
            transactionDate: '2019-01-01T01:01:00Z',
            transactionType: 'PAYMENT',
            productName: 'Test',
            currency: 'TWD',
            payInfo: [{ method: 'CREDIT_CARD', amount: 100 }],
            paymentProvider: 'TSP',
            orderId: 'ORDER-001',
          },
        ],
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      const response = await client.retrievePaymentDetails({ orderId: 'ORDER-001' })

      expect(response.returnCode).toBe('0000')

      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments')
      expect(url).toContain('orderId=ORDER-001')
      expect(init.method).toBe('GET')

      const headers = init.headers as Record<string, string>
      expect(headers['X-LINE-MerchantDeviceProfileId']).toBe('POS-001')
    })

    test('should call API with transactionId parameter', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: [],
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.retrievePaymentDetails({ transactionId: '12345678901230' })

      const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments')
      expect(url).toContain('transactionId=12345678901230')
    })
  })

  describe('refundPayment', () => {
    test('should call API for full refund (no request body)', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          refundTransactionId: 1234567890124,
          refundTransactionDate: '2019-01-02T01:01:00Z',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      const response = await client.refundPayment('ORDER-001')

      expect(response.returnCode).toBe('0000')

      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('/v4/payments/orders/ORDER-001/refund')
      expect(init.method).toBe('POST')

      const headers = init.headers as Record<string, string>
      expect(headers['X-LINE-MerchantDeviceProfileId']).toBe('POS-001')
    })

    test('should call API for partial refund', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          refundTransactionId: 1234567890124,
          refundTransactionDate: '2019-01-02T01:01:00Z',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.refundPayment('ORDER-001', { refundAmount: 50 })

      const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(init.body).toContain('"refundAmount":50')
    })

    test('should include promotionRestriction in refund request', async () => {
      const client = new LinePayOfflineClient(config)
      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          refundTransactionId: 1234567890124,
          refundTransactionDate: '2019-01-02T01:01:00Z',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.refundPayment('ORDER-001', {
        promotionRestriction: { useLimit: 30 },
      })

      const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(init.body).toContain('"promotionRestriction"')
      expect(init.body).toContain('"useLimit":30')
    })
  })

  describe('Error Handling', () => {
    test('should throw LinePayError for API error response', async () => {
      const client = new LinePayOfflineClient(config)
      const errorResponse = {
        returnCode: '1104',
        returnMessage: 'Merchant not found',
      }

      const fetchMock = mock(() =>
        Promise.resolve(
          new Response(JSON.stringify(errorResponse), {
            status: 400,
            statusText: 'Bad Request',
          })
        )
      )
      global.fetch = fetchMock as unknown as typeof fetch

      try {
        await client.requestPayment({
          amount: 100,
          currency: 'TWD',
          oneTimeKey: '12345678901245678',
          orderId: 'ORDER-001',
        })
        expect.unreachable('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(LinePayError)
        const linePayError = error as LinePayError
        expect(linePayError.returnCode).toBe('1104')
        expect(linePayError.returnMessage).toBe('Merchant not found')
      }
    })

    test('should throw LinePayError for business logic error (returnCode !== 0000)', async () => {
      const client = new LinePayOfflineClient(config)
      const errorResponse = {
        returnCode: '1150',
        returnMessage: 'Transaction not found',
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(errorResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      try {
        await client.checkPaymentStatus('ORDER-001')
        expect.unreachable('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(LinePayError)
        const linePayError = error as LinePayError
        expect(linePayError.returnCode).toBe('1150')
      }
    })

    test('should throw LinePayError for non-JSON response', async () => {
      const client = new LinePayOfflineClient(config)

      const fetchMock = mock(() =>
        Promise.resolve(
          new Response('Internal Server Error', {
            status: 500,
            statusText: 'Internal Server Error',
          })
        )
      )
      global.fetch = fetchMock as unknown as typeof fetch

      try {
        await client.requestPayment({
          amount: 100,
          currency: 'TWD',
          oneTimeKey: '12345678901245678',
          orderId: 'ORDER-001',
        })
        expect.unreachable('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(LinePayError)
        const linePayError = error as LinePayError
        expect(linePayError.returnCode).toBe('PARSE_ERROR')
      }
    })

    test('should throw LinePayTimeoutError on timeout', async () => {
      const client = new LinePayOfflineClient(config)

      const fetchMock = mock(() => {
        const error = new Error('The operation was aborted')
        error.name = 'AbortError'
        return Promise.reject(error)
      })
      global.fetch = fetchMock as unknown as typeof fetch

      try {
        await client.requestPayment({
          amount: 100,
          currency: 'TWD',
          oneTimeKey: '12345678901245678',
          orderId: 'ORDER-001',
        })
        expect.unreachable('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(LinePayTimeoutError)
      }
    })

    test('should propagate network errors', async () => {
      const client = new LinePayOfflineClient(config)

      const fetchMock = mock(() => Promise.reject(new Error('Network Error')))
      global.fetch = fetchMock as unknown as typeof fetch

      await expect(
        client.requestPayment({
          amount: 100,
          currency: 'TWD',
          oneTimeKey: '12345678901245678',
          orderId: 'ORDER-001',
        })
      ).rejects.toThrow('Network Error')
    })
  })

  describe('Custom Device Type', () => {
    test('should use custom merchantDeviceType in headers', async () => {
      const client = new LinePayOfflineClient({
        ...config,
        merchantDeviceType: 'KIOSK',
      })

      const mockResponse = {
        returnCode: '0000',
        returnMessage: 'success',
        info: {
          transactionId: 1234567890123,
          orderId: 'ORDER-001',
          transactionDate: '2019-01-01T01:01:00Z',
          payInfo: [],
          paymentProvider: 'TSP',
        },
      }

      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.requestPayment({
        amount: 100,
        currency: 'TWD',
        oneTimeKey: '12345678901245678',
        orderId: 'ORDER-001',
      })

      const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      const headers = init.headers as Record<string, string>
      expect(headers['X-LINE-MerchantDeviceType']).toBe('KIOSK')
    })
  })

  describe('Environment URLs', () => {
    test('should use sandbox URL for sandbox environment', async () => {
      const client = new LinePayOfflineClient({
        ...config,
        env: 'sandbox',
      })

      const mockResponse = { returnCode: '0000', returnMessage: 'success', info: {} }
      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.voidAuthorization('ORDER-001')

      const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('sandbox-api-pay.line.me')
    })

    test('should use production URL for production environment', async () => {
      const client = new LinePayOfflineClient({
        ...config,
        env: 'production',
      })

      const mockResponse = { returnCode: '0000', returnMessage: 'success', info: {} }
      const fetchMock = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse))))
      global.fetch = fetchMock as unknown as typeof fetch

      await client.voidAuthorization('ORDER-001')

      const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toContain('api-pay.line.me')
      expect(url).not.toContain('sandbox')
    })
  })
})
