import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const headers = getHeaders(event)
  const webhookSignature = headers['x-razorpay-signature']
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  // Verify signature if secret configured
  if (webhookSecret && webhookSignature) {
    const rawBody = JSON.stringify(body)
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    if (expectedSignature !== webhookSignature) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Webhook Signature'
      })
    }
  }

  const eventType = body?.event
  const paymentLinkEntity = body?.payload?.payment_link?.entity
  const paymentEntity = body?.payload?.payment?.entity

  console.log(`⚡ [Razorpay Webhook] Received event: ${eventType}`)

  if (eventType === 'payment_link.paid' || eventType === 'payment.captured') {
    const rzpLinkId = paymentLinkEntity?.id
    const rzpPaymentId = paymentEntity?.id || paymentLinkEntity?.payment_id
    const internalId = paymentLinkEntity?.notes?.internal_id

    let record = internalId ? await getPaymentLinkById(internalId) : null
    if (!record && rzpLinkId) {
      record = await getPaymentLinkByRazorpayId(rzpLinkId)
    }

    if (record) {
      await updatePaymentLinkStatus(record.id, 'paid', {
        razorpayPaymentId: rzpPaymentId,
        paidAt: new Date().toISOString()
      })
      console.log(` [Razorpay Webhook] Link ${record.id} marked as PAID`)
    }
  } else if (eventType === 'payment_link.expired') {
    const rzpLinkId = paymentLinkEntity?.id
    if (rzpLinkId) {
      const record = await getPaymentLinkByRazorpayId(rzpLinkId)
      if (record) {
        await updatePaymentLinkStatus(record.id, 'expired')
      }
    }
  }

  return {
    success: true,
    received: true
  }
})
