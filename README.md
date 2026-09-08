# ⚡ RazorpayBullet — Nuxt Fullstack Payment Link Portal

A modern, fullstack **Nuxt 3** portal for generating **Razorpay Payment Links** with **Firebase Firestore** database persistence and custom **customer fallback redirect URLs**.

---

## 🌟 Key Features

1. **One-Page Payment Link Generator Portal**:
   - Create custom payment links in seconds with Amount (₹ INR), Customer Details (Name, Email, Phone), and Payment Description.
   - **Custom Fallback Redirect URL**: Configure any target destination (e.g., `https://yourdomain.com/thank-you?order_id=...` or WhatsApp link) where the customer will be automatically redirected upon successful payment.
   - Quick preset chips (₹100, ₹500, ₹1,000, ₹2,500, ₹5,000, ₹10,000).
   - Razorpay native SMS & Email notification triggers.
   - Shareable link with 1-click clipboard copy and WhatsApp quick share.
   - Interactive QR Code generator for UPI / mobile scanning.

2. **Firebase Firestore Database Integration**:
   - Automatically stores every generated payment link, customer details, fallback URLs, and transaction states.
   - Real-time status tracking (`PENDING`, `PAID`, `EXPIRED`, `CANCELLED`).
   - Built-in resilient fallback for local development before cloud credentials are provided.

3. **Verified Post-Payment Auto-Redirect Flow**:
   - Intercepts Razorpay payment completion via verified callback.
   - Updates Firestore record status to `PAID` with captured payment IDs and timestamps.
   - Renders a post-payment success screen with countdown timer and automatically forwards the customer to the merchant's saved fallback URL.

4. **Live & Sandbox Simulator Modes**:
   - Supports both live/test Razorpay API credentials and built-in mock checkout simulation for rapid testing.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
# Razorpay Credentials (https://dashboard.razorpay.com/#/app/keys)
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpaySecretHere

# Firebase Firestore Credentials (Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Webhook Secret (Optional)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Application URL
APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Setting Up Firebase Firestore (Free Tier)

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (Free Spark Plan).
2. Click **Build** > **Firestore Database** > **Create Database** (Select production or test mode).
3. Go to **Project Settings** (gear icon) > **Service Accounts**.
4. Click **Generate new private key** to download your service account JSON file.
5. Copy `project_id`, `client_email`, and `private_key` from the JSON file into your `.env` file.

---

## 💳 Setting Up Razorpay

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to **Test Mode** (or Live Mode when ready).
3. Go to **Settings** > **API Keys** > **Generate Key**.
4. Copy `Key Id` and `Key Secret` to your `.env` file.
5. (Optional Webhooks): Go to **Settings** > **Webhooks** > Add Webhook URL: `https://your-domain.com/api/webhooks/razorpay` and select `payment_link.paid`.

---

## 🏗️ Deployment to Firebase Hosting / Cloud Functions (Free Tier)

Nuxt Nitro supports 1-click deployment presets for Firebase:

```bash
# Build for Firebase
NITRO_PRESET=firebase npm run build

# Deploy to Firebase Hosting & Cloud Functions
firebase deploy
```

You can also deploy effortlessly to **Vercel**, **Netlify**, or any **Node.js server**.

---

## 📁 Project Structure

```
├── app/
│   ├── app.vue                  # Main app wrapper with NuxtPage
│   ├── pages/
│   │   ├── index.vue            # Main payment link generator & Firestore portal
│   │   ├── payment/
│   │   │   └── success.vue      # Post-payment verified auto-redirect page
│   │   └── pay/
│   │       └── [id].vue         # Test checkout sandbox simulator
├── assets/
│   └── css/main.css             # Glassmorphism design system & typography
├── server/
│   ├── api/
│   │   ├── payment-links/
│   │   │   ├── index.get.ts     # Fetch all links from Firestore
│   │   │   ├── index.post.ts    # Generate Razorpay link & save to Firestore
│   │   │   ├── [id]/
│   │   │   │   ├── index.get.ts # Fetch single payment link details
│   │   │   │   └── sync.get.ts  # Sync live status with Razorpay
│   │   │   └── callback.get.ts  # Intercept callback & forward to fallback URL
│   │   ├── webhooks/
│   │   │   └── razorpay.post.ts # Webhook listener for real-time payments
│   │   └── system/
│   │       └── status.get.ts    # System health & API credentials status
│   └── utils/
│       ├── firebase.ts          # Firebase Admin & Firestore database client
│       └── razorpay.ts          # Razorpay API client & payment link builder
├── nuxt.config.ts               # Nuxt 3 & Tailwind configuration
└── tailwind.config.js           # Theme styling, colors, and animations
```
