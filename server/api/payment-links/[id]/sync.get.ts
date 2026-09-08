export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment link ID is required'
    })
  }

  const record = await getPaymentLinkById(id)
  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Payment link not found'
    })
  }

  // If already paid, return
  if (record.status === 'paid') {
    return {
      success: true,
      data: record,
      message: 'Payment link is already marked as PAID'
    }
  }

  // Query Razorpay if razorpayLinkId exists
  if (record.razorpayLinkId && !record.isMock) {
    const liveStatus = await fetchRazorpayLinkStatus(record.razorpayLinkId)
    if (liveStatus) {
      let newStatus: any = record.status
      let paymentId = record.razorpayPaymentId

      if (liveStatus.status === 'paid') {
        newStatus = 'paid'
        if (liveStatus.payments && liveStatus.payments.length > 0) {
          paymentId = liveStatus.payments[0].payment_id || liveStatus.payments[0].id
        }
      } else if (liveStatus.status === 'expired') {
        newStatus = 'expired'
      } else if (liveStatus.status === 'cancelled') {
        newStatus = 'cancelled'
      }

      if (newStatus !== record.status) {
        const updated = await updatePaymentLinkStatus(record.id, newStatus, {
          razorpayPaymentId: paymentId
        })
        return {
          success: true,
          data: updated,
          message: `Status updated to ${newStatus.toUpperCase()}`
        }
      }
    }
  }

  return {
    success: true,
    data: record,
    message: `Current status: ${record.status.toUpperCase()}`
  }
})
