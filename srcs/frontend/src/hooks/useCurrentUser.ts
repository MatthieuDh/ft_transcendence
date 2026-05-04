import { useEffect, useState } from 'react'
import { userService, notificationService } from '../api/services'
import type { User } from '../../../../shared/srcs/types'

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    // Decode userId from JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId: number = payload.sub
      userService.getUser(userId).then(r => {
        setUser(r.data)
        return notificationService.getNotifications(userId)
      }).then(r => {
        const unread = r.data.filter((n) => !(n as any).isRead).length
        setUnreadCount(unread)
      }).catch(() => {})
    } catch { /* invalid token */ }
  }, [])

  return { user, unreadCount, setUnreadCount }
}
