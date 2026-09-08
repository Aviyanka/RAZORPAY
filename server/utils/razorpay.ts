import Razorpay from 'razorpay'

let razorpayClient: Razorpay | null = null

export function getRazorpayClient(): Razorpay | null {
  if (razorpayClient) return razorpayClient

  const config = useRuntimeConfig()
  const keyId = config.razorpayKeyId || process.env.RAZORPAY_KEY_ID
  const keySecret = config.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET

  if (keyId && keySecret) {
    try {
      razorpayClient = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      })
      console.log('⚡ [Razorpay] Client initialized with Key ID:', keyId.substring(0, 8) + '...')
      return razorpayClient
    } catch (err) {
      console.error(' [Razorpay] Client init error:', err)
      return null
    }
  }

  return null
}

export function isRazorpayActive(): boolean {
  return getRazorpayClient() !== null
}

export interface CreatePaymentLinkParams {
  internalId: string
  amount: number // in INR e.g. 500
  description: string
  customer: {
    name: string
    email?: string
    contact?: string
  }
  fallbackUrl: string
  callbackBaseUrl: string
  notify?: {
    sms?: boolean
    email?: boolean
  }
  expireByMinutes?: number
}

export interface RazorpayLinkResult {
  razorpayLinkId: string
  shortUrl: string
  status: 'created' | 'paid' | 'expired' | 'cancelled'
  amountInPaise: number
  isMock: boolean
}

/**
 * Creates a Razorpay Payment Link (or simulation if keys not present)
 */
export async function createRazorpayLink(params: CreatePaymentLinkParams): Promise<RazorpayLinkResult> {
  const client = getRazorpayClient()
  const amountInPaise = Math.round(params.amount * 100)

  // Intermediate callback URL that intercepts Razorpay's redirect, updates Firestore, and redirects customer to the fallback URL
  const callbackUrl = `${params.callbackBaseUrl}/api/payment-links/callback?ref=${params.internalId}`

  if (client) {
    try {
      const payload: any = {
        amount: amountInPaise,
        currency: 'INR',
        accept_partial: false,
        description: params.description || `Payment for ${params.customer.name}`,
        customer: {
          name: params.customer.name,
          email: params.customer.email || undefined,
          contact: params.customer.contact ? formatContactNumber(params.customer.contact) : undefined
        },
        notify: {
          sms: Boolean(params.notify?.sms),
          email: Boolean(params.notify?.email)
        },
        reminder_enable: true,
        notes: {
          internal_id: params.internalId,
          fallback_url: params.fallbackUrl
        },
        callback_url: callbackUrl,
        callback_method: 'get'
      }

      if (params.expireByMinutes && params.expireByMinutes > 0) {
        payload.expire_by = Math.floor(Date.now() / 1000) + (params.expireByMinutes * 60)
      }

      const response: any = await client.paymentLink.create(payload)

      return {
        razorpayLinkId: response.id,
        shortUrl: response.short_url,
        status: response.status || 'created',
        amountInPaise,
        isMock: false
      }
    } catch (err: any) {
      console.error(' [Razorpay API Error]:', err?.error || err)
      throw createError({
        statusCode: 500,
        statusMessage: `Razorpay Error: ${err?.error?.description || err?.message || 'Failed to create payment link'}`
      })
    }
  }

  // Simulation / Mock mode when no API keys are present in .env
  const mockLinkId = `plink_mock_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
  // Mock payment page that routes to intermediate callback
  const mockShortUrl = `${params.callbackBaseUrl}/pay/mock-${params.internalId}`

  return {
    razorpayLinkId: mockLinkId,
    shortUrl: mockShortUrl,
    status: 'created',
    amountInPaise,
    isMock: true
  }
}

/**
 * Fetch live status of a payment link from Razorpay
 */
export async function fetchRazorpayLinkStatus(razorpayLinkId: string): Promise<{ status: string; payments?: any[] } | null> {
  const client = getRazorpayClient()
  if (!client || razorpayLinkId.startsWith('plink_mock_')) {
    return null
  }

  try {
    const linkData: any = await client.paymentLink.fetch(razorpayLinkId)
    return {
      status: linkData.status,
      payments: linkData.payments
    }
  } catch (err) {
    console.error(` [Razorpay] Failed to fetch link ${razorpayLinkId}:`, err)
    return null
  }
}

function formatContactNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '')
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    return `+91${cleaned}`
  }
  return cleaned
}

