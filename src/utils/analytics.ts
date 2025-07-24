import { config } from '../lib/config'

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
}

/**
 * Tracks analytics events
 */
export const trackEvent = async (eventData: AnalyticsEvent): Promise<void> => {
  try {
    // Mixpanel tracking
    if (config.monitoring.mixpanelToken && typeof window !== 'undefined') {
      // @ts-ignore - Mixpanel global
      if (window.mixpanel) {
        window.mixpanel.track(eventData.event, eventData.properties)
      }
    }

    // Custom analytics API
    if (config.services.analyticsApiUrl) {
      await fetch(`${config.services.analyticsApiUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
    }
  } catch (error) {
    console.error('Error tracking analytics event:', error)
  }
}

/**
 * Identifies a user for analytics
 */
export const identifyUser = async (userId: string, properties?: Record<string, any>): Promise<void> => {
  try {
    // Mixpanel identify
    if (config.monitoring.mixpanelToken && typeof window !== 'undefined') {
      // @ts-ignore - Mixpanel global
      if (window.mixpanel) {
        window.mixpanel.identify(userId)
        if (properties) {
          window.mixpanel.people.set(properties)
        }
      }
    }

    // Custom analytics API
    if (config.services.analyticsApiUrl) {
      await fetch(`${config.services.analyticsApiUrl}/identify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, properties }),
      })
    }
  } catch (error) {
    console.error('Error identifying user:', error)
  }
}

/**
 * Initializes analytics services
 */
export const initializeAnalytics = (): void => {
  try {
    // Initialize Mixpanel
    if (config.monitoring.mixpanelToken && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
      script.onload = () => {
        // @ts-ignore - Mixpanel global
        window.mixpanel.init(config.monitoring.mixpanelToken)
      }
      document.head.appendChild(script)
    }

    // Initialize Sentry
    if (config.monitoring.sentryDsn) {
      import('@sentry/react').then(Sentry => {
        Sentry.init({
          dsn: config.monitoring.sentryDsn,
          environment: config.development.environment,
        })
      })
    }
  } catch (error) {
    console.error('Error initializing analytics:', error)
  }
}