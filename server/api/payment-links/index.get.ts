export default defineEventHandler(async (event) => {
  try {
    const links = await getAllPaymentLinks()
    return {
      success: true,
      count: links.length,
      links
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch payment links: ${err.message}`
    })
  }
})
