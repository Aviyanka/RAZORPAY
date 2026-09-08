import { v4 as uuidv4 } from 'uuid'
import type { PaymentLinkRecord } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is required'
    })
  }

  const { amount, description, customer, fallbackUrl, notify, expireByMinutes } = body

  // Validation
  const parsedAmount = Number(amount)
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Amount must be a valid positive number in INR'
    })
  }

  if (!customer?.name || typeof customer.name !== 'string' || !customer.name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer name is required'
    })
  }

  if (!fallbackUrl || typeof fallbackUrl !== 'string' || !fallbackUrl.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer fallback/redirect URL is required'
    })
  }

  // Ensure URL is properly formatted
  let formattedFallbackUrl = fallbackUrl.trim()
  if (!formattedFallbackUrl.startsWith('http://') && !formattedFallbackUrl.startsWith('https://')) {
    formattedFallbackUrl = `https://${formattedFallbackUrl}`
  }

  try {
    new URL(formattedFallbackUrl)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid fallback URL format. Example: https://example.com/thank-you'
    })
  }

  // Determine base app URL for callback
  const config = useRuntimeConfig(event)
  const reqHeaders = getHeaders(event)
  const host = reqHeaders['x-forwarded-host'] || reqHeaders.host || 'localhost:3000'
  const protocol = reqHeaders['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https')
  const baseUrl = config.public.appUrl && !config.public.appUrl.includes('localhost')
    ? config.public.appUrl
    : `${protocol}://${host}`

  // Unique reference ID
  const internalId = `link_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

  try {
    // 1. Create Razorpay Payment Link
    const rzpResult = await createRazorpayLink({
      internalId,
      amount: parsedAmount,
      description: (description || `Payment of ₹${parsedAmount}`).trim(),
      customer: {
        name: customer.name.trim(),
        email: customer.email?.trim() || undefined,
        contact: customer.contact?.trim() || undefined
      },
      fallbackUrl: formattedFallbackUrl,
      callbackBaseUrl: baseUrl,
      notify: {
        sms: Boolean(notify?.sms),
        email: Boolean(notify?.email)
      },
      expireByMinutes: expireByMinutes ? Number(expireByMinutes) : undefined
    })

    // 2. Prepare record to save in Firestore
    const newRecord: PaymentLinkRecord = {
      id: internalId,
      razorpayLinkId: rzpResult.razorpayLinkId,
      amount: parsedAmount,
      amountInPaise: rzpResult.amountInPaise,
      currency: 'INR',
      description: description || `Payment from ${customer.name}`,
      customer: {
        name: customer.name.trim(),
        email: customer.email?.trim() || undefined,
        contact: customer.contact?.trim() || undefined
      },
      fallbackUrl: formattedFallbackUrl,
      shortUrl: rzpResult.shortUrl,
      status: rzpResult.status as any,
      notify: {
        sms: Boolean(notify?.sms),
        email: Boolean(notify?.email)
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isMock: rzpResult.isMock
    }

    // 3. Save to Firebase Firestore
    await savePaymentLink(newRecord)

    return {
      success: true,
      data: newRecord
    }
  } catch (err: any) {
    console.error(' [Create Payment Link Error]:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message || 'Failed to generate payment link'
    })
  }
})
