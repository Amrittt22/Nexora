
import { useCallback, useEffect, useState } from 'react'
import {
    fetchNotifications,
    fetchUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    type Notification,
} from '../services/notification.service'

export function useNotificationData(enabled: true) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const refreshNotifications = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const [notificationResponse, count] = await Promise.all([
                fetchNotifications(),
                fetchUnreadNotificationCount(),
            ])

            setNotifications(notificationResponse.notifications)
            setUnreadCount(count)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load notifications',
            )
        } finally {
            setLoading(false)
        }
    }, [])

    const markAsRead = useCallback(async (notificationId: string) => {
        const notification = notifications.find(
            (item) => item.id === notificationId,
        )

        if (!notification || notification.isRead) return

        try {
            await markNotificationAsRead(notificationId)

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notificationId
                        ? { ...item, isRead: true }
                        : item,
                ),
            )

            setUnreadCount((current) => Math.max(0, current - 1))
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to mark notification as read',
            )
            throw err
        }
    }, [notifications])

    const markAllAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead()

            setNotifications((current) =>
                current.map((item) => ({ ...item, isRead: true })),
            )

            setUnreadCount(0)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to mark all notifications as read',
            )
            throw err
        }
    }, [])
    useEffect(() => {
        if (enabled) {
            void refreshNotifications()
        }
    }, [enabled, refreshNotifications])
    return {
        notifications,
        unreadCount,
        loading,
        error,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
    }
}
