export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID parameter is required'
    })
  }

  const record = await getPaymentLinkById(id)
  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Payment link not found'
    })
  }

  return {
    success: true,
    data: record
  }
})
