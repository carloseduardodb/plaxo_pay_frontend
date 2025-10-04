export interface Payment {
  id: string
  applicationId: string
  amount: { amount: number; currency: string }
  method: "pix" | "credit_card" | "debit_card"
  status: "pending" | "approved" | "rejected" | "cancelled"
  description: string
  createdAt: string
  customerId: string
  subscriptionId?: string
}

export interface Subscription {
  id: string
  applicationId: string
  planName: string
  amount: { amount: number; currency: string }
  billingCycle: "monthly" | "quarterly" | "yearly"
  status: "active" | "cancelled" | "suspended"
  nextBillingDate: string
  customerId: string
  createdAt: string
}

export interface Application {
  id: string
  name: string
  apiKey: string
  isActive: boolean
  createdAt: string
}

export interface CreateApplicationRequest {
  name: string
  apiKey: string
  isActive: boolean
}

export interface AuthResponse {
  access_token: string
}
