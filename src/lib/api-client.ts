import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Payment {
  id: string
  applicationId: string
  externalId: string
  amount: {
    amount: string
    currency: string
  }
  method: 'pix' | 'credit_card' | 'debit_card' | 'bank_transfer'
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'
  description?: string
  metadata?: Record<string, any>
  subscriptionId?: string
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  applicationId: string
  planName: string
  amount: {
    amount: string
    currency: string
  }
  billingCycle: 'monthly' | 'quarterly' | 'yearly'
  status: 'active' | 'cancelled' | 'suspended' | 'expired'
  startDate: string
  nextBillingDate: string
  customerId: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export const paymentApi = {
  getById: (id: string) => apiClient.get<Payment>(`/payments/${id}`),
  create: (data: Partial<Payment>) => apiClient.post<Payment>('/payments', data),
  getByApplication: (applicationId: string, status?: string) => 
    apiClient.get<Payment[]>(`/payments/application/${applicationId}${status ? `?status=${status}` : ''}`),
  getBySubscription: (subscriptionId: string) => 
    apiClient.get<Payment[]>(`/payments/subscription/${subscriptionId}`),
}

export const subscriptionApi = {
  getById: (id: string) => apiClient.get<Subscription>(`/subscriptions/${id}`),
  create: (data: Partial<Subscription>) => apiClient.post<Subscription>('/subscriptions', data),
  getByApplication: (applicationId: string, status?: string) => 
    apiClient.get<Subscription[]>(`/subscriptions/application/${applicationId}${status ? `?status=${status}` : ''}`),
  getByCustomer: (customerId: string) => 
    apiClient.get<Subscription[]>(`/subscriptions/customer/${customerId}`),
  cancel: (id: string) => apiClient.put(`/subscriptions/${id}/cancel`),
  suspend: (id: string) => apiClient.put(`/subscriptions/${id}/suspend`),
  getDueForRenewal: () => apiClient.get<Subscription[]>('/subscriptions/renewals/due'),
}

export const applicationApi = {
  getAll: () => apiClient.get('/applications'),
  getById: (id: string) => apiClient.get(`/applications/${id}`),
  create: (data: any) => apiClient.post('/applications', data),
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<LoginResponse>('/auth/login', data),
}