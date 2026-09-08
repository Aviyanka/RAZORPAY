<template>
  <div class="min-h-screen bg-[#07090e] bg-grid-mesh flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-brand-500 selection:text-white">
    <!-- Ambient glow -->
    <div class="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 animate-slide-up">
      <!-- Header -->
      <div class="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-md shadow-brand-500/20">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 class="font-bold text-white text-base">Razorpay Checkout</h1>
            <p class="text-xs text-amber-400 font-medium">Test Simulation Sandbox</p>
          </div>
        </div>
        <span class="text-xs font-mono bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2.5 py-1 rounded-full">
          SECURE
        </span>
      </div>

      <div v-if="loading" class="py-12 text-center text-slate-400">
        <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p class="text-sm">Loading checkout details...</p>
      </div>

      <div v-else-if="!linkRecord" class="py-8 text-center">
        <p class="text-red-400 font-medium mb-2">Payment Link Not Found</p>
        <p class="text-xs text-slate-400 mb-4">This link may have expired or is invalid.</p>
        <NuxtLink to="/" class="text-xs text-brand-400 hover:underline">Return to Portal</NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <!-- Amount Card -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Payable Amount</p>
          <div class="text-3xl font-black text-white tracking-tight">
            ₹{{ linkRecord.amount?.toLocaleString('en-IN') }}
          </div>
          <p class="text-xs text-slate-400 mt-1 truncate">{{ linkRecord.description || 'Payment Order' }}</p>
        </div>

        <!-- Customer details -->
        <div class="space-y-2 text-xs text-slate-300 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
          <div class="flex justify-between">
            <span class="text-slate-500">Paying as:</span>
            <span class="font-medium text-slate-200">{{ linkRecord.customer?.name }}</span>
          </div>
          <div v-if="linkRecord.customer?.email" class="flex justify-between">
            <span class="text-slate-500">Email:</span>
            <span class="text-slate-300 font-mono">{{ linkRecord.customer.email }}</span>
          </div>
          <div v-if="linkRecord.customer?.contact" class="flex justify-between">
            <span class="text-slate-500">Phone:</span>
            <span class="text-slate-300 font-mono">{{ linkRecord.customer.contact }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Fallback Target:</span>
            <span class="text-brand-400 font-mono truncate max-w-[180px]">{{ linkRecord.fallbackUrl }}</span>
          </div>
        </div>

        <!-- Simulated Payment Method Select -->
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Payment Method
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              type="button"
              @click="selectedMethod = 'upi'"
              :class="selectedMethod === 'upi' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'"
              class="p-3 rounded-xl border text-xs font-medium flex items-center space-x-2 transition"
            >
              <span class="w-2 h-2 rounded-full" :class="selectedMethod === 'upi' ? 'bg-brand-400' : 'bg-slate-600'" />
              <span>UPI / QR</span>
            </button>

            <button 
              type="button"
              @click="selectedMethod = 'card'"
              :class="selectedMethod === 'card' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'"
              class="p-3 rounded-xl border text-xs font-medium flex items-center space-x-2 transition"
            >
              <span class="w-2 h-2 rounded-full" :class="selectedMethod === 'card' ? 'bg-brand-400' : 'bg-slate-600'" />
              <span>Cards</span>
            </button>

            <button 
              type="button"
              @click="selectedMethod = 'netbanking'"
              :class="selectedMethod === 'netbanking' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'"
              class="p-3 rounded-xl border text-xs font-medium flex items-center space-x-2 transition"
            >
              <span class="w-2 h-2 rounded-full" :class="selectedMethod === 'netbanking' ? 'bg-brand-400' : 'bg-slate-600'" />
              <span>NetBanking</span>
            </button>

            <button 
              type="button"
              @click="selectedMethod = 'wallet'"
              :class="selectedMethod === 'wallet' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'"
              class="p-3 rounded-xl border text-xs font-medium flex items-center space-x-2 transition"
            >
              <span class="w-2 h-2 rounded-full" :class="selectedMethod === 'wallet' ? 'bg-brand-400' : 'bg-slate-600'" />
              <span>Wallets</span>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-2 pt-2">
          <button
            @click="completePayment"
            :disabled="processing"
            class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-blue-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 shadow-lg shadow-brand-500/25 transition transform active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <div v-if="processing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span v-else>Simulate Successful Payment</span>
          </button>

          <NuxtLink
            to="/"
            class="block w-full text-center py-2.5 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Cancel and Return to Portal
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const rawId = route.params.id as string
const internalId = rawId?.replace('mock-', '') || ''

const linkRecord = ref<any>(null)
const loading = ref(true)
const processing = ref(false)
const selectedMethod = ref('upi')

onMounted(async () => {
  try {
    const res: any = await $fetch(`/api/payment-links/${internalId}`)
    if (res?.success && res.data) {
      linkRecord.value = res.data
    }
  } catch (err) {
    console.error('Failed to load link:', err)
  } finally {
    loading.value = false
  }
})

const completePayment = () => {
  if (!linkRecord.value) return
  processing.value = true

  const mockPaymentId = `pay_sim_${Date.now()}`
  
  // Forward to callback handler to execute Firestore record update & fallback redirect
  setTimeout(() => {
    window.location.href = `/api/payment-links/callback?ref=${encodeURIComponent(linkRecord.value.id)}&razorpay_payment_id=${mockPaymentId}&razorpay_payment_link_status=paid`
  }, 700)
}
</script>
