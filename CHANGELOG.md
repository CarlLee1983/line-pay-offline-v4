# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-12-11

### Fixed

- 🔗 **Repository URL**: Updated all documentation links to correct repository URL
- 🔧 **CI**: Updated `release-please-action` from deprecated `google-github-actions` to `googleapis`

## [1.0.1] - 2025-12-11

### Changed

- ⬆️ **Dependencies**: Updated `line-pay-core-v4` to ^1.4.2
- ⬆️ **Dev Dependencies**: Updated `lint-staged` to ^16.2.7, `simple-git-hooks` to ^2.13.1, `typescript` to ^5.9.3

### Fixed

- 🔧 **Git Hooks**: Fixed pre-commit hook PATH issue for GUI Git clients (SourceTree)
- 🔧 **CI**: Simplified lint job to use single `biome check` command

### Improved

- 📝 **Documentation**: Enhanced package description and added more keywords for npm discoverability
- 🌐 **i18n**: Added multi-language README (English, 繁體中文, 日本語, ไทย)

## 1.0.0 (2025-12-11)


### Features

* initial release with full LINE Pay Offline V4 API support ([bf550ca](https://github.com/CarlLee1983/line-pay-offline-v4/commit/bf550ca3edc6b33203acb0f3e4900792af12caff))

## [1.0.0] - 2025-12-11

### Added

- 🎉 **Initial Release** - LINE Pay Offline V4 API SDK for Node.js/Bun
- ✅ **Payment Request** - Request payment using customer's one-time barcode
- ✅ **Check Payment Status** - Query payment status by order ID
- ✅ **Query Authorization Information** - Query authorized or voided authorization details
- ✅ **Capture Payment** - Execute capture for separated authorization flow
- ✅ **Void Authorization** - Cancel authorized payment before capture
- ✅ **Retrieve Payment Details** - Query captured or authorized payment details
- ✅ **Refund Payment** - Full and partial refund support
- 📦 **Type-Safe API** - Full TypeScript support with comprehensive type definitions
- 🔐 **Security Utilities** - Signature generation and verification utilities
- 🧪 **100% Test Coverage** - Comprehensive test suite with full coverage
- 📝 **Complete Documentation** - README with usage examples

### Dependencies

- `line-pay-core-v4`: ^1.3.0 - Core utilities for LINE Pay SDK

### Technical Details

- **Runtime Support**: Node.js 18+ and Bun
- **Module Format**: ESM and CommonJS dual-format
- **Zero Runtime Dependencies**: Only depends on `line-pay-core-v4`
- **TypeScript**: Full type definitions included

---

[1.0.2]: https://github.com/CarlLee1983/line-pay-offline-v4/releases/tag/v1.0.2
[1.0.1]: https://github.com/CarlLee1983/line-pay-offline-v4/releases/tag/v1.0.1
[1.0.0]: https://github.com/CarlLee1983/line-pay-offline-v4/releases/tag/v1.0.0
