<template>
  <div class="min-h-screen bg-[#07090e] bg-grid-mesh text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
    <!-- Ambient glowing backgrounds -->
    <div class="fixed top-0 left-1/4 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
    <div class="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

    <!-- Top Navigation -->
    <header class="sticky top-0 z-30 border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-extrabold text-lg text-white tracking-tight">Razorpay<span class="text-brand-400">Bullet</span></span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wide">
                Portal
              </span>
            </div>
            <p class="text-[11px] text-slate-400 font-medium hidden sm:block">Nuxt Fullstack &bull; Firebase Firestore &bull; Razorpay</p>
          </div>
        </div>

        <!-- System Status & Controls -->
        <div class="flex items-center space-x-3">
          <!-- Status Pill -->
          <div 
            @click="showConfigModal = true"
            class="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition text-xs"
          >
            <span class="w-2 h-2 rounded-full" :class="systemStatus.razorpay?.active ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'" />
            <span class="text-slate-300 font-medium">
              Razorpay: {{ systemStatus.razorpay?.active ? (systemStatus.razorpay.mode === 'live' ? 'Live' : 'Test') : 'Sandbox' }}
            </span>
            <span class="text-slate-600">&bull;</span>
            <span class="w-2 h-2 rounded-full" :class="systemStatus.firebase?.active ? 'bg-emerald-400' : 'bg-cyan-400'" />
            <span class="text-slate-300 font-medium">
              Firestore: {{ systemStatus.firebase?.active ? 'Cloud' : 'Local DB' }}
            </span>
          </div>

          <!-- Setup Guide Button -->
          <button 
            @click="showConfigModal = true"
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition flex items-center space-x-1.5"
          >
            <svg class="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Credentials / Setup</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Metrics Overview -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Metric 1 -->
        <div class="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Links</span>
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
          <div class="text-2xl font-black text-white">{{ stats.totalCount }}</div>
          <p class="text-[11px] text-slate-500 mt-1">Generated payment links</p>
        </div>

        <!-- Metric 2 -->
        <div class="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="text-2xl font-black text-emerald-400">₹{{ stats.paidAmount.toLocaleString('en-IN') }}</div>
          <p class="text-[11px] text-slate-500 mt-1">Collected from paid links</p>
        </div>

        <!-- Metric 3 -->
        <div class="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paid / Success</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="text-2xl font-black text-white">{{ stats.paidCount }} <span class="text-xs font-normal text-emerald-400">({{ stats.successRate }}%)</span></div>
          <p class="text-[11px] text-slate-500 mt-1">Transactions completed</p>
        </div>

        <!-- Metric 4 -->
        <div class="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Links</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="text-2xl font-black text-amber-400">{{ stats.pendingCount }}</div>
          <p class="text-[11px] text-slate-500 mt-1">Awaiting customer payment</p>
        </div>
      </section>

      <!-- Main Portal Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Payment Link Generator Card (5 Cols) -->
        <section class="lg:col-span-5 space-y-6">
          <div class="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 relative shadow-2xl">
            <!-- Glow indicator on top of card -->
            <div class="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
            
            <div class="mb-6">
              <div class="flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full bg-brand-400" />
                <h2 class="text-xl font-bold text-white tracking-tight">Generate Payment Link</h2>
              </div>
              <p class="text-xs text-slate-400 mt-1">
                Create a custom Razorpay link with your customer's fallback destination URL.
              </p>
            </div>

            <form @submit.prevent="generateLink" class="space-y-4">
              
              <!-- Amount Field -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Amount (INR) <span class="text-brand-400">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-base">
                    ₹
                  </div>
                  <input
                    v-model="form.amount"
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="500"
                    class="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-bold text-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                  />
                </div>

                <!-- Quick amount chips -->
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <button
                    v-for="preset in [100, 500, 1000, 2500, 5000]"
                    :key="preset"
                    type="button"
                    @click="form.amount = preset"
                    class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
                  >
                    +₹{{ preset }}
                  </button>
                </div>
              </div>

              <!-- Customer Name -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Customer Name <span class="text-brand-400">*</span>
                </label>
                <input
                  v-model="form.customerName"
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                />
              </div>

              <!-- Customer Email & Phone (2 cols) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email 
                  </label>
                  <input
                    v-model="form.customerEmail"
                    type="email"
                    required
                    placeholder="vikram@example.com"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone 
                  </label>
                  <input
                    v-model="form.customerContact"
                    type="tel"
                    required
                    placeholder="9876543210"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                  />
                </div>
              </div>

              <!-- Description / Purpose -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payment Purpose / Note
                </label>
                <input
                  v-model="form.description"
                  type="text"
                  placeholder="e.g. Consultation Fee - Order #402"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                />
              </div>

              <!-- FALLBACK / REDIRECT URL (Crucial Requirement) -->
              <div class="p-4 rounded-2xl bg-brand-950/30 border border-brand-800/40 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-brand-300 uppercase tracking-wider">
                    Customer Fallback Redirect URL <span class="text-red-400">*</span>
                  </label>
                  <span class="text-[10px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">Auto-Redirect</span>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <input
                    v-model="form.fallbackUrl"
                    type="url"
                    required
                    placeholder="https://yourdomain.com/thank-you?order_id=402"
                    class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-brand-700/50 text-white text-xs font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                  />
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed">
                  Upon completing payment on Razorpay, the customer will be automatically redirected to this URL with payment verification parameters.
                </p>
                <!-- Quick sample templates -->
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    @click="form.fallbackUrl = 'https://google.com'"
                    class="text-[10px] text-slate-400 hover:text-brand-300 underline"
                  >
                    Google Example
                  </button>
                  <span class="text-slate-600">&bull;</span>
                  <button
                    type="button"
                    @click="form.fallbackUrl = 'https://httpbin.org/get?status=success'"
                    class="text-[10px] text-slate-400 hover:text-brand-300 underline"
                  >
                    HttpBin Inspector
                  </button>
                </div>
              </div>

              <!-- Notifications & Expiry Dropdown Options -->
              <div class="pt-1 flex items-center justify-between text-xs text-slate-400">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="form.notifySms" type="checkbox" class="rounded bg-slate-900 border-slate-700 text-brand-500 focus:ring-0" />
                  <span>Notify via SMS</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input v-model="form.notifyEmail" type="checkbox" class="rounded bg-slate-900 border-slate-700 text-brand-500 focus:ring-0" />
                  <span>Notify via Email</span>
                </label>
              </div>

              <!-- Error Alert -->
              <div v-if="formError" class="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
                <svg class="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formError }}</span>
              </div>

              <!-- Submit CTA -->
              <button
                type="submit"
                :disabled="generating"
                class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-blue-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 shadow-lg shadow-brand-500/25 transition-all transform active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <div v-if="generating" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ generating ? 'Generating Link & Saving...' : 'Generate Razorpay Link' }}</span>
              </button>
            </form>
          </div>

          <!-- Recently Created Active Link Highlight -->
          <div v-if="latestCreatedLink" class="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/10 shadow-xl animate-fade-in relative">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <div class="flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Link Ready to Share</span>
              </div>
              <span class="text-xs font-mono text-slate-400">₹{{ latestCreatedLink.amount }}</span>
            </div>

            <div class="mt-4 space-y-3">
              <!-- Shareable link display with copy -->
              <div>
                <label class="block text-[11px] text-slate-400 mb-1">Customer Payment Link</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    readonly
                    :value="latestCreatedLink.shortUrl"
                    class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-brand-300 select-all outline-none"
                  />
                  <button
                    @click="copyText(latestCreatedLink.shortUrl)"
                    class="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition shrink-0 flex items-center space-x-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
                  </button>
                </div>
              </div>

              <!-- Quick action links -->
              <div class="flex items-center space-x-2 pt-2">
                <a
                  :href="latestCreatedLink.shortUrl"
                  target="_blank"
                  class="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-medium text-slate-200 transition flex items-center justify-center space-x-1"
                >
                  <svg class="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Test Link</span>
                </a>

                <button
                  @click="openQrModal(latestCreatedLink)"
                  class="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition flex items-center justify-center space-x-1"
                >
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span>View QR</span>
                </button>

                <a
                  :href="`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${latestCreatedLink.customer.name}, please complete your payment of ₹${latestCreatedLink.amount} using this link: ${latestCreatedLink.shortUrl}`)}`"
                  target="_blank"
                  class="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center justify-center space-x-1"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Right: Payment Links History & Management Table (7 Cols) -->
        <section class="lg:col-span-7 space-y-4">
          <div class="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl space-y-5">
            
            <!-- Table Header & Controls -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 class="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                  <span>Saved Payment Links</span>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {{ filteredLinks.length }}
                  </span>
                </h2>
                <p class="text-xs text-slate-400 mt-0.5">Persisted in Firebase Firestore database</p>
              </div>

              <!-- Refresh button -->
              <button
                @click="fetchPaymentLinks"
                :disabled="loadingLinks"
                class="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingLinks }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>

            <!-- Search & Status Filter Tabs -->
            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Search Bar -->
              <div class="relative flex-1">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search customer, email, or link ID..."
                  class="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-brand-500 outline-none transition"
                />
              </div>

              <!-- Status Filters -->
              <div class="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <button
                  v-for="tab in ['all', 'paid', 'created']"
                  :key="tab"
                  @click="statusFilter = tab"
                  :class="statusFilter === tab ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition"
                >
                  {{ tab === 'created' ? 'Pending' : tab }}
                </button>
              </div>
            </div>

            <!-- Links Table -->
            <div class="overflow-x-auto rounded-2xl border border-slate-800/80">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th class="py-3 px-4">Customer & Note</th>
                    <th class="py-3 px-3">Amount</th>
                    <th class="py-3 px-3">Fallback URL</th>
                    <th class="py-3 px-3">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 bg-slate-950/40">
                  
                  <tr v-if="loadingLinks">
                    <td colspan="5" class="py-12 text-center text-slate-400">
                      <div class="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <span>Loading records from Firestore...</span>
                    </td>
                  </tr>

                  <tr v-else-if="filteredLinks.length === 0">
                    <td colspan="5" class="py-12 text-center text-slate-500">
                      <svg class="w-8 h-8 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p class="font-medium text-slate-400">No payment links found</p>
                      <p class="text-[11px] text-slate-600 mt-0.5">Generate your first payment link using the form on the left</p>
                    </td>
                  </tr>

                  <tr 
                    v-for="link in filteredLinks" 
                    :key="link.id" 
                    class="hover:bg-slate-900/50 transition group"
                  >
                    <!-- Customer & Note -->
                    <td class="py-3 px-4">
                      <div class="font-bold text-white">{{ link.customer?.name || 'Customer' }}</div>
                      <div class="text-[11px] text-slate-400 truncate max-w-[160px]">{{ link.description || 'Payment' }}</div>
                      <div class="text-[10px] text-slate-500 font-mono mt-0.5">{{ formatDate(link.createdAt) }}</div>
                    </td>

                    <!-- Amount -->
                    <td class="py-3 px-3 font-bold text-slate-200">
                      ₹{{ link.amount?.toLocaleString('en-IN') }}
                    </td>

                    <!-- Fallback URL -->
                    <td class="py-3 px-3">
                      <a 
                        :href="link.fallbackUrl" 
                        target="_blank" 
                        class="text-brand-400 hover:underline font-mono text-[11px] max-w-[140px] truncate block flex items-center space-x-1"
                        :title="link.fallbackUrl"
                      >
                        <span class="truncate">{{ formatDomain(link.fallbackUrl) }}</span>
                        <svg class="w-3 h-3 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>

                    <!-- Status Badge -->
                    <td class="py-3 px-3">
                      <span 
                        v-if="link.status === 'paid'"
                        class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>PAID</span>
                      </span>

                      <span 
                        v-else-if="link.status === 'expired'"
                        class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700"
                      >
                        <span>EXPIRED</span>
                      </span>

                      <span 
                        v-else
                        class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>PENDING</span>
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-right">
                      <div class="flex items-center justify-end space-x-1.5">
                        <!-- Copy URL -->
                        <button
                          @click="copyText(link.shortUrl)"
                          title="Copy Link"
                          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>

                        <!-- View QR Code -->
                        <button
                          @click="openQrModal(link)"
                          title="View QR Code"
                          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                        </button>

                        <!-- Sync Status with Razorpay -->
                        <button
                          @click="syncStatus(link)"
                          :disabled="syncingId === link.id"
                          title="Sync Status with Razorpay"
                          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': syncingId === link.id }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>

                        <!-- Inspect Details Modal -->
                        <button
                          @click="openDetailsModal(link)"
                          title="View Details"
                          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </section>

      </div>
    </main>

    <!-- Toast Notification Banner -->
    <div 
      v-if="toastMessage" 
      class="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-white text-xs font-semibold flex items-center space-x-2 animate-slide-up"
    >
      <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- QR Code Modal -->
    <div v-if="selectedQrLink" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-sm glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl text-center space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="font-bold text-white text-sm">Scan to Pay via UPI</h3>
          <button @click="selectedQrLink = null" class="text-slate-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- QR Canvas Container -->
        <div class="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto">
          <canvas ref="qrCanvasRef" class="w-48 h-48"></canvas>
        </div>

        <div>
          <div class="text-xl font-extrabold text-white">₹{{ selectedQrLink.amount }}</div>
          <p class="text-xs text-slate-400">{{ selectedQrLink.customer?.name }}</p>
          <p class="text-[10px] font-mono text-brand-400 mt-1 truncate">{{ selectedQrLink.shortUrl }}</p>
        </div>

        <div class="flex items-center space-x-2 pt-2">
          <button
            @click="copyText(selectedQrLink.shortUrl)"
            class="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Copy URL
          </button>
          <a
            :href="selectedQrLink.shortUrl"
            target="_blank"
            class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition text-center"
          >
            Open Link
          </a>
        </div>
      </div>
    </div>

    <!-- Link Details Modal -->
    <div v-if="selectedDetailsLink" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="font-bold text-white text-sm">Payment Link Details</h3>
          <button @click="selectedDetailsLink = null" class="text-slate-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span class="text-slate-500 block">Unique Link ID:</span>
            <span class="font-mono text-slate-200 select-all">{{ selectedDetailsLink.id }}</span>
          </div>

          <div v-if="selectedDetailsLink.razorpayLinkId" class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span class="text-slate-500 block">Razorpay Link ID:</span>
            <span class="font-mono text-slate-200 select-all">{{ selectedDetailsLink.razorpayLinkId }}</span>
          </div>

          <div v-if="selectedDetailsLink.razorpayPaymentId" class="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-1">
            <span class="text-emerald-400 block">Captured Payment ID:</span>
            <span class="font-mono text-emerald-200 select-all">{{ selectedDetailsLink.razorpayPaymentId }}</span>
          </div>

          <div class="p-3 bg-brand-950/30 border border-brand-800/40 rounded-xl space-y-1">
            <span class="text-brand-300 font-semibold block">Configured Fallback Redirect Destination:</span>
            <a :href="selectedDetailsLink.fallbackUrl" target="_blank" class="font-mono text-brand-400 hover:underline break-all">
              {{ selectedDetailsLink.fallbackUrl }}
            </a>
          </div>

          <div class="grid grid-cols-2 gap-2 text-slate-300">
            <div class="p-2.5 bg-slate-900 rounded-xl">
              <span class="text-slate-500 block text-[10px]">Created At</span>
              <span>{{ formatDate(selectedDetailsLink.createdAt) }}</span>
            </div>
            <div class="p-2.5 bg-slate-900 rounded-xl">
              <span class="text-slate-500 block text-[10px]">Status</span>
              <span class="uppercase font-bold" :class="selectedDetailsLink.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'">
                {{ selectedDetailsLink.status }}
              </span>
            </div>
          </div>
        </div>

        <button
          @click="selectedDetailsLink = null"
          class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Setup / Configuration Modal -->
    <div v-if="showConfigModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 class="font-bold text-white text-base">Configuration & Credentials Guide</h3>
          </div>
          <button @click="showConfigModal = false" class="text-slate-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4 text-xs text-slate-300">
          <!-- Active Status Highlights -->
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div class="text-slate-400 font-semibold mb-1">Razorpay Engine</div>
              <div class="font-mono text-sm" :class="systemStatus.razorpay?.active ? 'text-emerald-400' : 'text-amber-400'">
                {{ systemStatus.razorpay?.active ? `Active (${systemStatus.razorpay.mode})` : 'Sandbox Simulator' }}
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div class="text-slate-400 font-semibold mb-1">Firestore Persistence</div>
              <div class="font-mono text-sm" :class="systemStatus.firebase?.active ? 'text-emerald-400' : 'text-cyan-400'">
                {{ systemStatus.firebase?.active ? 'Cloud Firestore' : 'Local In-Memory DB' }}
              </div>
            </div>
          </div>

          <!-- Env Guide -->
          <div>
            <h4 class="font-bold text-slate-200 mb-2">Connecting Live Razorpay & Firebase Firestore</h4>
            <p class="text-slate-400 mb-3 leading-relaxed">
              Create a <code class="text-brand-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">.env</code> file in your project root with the following keys:
            </p>
            <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-brand-300 overflow-x-auto leading-relaxed select-all">
