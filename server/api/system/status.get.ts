export default defineEventHandler((event) => {
  const isRzp = isRazorpayActive()
  const isFirestore = isFirestoreActive()
  const config = useRuntimeConfig(event)

  return {
    success: true,
    razorpay: {
      active: isRzp,
      keyId: config.razorpayKeyId ? `${config.razorpayKeyId.substring(0, 8)}...` : null,
      mode: config.razorpayKeyId?.startsWith('rzp_live') ? 'live' : config.razorpayKeyId?.startsWith('rzp_test') ? 'test' : 'mock'
    },
    firebase: {
      active: isFirestore,
      projectId: config.firebaseProjectId || null,
      mode: isFirestore ? 'firestore_cloud' : 'in_memory_fallback'
    },
    appUrl: config.public.appUrl || 'http://localhost:3000'
  }
})
