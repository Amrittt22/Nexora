
import {
  Bell,
  CheckCheck,
  MessageCircle,
  UserPlus,
  Pencil,
  X,
} from 'lucide-react'
import type { Notification } from '../../services/notification.service'

type NotificationDropdownProps = {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  onMarkAsRead: (id: string) => Promise<void>
  onMarkAllAsRead: () => Promise<void>
  onNotificationClick: (notification: Notification) => void
  onClose: () => void
}

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'TASK_ASSIGNED':
      return UserPlus
    case 'COMMENT_ADDED':
      return MessageCircle
    case 'TASK_UPDATED':
      return Pencil
    default:
      return Bell
  }
}

function getTimeAgo(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  )

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return new Date(date).toLocaleDateString()
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  loading,
  error,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  onClose,
}: NotificationDropdownProps) {
  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-700">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Notifications
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {unreadCount} unread
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void onMarkAllAsRead()}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-800"
            >
              <CheckCheck size={15} />
              Mark all read
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading notifications...
          </div>
        ) : error && notifications.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-red-500">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <div className="mb-3 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <Bell size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              You're all caught up!
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              New notifications will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)

            return (
              <div
                key={notification.id}
                className={`group flex gap-3 border-b border-slate-100 px-4 py-3 transition last:border-b-0 dark:border-slate-800 ${
                  notification.isRead
                    ? 'bg-white dark:bg-slate-900'
                    : 'bg-indigo-50/70 dark:bg-indigo-950/30'
                }`}
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
                  <Icon size={17} />
                </div>

                <button
                  type="button"
                  onClick={() => onNotificationClick(notification)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-sm leading-5 text-slate-800 dark:text-slate-200">
                    {notification.message}
                  </p>

                  {notification.task && (
                    <p className="mt-1 truncate text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {notification.task.title}
                    </p>
                  )}

                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                </button>

                <div className="flex shrink-0 flex-col items-center justify-center gap-2">
                  {!notification.isRead && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-indigo-600" />
                      <button
                        type="button"
                        title="Mark as read"
                        aria-label="Mark notification as read"
                        onClick={() => void onMarkAsRead(notification.id)}
                        className="text-slate-400 opacity-0 transition hover:text-indigo-600 group-hover:opacity-100 dark:hover:text-indigo-400"
                      >
                        <CheckCheck size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