# Razorpay Credentials (from https://dashboard.razorpay.com/#/app/keys)
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpaySecretHere

# Firebase Firestore Credentials (from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Webhook Secret (optional)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# App URL
APP_URL=http://localhost:3000
</pre>
          </div>

          <div class="p-3 bg-brand-950/20 border border-brand-800/30 rounded-xl text-slate-400">
            <span class="font-bold text-brand-300 block mb-1">Customer Fallback Flow:</span>
            When a customer clicks your generated link and completes payment, Razorpay redirects via our verified callback interceptor which saves the transaction state to Firestore and immediately redirects the customer to their target fallback URL.
          </div>
        </div>

        <button
          @click="showConfigModal = false"
          class="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition"
        >
          Got it
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'

// State
const form = ref({
  amount: 500,
  customerName: '',
  customerEmail: '',
  customerContact: '',
  description: '',
  fallbackUrl: 'https://example.com/thank-you',
  notifySms: false,
  notifyEmail: false
})

const generating = ref(false)
const formError = ref('')
const copied = ref(false)
const toastMessage = ref('')

const paymentLinks = ref<any[]>([])
const loadingLinks = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const syncingId = ref<string | null>(null)

const latestCreatedLink = ref<any>(null)
const selectedQrLink = ref<any>(null)
const selectedDetailsLink = ref<any>(null)
const showConfigModal = ref(false)
const qrCanvasRef = ref<HTMLCanvasElement | null>(null)

