# Contributing to line-pay-offline-v4

Thank you for your interest in contributing to `line-pay-offline-v4`! We welcome contributions from the community.

[繁體中文](./CONTRIBUTING_ZH.md) | English

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title**: Describe the issue briefly
- **Description**: Detailed description of the problem
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: OS, Node.js/Bun version, package version
- **Code samples**: Minimal code to reproduce (if applicable)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows the coding standards
6. Issue the pull request

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) v1.3.4 or later
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

### Setup Steps

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/line-pay-offline-v4-node.git
cd line-pay-offline-v4-node
```

2. **Install dependencies**

```bash
bun install
```

3. **Run tests to ensure everything works**

```bash
bun test
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run type checking
bun run typecheck

# Run linting
bun run check

# Run tests
bun test

# Run tests with coverage
bun run test:coverage

# Build the project
bun run build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "type: description"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

- Use TypeScript for all source code
- Enable strict mode
- Avoid using `any` type
- Document public APIs with JSDoc comments

### Code Style

We use Biome for formatting and linting. Follow these conventions:

- **Indentation**: 2 spaces (handled by Biome)
- **Semicolons**: Not required (configured in project)
- **Quotes**: Single quotes for strings
- **Naming Conventions**:
  - `PascalCase` for classes and types
  - `camelCase` for functions and variables
  - `UPPER_CASE` for constants

### Example

```typescript
/**
 * Validates a LINE Pay transaction ID
 * @param transactionId - The transaction ID to validate
 * @throws {LinePayValidationError} When format is invalid
 */
export function validateTransactionId(transactionId: string): void {
  if (!TRANSACTION_ID_REGEX.test(transactionId)) {
    throw new LinePayValidationError(
      `Invalid transactionId format: expected 19-digit number, got "${transactionId}"`
    )
  }
}
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring (neither fixes a bug nor adds a feature)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
# Feature
git commit -m "feat: add payment status polling utility"

# Bug fix
git commit -m "fix: correct orderId URL encoding in refund request"

# Documentation
git commit -m "docs: update API reference for checkPaymentStatus"

# Refactoring
git commit -m "refactor: extract device headers to separate method"
```

## Pull Request Process

1. **Update Documentation**: Ensure README is updated
2. **Add Tests**: All new features must include tests
3. **Pass All Checks**: Ensure type checking, linting, tests, and build pass
4. **Clean Commit History**: Squash or rebase if needed
5. **Reference Issues**: Link related issues in PR description
6. **Request Review**: Tag maintainers for review

### PR Title Format

Follow the same format as commit messages:

```
feat: add new utility function for parsing
fix: resolve timeout error handling
docs: improve README examples
```

## Testing

### Writing Tests

- Place tests in `tests/*.test.ts` files
- Use Bun's test runner
- Aim for high code coverage (100% target)
- Test edge cases and error conditions

### Test Example

```typescript
import { describe, expect, test } from 'bun:test'
import { LinePayOfflineClient } from '../src'

describe('LinePayOfflineClient', () => {
  describe('checkPaymentStatus', () => {
    test('should call API with correct URL', async () => {
      // Test implementation
    })
    
    test('should URL encode special characters', async () => {
      // Test implementation
    })
  })
})
```

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun run test:coverage

# Run specific test file
bun test tests/LinePayOfflineClient.test.ts
```

## Documentation

### README Updates

- Keep README.md up-to-date with all features
- Include code examples for new features
- Update API reference section

### Code Documentation

- Use JSDoc for public APIs
- Document parameters, return types, and exceptions
- Include usage examples in comments

### Example

```typescript
/**
 * Request payment using customer's one-time barcode
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
 *   orderId: 'ORDER-001'
 * })
 * ```
 */
async requestPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Implementation
}
```

## Questions?

If you have questions about contributing, feel free to:

- Open a [GitHub Issue](https://github.com/CarlLee1983/line-pay-offline-v4-node/issues/new)
- Create an issue with the "question" label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to `line-pay-offline-v4`! 🎉
