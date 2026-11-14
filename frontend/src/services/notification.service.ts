
import { supabase } from '../lib/supabase'

export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'COMMENT_ADDED'
  | 'TASK_UPDATED'

export type Notification = {
  id: string
  type: NotificationType
  message: string
  isRead: boolean
  recipientId: string
  actorId: string | null
  taskId: string | null
  createdAt: string
  actor?: {
    id: string
    displayName: string | null
    email: string
  } | null
  task?: {
    id: string
    title: string
  } | null
}

export type NotificationResponse = {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type UnreadCountResponse = {
  count: number
}

type ApiMessageResponse = {
  message?: string
  count?: number
  error?: string
}

async function notificationRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const apiUrl = import.meta.env.VITE_API_URL

  if (!apiUrl) {
    throw new Error('VITE_API_URL is missing from frontend/.env')
  }

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  const accessToken = data.session?.access_token

  if (!accessToken) {
    throw new Error('You must be signed in to access notifications')
  }

  const response = await fetch(
    `${apiUrl}/api/v1/notifications${endpoint}`,
    {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.error ?? `Notification request failed (${response.status})`,
    )
  }

  return result as T
}

export async function fetchNotifications(
  page = 1,
  limit = 20,
): Promise<NotificationResponse> {
  return notificationRequest<NotificationResponse>(
    `?page=${page}&limit=${limit}`,
  )
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  const result = await notificationRequest<UnreadCountResponse>(
    '/unread-count',
  )

  return result.count
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<void> {
  await notificationRequest<ApiMessageResponse>(
    `/${encodeURIComponent(notificationId)}/read`,
    { method: 'PATCH' },
  )
}

export async function markAllNotificationsAsRead(): Promise<number> {
  const result = await notificationRequest<ApiMessageResponse>(
    '/read-all',
    { method: 'PATCH' },
  )

  return result.count ?? 0
}
