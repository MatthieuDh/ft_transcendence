import { useEffect, useState } from 'react'
import { Stack, Heading, Box, Flex, Text, Badge, Button } from '@chakra-ui/react'
import { notificationService } from '../api/services'

interface AppNotification {
  id: number
  type: string
  message: string
  isRead: boolean
  createdAt: string
  userId: number
}

function getToken() { return localStorage.getItem('access_token') }

function getUserId(): number | null {
  const token = getToken()
  if (!token) return null
  try { return JSON.parse(atob(token.split('.')[1])).sub } catch { return null }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  const userId = getUserId()

  useEffect(() => {
    if (!userId) return
    notificationService.getNotifications(userId)
      .then(r => setNotifications(Array.isArray(r.data) ? (r.data as unknown as AppNotification[]).reverse() : []))
      .finally(() => setLoading(false))
  }, [userId])

  async function markAllRead() {
    if (!userId) return
    await notificationService.markAsRead(userId)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const typeIcon: Record<string, string> = {
    PROJECT_CREATED: '📁',
    PROJECT_JOINED: '👥',
    PROJECT_DELETED: '🗑️',
    TASK_ASSIGNED: '✅',
    FRIEND_REQUEST: '👤',
    DEADLINE: '⏰',
  }

  const unread = notifications.filter(n => !n.isRead).length

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={3}>
          <Heading size="lg">Notificaties</Heading>
          {unread > 0 && <Badge colorPalette="red" borderRadius="full" px={2}>{unread} ongelezen</Badge>}
        </Flex>
        {unread > 0 && (
          <Button size="sm" variant="ghost" colorPalette="purple" onClick={markAllRead}>Alles als gelezen markeren</Button>
        )}
      </Flex>

      {loading && <Text color="gray.500">Laden...</Text>}

      <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <Stack gap={0} divideY="1px">
          {notifications.length === 0 && !loading && (
            <Box p={8} textAlign="center">
              <Text fontSize="2xl" mb={2}>🔔</Text>
              <Text color="gray.400">Geen notificaties</Text>
            </Box>
          )}
          {notifications.map(n => (
            <Flex key={n.id} align="flex-start" gap={4} p={4} bg={n.isRead ? "transparent" : "purple.50"} _dark={{ bg: n.isRead ? "transparent" : "purple.900" }}>
              <Text fontSize="xl">{typeIcon[n.type] ?? '🔔'}</Text>
              <Box flex={1}>
                <Text fontSize="sm">{n.message}</Text>
                <Text fontSize="xs" color="gray.400" mt={1}>{new Date(n.createdAt).toLocaleString('nl-BE')}</Text>
              </Box>
              {!n.isRead && <Box w="8px" h="8px" borderRadius="full" bg="purple.500" mt={1} flexShrink={0} />}
            </Flex>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}
