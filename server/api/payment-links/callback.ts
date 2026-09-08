export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const internalId = (query.ref as string) || ''
  const rzpLinkId = (query.razorpay_payment_link_id as string) || ''
  const rzpPaymentId = (query.razorpay_payment_id as string) || ''
  const rzpStatus = (query.razorpay_payment_link_status as string) || 'paid'
  const isDirect = query.direct === 'true'

  // Look up record
  let record = internalId ? await getPaymentLinkById(internalId) : null
  if (!record && rzpLinkId) {
    record = await getPaymentLinkByRazorpayId(rzpLinkId)
  }

  if (record) {
    // Update record to paid if status is paid or payment id is present
    if (rzpStatus === 'paid' || rzpPaymentId) {
      await updatePaymentLinkStatus(record.id, 'paid', {
        razorpayPaymentId: rzpPaymentId || record.razorpayPaymentId || `pay_${Date.now()}`,
        paidAt: new Date().toISOString()
      })
    }

    const targetFallback = record.fallbackUrl

    // If direct redirect requested, 302 directly to fallback
    if (isDirect) {
      const url = new URL(targetFallback)
      url.searchParams.set('payment_status', 'success')
      url.searchParams.set('link_id', record.id)
      if (rzpPaymentId) url.searchParams.set('payment_id', rzpPaymentId)
      return sendRedirect(event, url.toString(), 302)
    }

    // Otherwise redirect to the verified success auto-redirect page
    const successUrl = `/payment/success?ref=${encodeURIComponent(record.id)}&payment_id=${encodeURIComponent(rzpPaymentId || '')}`
    return sendRedirect(event, successUrl, 302)
  }

  // If no record found, redirect to home or fallback
  return sendRedirect(event, '/?payment_completed=true', 302)
})
