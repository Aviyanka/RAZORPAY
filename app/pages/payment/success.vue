<template>
  <div class="min-h-screen bg-[#07090e] bg-grid-mesh flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-white">
    <!-- Ambient glow -->
    <div class="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative w-full max-w-lg glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-500/30 text-center animate-slide-up">
      <!-- Success Icon with Pulse -->
      <div class="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
        <div class="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
        Payment Successful!
      </h1>
      <p class="text-slate-400 text-sm sm:text-base mb-6">
        Your transaction has been verified and processed securely.
      </p>

      <!-- Transaction Summary Card -->
      <div v-if="linkRecord" class="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6 text-left space-y-3">
        <div class="flex justify-between items-center pb-3 border-b border-slate-800/80">
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Amount Paid</span>
          <span class="text-lg font-bold text-emerald-400">₹{{ linkRecord.amount?.toLocaleString('en-IN') }}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-400">Customer</span>
          <span class="font-medium text-slate-200">{{ linkRecord.customer?.name }}</span>
        </div>
        <div v-if="paymentId" class="flex justify-between items-center text-sm">
          <span class="text-slate-400">Payment ID</span>
          <span class="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">{{ paymentId }}</span>
        </div>
        <div class="flex justify-between items-start text-sm">
          <span class="text-slate-400">Redirecting to</span>
          <span class="font-mono text-xs text-brand-400 max-w-[200px] truncate text-right">{{ targetUrl }}</span>
        </div>
      </div>

      <!-- Countdown redirect indicator -->
      <div class="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-3 text-left">
          <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
            {{ countdown }}
          </div>
          <div>
            <p class="text-xs font-semibold text-emerald-300">Auto-Redirecting...</p>
            <p class="text-xs text-slate-400">Forwarding you to the merchant destination</p>
          </div>
        </div>

        <button 
          @click="togglePause"
          class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 transition"
        >
          {{ isPaused ? 'Resume' : 'Pause' }}
        </button>
      </div>

      <!-- Manual Action Button -->
      <a 
        :href="targetUrlWithParams"
        class="inline-flex items-center justify-center w-full px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-[0.99] group"
      >
        <span>Proceed Immediately</span>
        <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>

      <div class="mt-6 text-xs text-slate-500 flex items-center justify-center space-x-2">
        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>Verified Razorpay Transaction &bull; Saved to Firestore</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const refId = computed(() => (route.query.ref as string) || '')
const paymentId = computed(() => (route.query.payment_id as string) || '')

const linkRecord = ref<any>(null)
const countdown = ref(3)
const isPaused = ref(false)
let timer: any = null

const targetUrl = computed(() => {
  return linkRecord.value?.fallbackUrl || (route.query.fallback as string) || 'https://google.com'
})

const targetUrlWithParams = computed(() => {
  try {
    const url = new URL(targetUrl.value)
    url.searchParams.set('payment_status', 'success')
    if (refId.value) url.searchParams.set('link_id', refId.value)
    if (paymentId.value) url.searchParams.set('payment_id', paymentId.value)
    return url.toString()
  } catch {
    return targetUrl.value
  }
})

const fetchLinkDetails = async () => {
  if (!refId.value) return
  try {
    const res: any = await $fetch(`/api/payment-links/${refId.value}`)
    if (res?.success && res.data) {
      linkRecord.value = res.data
    }
  } catch (err) {
    console.warn('Could not load detailed link info:', err)
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

onMounted(async () => {
  await fetchLinkDetails()

  timer = setInterval(() => {
    if (!isPaused.value) {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        window.location.href = targetUrlWithParams.value
      }
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