const systemStatus = ref<any>({
  razorpay: { active: false, mode: 'mock' },
  firebase: { active: false, mode: 'in_memory_fallback' }
})

// Metrics computation
const stats = computed(() => {
  const totalCount = paymentLinks.value.length
  const paidLinks = paymentLinks.value.filter(l => l.status === 'paid')
  const paidCount = paidLinks.length
  const paidAmount = paidLinks.reduce((sum, l) => sum + (Number(l.amount) || 0), 0)
  const pendingCount = paymentLinks.value.filter(l => l.status !== 'paid' && l.status !== 'expired').length
  const successRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0

  return {
    totalCount,
    paidCount,
    paidAmount,
    pendingCount,
    successRate
  }
})

// Filtered payment links
const filteredLinks = computed(() => {
  let list = paymentLinks.value

  if (statusFilter.value !== 'all') {
    list = list.filter(l => l.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(l => 
      l.customer?.name?.toLowerCase().includes(q) ||
      l.customer?.email?.toLowerCase().includes(q) ||
      l.id?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q)
    )
  }

  return list
})

// Fetch System Status
const fetchSystemStatus = async () => {
  try {
    const res: any = await $fetch('/api/system/status')
    if (res) systemStatus.value = res
  } catch (err) {
    console.warn('System status fetch error:', err)
  }
}

