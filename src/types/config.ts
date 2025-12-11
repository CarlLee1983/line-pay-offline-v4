import type { LinePayConfig as BaseLinePayConfig } from 'line-pay-core-v4'

/**
 * LINE Pay Offline Client Configuration
 *
 * Extends the base configuration with offline-specific settings.
 */
export interface LinePayOfflineConfig extends BaseLinePayConfig {
  /**
   * Merchant Device Profile ID
   * Unique identifier for the merchant device (e.g., POS system)
   */
  merchantDeviceProfileId: string

  /**
   * Merchant Device Type
   * Type of the merchant device (e.g., "POS", "KIOSK", etc.)
   * @default "POS"
   */
  merchantDeviceType?: string
}
