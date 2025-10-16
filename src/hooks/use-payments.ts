import useSWR from 'swr'
import { paymentApi } from '../lib/api-client'

export function usePayments(applicationId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    applicationId ? `/payments/application/${applicationId}` : null,
    applicationId ? () => paymentApi.getByApplication(applicationId).then(res => res.data) : null
  )

  return {
    payments: data || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function usePayment(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/payments/${id}` : null,
    () => paymentApi.getById(id).then(res => res.data)
  )

  return {
    payment: data,
    isLoading,
    error
  }
}