// Fetch Payment Links
const fetchPaymentLinks = async () => {
  loadingLinks.value = true
  try {
    const res: any = await $fetch('/api/payment-links')
    if (res?.success && Array.isArray(res.links)) {
      paymentLinks.value = res.links
    }
  } catch (err: any) {
    showToast(err?.statusMessage || 'Failed to fetch payment links')
  } finally {
    loadingLinks.value = false
  }
}

// Generate New Payment Link
const generateLink = async () => {
  formError.value = ''
  generating.value = true

  try {
    const res: any = await $fetch('/api/payment-links', {
      method: 'POST',
      body: {
        amount: form.value.amount,
        customer: {
          name: form.value.customerName,
          email: form.value.customerEmail || undefined,
          contact: form.value.customerContact || undefined
        },
        description: form.value.description,
        fallbackUrl: form.value.fallbackUrl,
        notify: {
          sms: form.value.notifySms,
          email: form.value.notifyEmail
        }
      }
    })

    if (res?.success && res.data) {
      latestCreatedLink.value = res.data
      paymentLinks.value.unshift(res.data)
      showToast(`Payment Link generated for ₹${res.data.amount}!`)

      // Reset form
      form.value.customerName = ''
      form.value.customerEmail = ''
      form.value.customerContact = ''
      form.value.description = ''
    }
  } catch (err: any) {
    formError.value = err?.statusMessage || err?.message || 'Failed to generate payment link'
  } finally {
    generating.value = false
  }
}

