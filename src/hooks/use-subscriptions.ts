import useSWR from 'swr'
import { subscriptionApi } from '../lib/api-client'

export function useSubscriptions(applicationId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    applicationId ? `/subscriptions/application/${applicationId}` : null,
    applicationId ? () => subscriptionApi.getByApplication(applicationId).then(res => res.data) : null
  )

  return {
    subscriptions: data || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useSubscription(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/subscriptions/${id}` : null,
    () => subscriptionApi.getById(id).then(res => res.data)
  )

  return {
    subscription: data,
    isLoading,
    error
  }
}