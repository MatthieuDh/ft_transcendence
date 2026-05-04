import { useEffect, useState } from 'react'
import { Stack, Heading, Box, Flex, Text, Badge, Button, Input, Avatar } from '@chakra-ui/react'
import { friendService, userService } from '../api/services'
import type { FriendUser, FriendRequest, User } from '../../../../shared/srcs/types'
import { toaster } from '../components/ui/toaster'

export default function FriendsPage() {
  const [friends, setFriends] = useState<FriendUser[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends')

  useEffect(() => {
    Promise.all([friendService.getMyFriends(), friendService.getRequests(), userService.getAllUsers()])
      .then(([f, r, u]) => {
        setFriends(Array.isArray(f.data) ? f.data : [])
        setRequests(Array.isArray(r.data) ? r.data : [])
        setAllUsers(Array.isArray(u.data) ? u.data : [])
      })
      .finally(() => setLoading(false))
  }, [])

  async function sendRequest(userId: number, username: string) {
    try {
      await friendService.sendRequest(userId)
      toaster.create({ title: `Verzoek gestuurd naar ${username}`, type: 'success' })
    } catch {
      toaster.create({ title: 'Kon verzoek niet sturen', type: 'error' })
    }
  }

  async function acceptRequest(requesterId: number) {
    try {
      await friendService.acceptRequest(requesterId)
      setRequests(prev => prev.filter(r => r.requesterId !== requesterId))
      toaster.create({ title: 'Vriendschapsverzoek geaccepteerd', type: 'success' })
    } catch {
      toaster.create({ title: 'Fout bij accepteren', type: 'error' })
    }
  }

  async function rejectRequest(requesterId: number) {
    try {
      await friendService.rejectRequest(requesterId)
      setRequests(prev => prev.filter(r => r.requesterId !== requesterId))
    } catch { /* ignore */ }
  }

  async function removeFriend(friendshipId: number) {
    try {
      await friendService.removeFriend(friendshipId)
      setFriends(prev => prev.filter(f => (f as any).friendshipId !== friendshipId))
    } catch { /* ignore */ }
  }

  const friendIds = new Set(friends.map(f => f.id))
  const filteredUsers = allUsers.filter(u =>
    !friendIds.has(u.id) &&
    u.username.toLowerCase().includes(search.toLowerCase()) &&
    search.length > 0
  )

  const pendingRequests = requests.filter(r => r.status === 'PENDING')

  const TabBtn = ({ tab, label, count }: { tab: typeof activeTab; label: string; count?: number }) => (
    <Button
      size="sm"
      variant={activeTab === tab ? 'solid' : 'ghost'}
      colorPalette={activeTab === tab ? 'purple' : 'gray'}
      onClick={() => setActiveTab(tab)}
    >
      {label} {count !== undefined && count > 0 && <Badge ml={1} colorPalette="red" variant="solid" borderRadius="full">{count}</Badge>}
    </Button>
  )

  return (
    <Stack gap={6}>
      <Heading size="lg">Vrienden</Heading>

      <Flex gap={2}>
        <TabBtn tab="friends" label="Mijn vrienden" count={friends.length} />
        <TabBtn tab="requests" label="Verzoeken" count={pendingRequests.length} />
        <TabBtn tab="search" label="Zoeken" />
      </Flex>

      {loading && <Text color="gray.500">Laden...</Text>}

      {activeTab === 'friends' && (
        <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100" p={6}>
          <Stack gap={3}>
            {friends.length === 0 && <Text fontSize="sm" color="gray.400">Nog geen vrienden. Zoek gebruikers om toe te voegen!</Text>}
            {friends.map((f, i) => (
              <Flex key={i} align="center" justify="space-between" p={3} borderRadius="md" _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}>
                <Flex align="center" gap={3}>
                  <Avatar.Root size="sm">
                    <Avatar.Image src={f.avatar ?? undefined} />
                    <Avatar.Fallback>{f.username[0].toUpperCase()}</Avatar.Fallback>
                  </Avatar.Root>
                  <Text fontWeight="medium">{f.username}</Text>
                </Flex>
                <Button size="xs" variant="ghost" colorPalette="red" onClick={() => removeFriend((f as any).friendshipId)}>Verwijderen</Button>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}

      {activeTab === 'requests' && (
        <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100" p={6}>
          <Stack gap={3}>
            {pendingRequests.length === 0 && <Text fontSize="sm" color="gray.400">Geen openstaande verzoeken.</Text>}
            {pendingRequests.map(r => (
              <Flex key={r.id} align="center" justify="space-between" p={3} borderRadius="md" bg="gray.50" _dark={{ bg: "gray.700" }}>
                <Flex align="center" gap={3}>
                  <Avatar.Root size="sm">
                    <Avatar.Fallback>{r.requester.username[0].toUpperCase()}</Avatar.Fallback>
                  </Avatar.Root>
                  <Box>
                    <Text fontWeight="medium">{r.requester.username}</Text>
                    <Text fontSize="xs" color="gray.500">{r.requester.email}</Text>
                  </Box>
                </Flex>
                <Flex gap={2}>
                  <Button size="sm" colorPalette="green" onClick={() => acceptRequest(r.requesterId)}>Accepteren</Button>
                  <Button size="sm" variant="ghost" colorPalette="red" onClick={() => rejectRequest(r.requesterId)}>Weigeren</Button>
                </Flex>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}

      {activeTab === 'search' && (
        <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100" p={6}>
          <Stack gap={4}>
            <Input placeholder="Zoek op gebruikersnaam..." value={search} onChange={e => setSearch(e.target.value)} size="lg" />
            {search && (
              <Stack gap={2}>
                {filteredUsers.length === 0 && <Text fontSize="sm" color="gray.400">Geen gebruikers gevonden.</Text>}
                {filteredUsers.map(u => (
                  <Flex key={u.id} align="center" justify="space-between" p={3} borderRadius="md" _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}>
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="sm">
                        <Avatar.Fallback>{u.username[0].toUpperCase()}</Avatar.Fallback>
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="medium">{u.username}</Text>
                        <Text fontSize="xs" color="gray.500">{u.email}</Text>
                      </Box>
                    </Flex>
                    <Button size="sm" colorPalette="purple" onClick={() => sendRequest(u.id, u.username)}>Toevoegen</Button>
                  </Flex>
                ))}
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