// Sync link status with Razorpay
const syncStatus = async (link: any) => {
  syncingId.value = link.id
  try {
    const res: any = await $fetch(`/api/payment-links/${link.id}/sync`)
    if (res?.success && res.data) {
      const idx = paymentLinks.value.findIndex(l => l.id === link.id)
      if (idx !== -1) {
        paymentLinks.value[idx] = res.data
      }
      showToast(res.message || 'Status synced')
    }
  } catch (err: any) {
    showToast('Failed to sync status')
  } finally {
    syncingId.value = null
  }
}

// QR Code Modal Trigger
const openQrModal = async (link: any) => {
  selectedQrLink.value = link
  await nextTick()
  if (qrCanvasRef.value && link.shortUrl) {
    QRCode.toCanvas(qrCanvasRef.value, link.shortUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#07090e',
        light: '#ffffff'
      }
    })
  }
}

// Details Modal Trigger
const openDetailsModal = (link: any) => {
  selectedDetailsLink.value = link
}

// Copy to Clipboard
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    showToast('Link copied to clipboard!')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    showToast('Could not copy to clipboard')
  }
}

// Toast helper
const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = ''
  }, 3500)
}

// Utilities
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Just now'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const formatDomain = (urlStr: string) => {
  try {
    const u = new URL(urlStr)
    return u.hostname + (u.pathname !== '/' ? u.pathname : '')
  } catch {
    return urlStr
  }
}

onMounted(() => {
  fetchSystemStatus()
  fetchPaymentLinks()
})
</script>
