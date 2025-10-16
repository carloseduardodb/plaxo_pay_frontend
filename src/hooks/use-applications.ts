import useSWR from 'swr'
import { applicationApi } from '../lib/api-client'

export interface Application {
  id: string
  name: string
  description?: string
  createdAt: string
}

export function useApplications() {
  const { data, error, isLoading, mutate } = useSWR(
    '/applications',
    () => applicationApi.getAll().then(res => res.data)
  )

  return {
    applications: data || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useApplication(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/applications/${id}` : null,
    () => applicationApi.getById(id).then(res => res.data)
  )

  return {
    application: data,
    isLoading,
    error
  }
}