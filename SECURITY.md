# Security Policy

## Supported Versions

We actively support the following versions of `line-pay-offline-v4`:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of `line-pay-offline-v4` seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues. This helps prevent exploitation before a fix is available.

### 2. Report Privately

Send your vulnerability report to:

- **Email**: carllee1983@gmail.com
- **Subject**: `[SECURITY] line-pay-offline-v4: [Brief Description]`

Or use GitHub's private vulnerability reporting feature:
- Go to the [Security tab](https://github.com/CarlLee1983/line-pay-offline-v4-node/security/advisories/new)

### 3. Include Details

Please include the following information in your report:

- **Description**: A clear description of the vulnerability
- **Impact**: The potential impact and severity
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Versions**: Which versions are affected
- **Suggested Fix**: If you have a suggestion for fixing the issue (optional)
- **Proof of Concept**: Any code or examples demonstrating the vulnerability (optional)

### 4. What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We will keep you informed about the progress of addressing the vulnerability
- **Timeline**: We aim to release a fix within 30 days for critical vulnerabilities
- **Credit**: We will credit you (if desired) in the security advisory and release notes

## Security Best Practices

When using `line-pay-offline-v4`, please follow these security best practices:

### Channel Secret Protection

```typescript
// ❌ DON'T: Hard-code secrets
const client = new LinePayOfflineClient({
  channelId: '1234567890',
  channelSecret: 'my-secret-key', // Never hard-code!
  merchantDeviceProfileId: 'POS-001'
})

// ✅ DO: Use environment variables
const client = new LinePayOfflineClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID!,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET!,
  merchantDeviceProfileId: process.env.MERCHANT_DEVICE_ID!
})
```

### Signature Verification

Always verify signatures when receiving webhook notifications from LINE Pay:

```typescript
import { LinePayUtils } from 'line-pay-offline-v4'

// Verify signature using timing-safe comparison
const isValid = LinePayUtils.verifySignature(
  channelSecret,
  data,
  receivedSignature
)

if (!isValid) {
  throw new Error('Invalid signature')
}
```

### HTTPS Only

Always use HTTPS for LINE Pay API communications. The SDK enforces this in production environments.

### Keep Dependencies Updated

Regularly update `line-pay-offline-v4` and its dependencies to receive security patches:

```bash
bun update line-pay-offline-v4
```

## Security Features

`line-pay-offline-v4` includes the following security features:

### 1. Timing-Safe Signature Verification

Uses `crypto.timingSafeEqual()` to prevent timing attacks when verifying HMAC signatures.

### 2. Input Validation

- Transaction ID format validation
- Configuration parameter validation
- Type-safe API with TypeScript

### 3. Error Handling

Custom error classes that don't leak sensitive information in error messages.

### 4. Minimal Dependencies

Only depends on `line-pay-core-v4` with zero runtime dependencies, reducing the attack surface.

## Security Updates

Security updates will be released as patch versions and announced through:

- GitHub Security Advisories
- Release notes
- npm package updates

## Scope

This security policy applies to:

- The `line-pay-offline-v4` package
- Security issues in the library code
- Security issues in the build process and distribution

This policy does **not** cover:

- Security issues in applications built using this library
- Issues in LINE Pay's backend services
- Social engineering attacks

## Additional Resources

- [LINE Pay API Documentation](https://pay.line.me/documents/offline_v4_tw.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Advisories](https://www.npmjs.com/advisories)

## Questions?

If you have questions about this security policy, please open a GitHub issue (for non-security questions) or contact the maintainers directly.

---

**Last Updated**: December 11, 2025
