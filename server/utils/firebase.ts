import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'

export interface PaymentLinkRecord {
  id: string
  razorpayLinkId?: string
  razorpayPaymentId?: string
  amount: number // in INR (e.g. 500)
  amountInPaise: number // in Paise (e.g. 50000)
  currency: string
  description: string
  customer: {
    name: string
    email?: string
    contact?: string
  }
  fallbackUrl: string // Custom redirect URL set by the merchant
  shortUrl: string // Shareable payment link
  status: 'created' | 'paid' | 'expired' | 'cancelled' | 'failed'
  notify: {
    sms: boolean
    email: boolean
  }
  notes?: Record<string, string>
  createdAt: string
  paidAt?: string
  updatedAt: string
  isMock?: boolean
}

// Local file-backed persistent store for dev when Firebase credentials are not provided
const localStore = new Map<string, PaymentLinkRecord>()
const DATA_DIR = path.resolve(process.cwd(), '.data')
const LOCAL_DATA_FILE = path.join(DATA_DIR, 'payment_links.json')

function loadLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const content = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8')
      const items: PaymentLinkRecord[] = JSON.parse(content)
      for (const item of items) {
        localStore.set(item.id, item)
      }
    }
  } catch (err) {
    console.warn(' [LocalStore] Could not load local cache file:', err)
  }
}

function saveLocalStoreToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    const items = Array.from(localStore.values())
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(items, null, 2), 'utf-8')
  } catch (err) {
    console.warn(' [LocalStore] Could not persist to local cache file:', err)
  }
}

// Load existing data at startup
loadLocalStore()

let firestoreInstance: admin.firestore.Firestore | null = null
let isFirebaseInitialized = false

export function getFirestoreDB(): admin.firestore.Firestore | null {
  if (firestoreInstance) return firestoreInstance

  const config = useRuntimeConfig()
  const projectId = config.firebaseProjectId || process.env.FIREBASE_PROJECT_ID
  const clientEmail = config.firebaseClientEmail || process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = config.firebasePrivateKey || process.env.FIREBASE_PRIVATE_KEY

  if (projectId && clientEmail && privateKey) {
    try {
      if (!admin.apps.length) {
        if (privateKey.includes('\\n')) {
          privateKey = privateKey.replace(/\\n/g, '\n')
        }

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey
          })
        })
      }
      firestoreInstance = admin.firestore()
      isFirebaseInitialized = true
      console.log('⚡ [Firebase] Connected to live Cloud Firestore:', projectId)
      return firestoreInstance
    } catch (err) {
      console.error(' [Firebase] Initialization failed, using local file store:', err)
      return null
    }
  }

  return null
}

export function isFirestoreActive(): boolean {
  getFirestoreDB()
  return isFirebaseInitialized
}

const COLLECTION_NAME = 'payment_links'

/**
 * Save or insert a new payment link record
 */
export async function savePaymentLink(record: PaymentLinkRecord): Promise<PaymentLinkRecord> {
  const db = getFirestoreDB()

  if (db) {
    try {
      await db.collection(COLLECTION_NAME).doc(record.id).set(record)
      return record
    } catch (err) {
      console.error(' [Firebase] Error saving to Firestore, caching locally:', err)
    }
  }

  localStore.set(record.id, record)
  saveLocalStoreToFile()
  return record
}

/**
 * Get all payment link records
 */
export async function getAllPaymentLinks(): Promise<PaymentLinkRecord[]> {
  const db = getFirestoreDB()

  if (db) {
    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .orderBy('createdAt', 'desc')
        .get()

      if (!snapshot.empty) {
        const records: PaymentLinkRecord[] = []
        snapshot.forEach(doc => {
          records.push(doc.data() as PaymentLinkRecord)
        })
        return records
      }
    } catch (err) {
      console.error('[Firebase] Error reading from Firestore, using local store:', err)
    }
  }

  loadLocalStore()
  const records = Array.from(localStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return records
}

/**
 * Find payment link by internal ID
 */
export async function getPaymentLinkById(id: string): Promise<PaymentLinkRecord | null> {
  const db = getFirestoreDB()

  if (db) {
    try {
      const doc = await db.collection(COLLECTION_NAME).doc(id).get()
      if (doc.exists) {
        return doc.data() as PaymentLinkRecord
      }
    } catch (err) {
      console.error(' [Firebase] Error fetching document by ID:', err)
    }
  }

  loadLocalStore()
  return localStore.get(id) || null
}

/**
 * Find payment link by Razorpay Payment Link ID
 */
export async function getPaymentLinkByRazorpayId(rzpLinkId: string): Promise<PaymentLinkRecord | null> {
  const db = getFirestoreDB()

  if (db) {
    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .where('razorpayLinkId', '==', rzpLinkId)
        .limit(1)
        .get()

      if (!snapshot.empty) {
        return snapshot.docs[0].data() as PaymentLinkRecord
      }
    } catch (err) {
      console.error(' [Firebase] Error querying by Razorpay Link ID:', err)
    }
  }

  loadLocalStore()
  for (const record of localStore.values()) {
    if (record.razorpayLinkId === rzpLinkId) {
      return record
    }
  }

  return null
}

/**
 * Update payment link status (e.g. marked as 'paid', 'expired', 'failed')
 */
export async function updatePaymentLinkStatus(
  id: string,
  status: PaymentLinkRecord['status'],
  additionalData: Partial<PaymentLinkRecord> = {}
): Promise<PaymentLinkRecord | null> {
  const existing = await getPaymentLinkById(id)
  if (!existing) return null

  const updatedRecord: PaymentLinkRecord = {
    ...existing,
    ...additionalData,
    status,
    updatedAt: new Date().toISOString(),
    paidAt: status === 'paid' ? (additionalData.paidAt || new Date().toISOString()) : existing.paidAt
  }

  const db = getFirestoreDB()
  if (db) {
    try {
      await db.collection(COLLECTION_NAME).doc(id).update(updatedRecord as any)
    } catch (err) {
      console.error(' [Firebase] Error updating Firestore record:', err)
    }
  }

  localStore.set(id, updatedRecord)
  saveLocalStoreToFile()
  return updatedRecord
}
