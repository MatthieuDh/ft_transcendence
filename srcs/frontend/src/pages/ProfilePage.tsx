import { useEffect, useState } from 'react'
import { Stack, Box, Heading, Text, Flex, Avatar, Input, Button } from '@chakra-ui/react'
import { userService } from '../api/services'
import type { User } from '../../../../shared/srcs/types'
import { Field } from '../components/ui/field'
import { PasswordInput } from '../components/ui/password-input'
import { toaster } from '../components/ui/toaster'

function getUserId(): number | null {
  const token = localStorage.getItem('access_token')
  if (!token) return null
  try { return JSON.parse(atob(token.split('.')[1])).sub } catch { return null }
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const userId = getUserId()

  useEffect(() => {
    if (!userId) return
    userService.getUser(userId).then(r => {
      setUser(r.data)
      setForm({ username: r.data.username, email: r.data.email, password: '' })
    }).finally(() => setLoading(false))
  }, [userId])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const data: any = {}
      if (form.username !== user?.username) data.username = form.username
      if (form.email !== user?.email) data.email = form.email
      if (form.password) data.password = form.password
      const res = await userService.updateUser(data)
      setUser(res.data)
      setForm(p => ({ ...p, password: '' }))
      toaster.create({ title: 'Profiel opgeslagen', type: 'success' })
    } catch (err: any) {
      toaster.create({ title: err.response?.data?.message ?? 'Opslaan mislukt', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Flex h="200px" align="center" justify="center"><Text color="gray.500">Laden...</Text></Flex>
  if (!user) return <Flex h="200px" align="center" justify="center"><Text color="gray.500">Profiel niet gevonden</Text></Flex>

  return (
    <Stack gap={6} maxW="600px">
      <Heading size="lg">Mijn profiel</Heading>

      <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <Flex align="center" gap={4} mb={6}>
          <Avatar.Root size="xl">
            <Avatar.Image src={(user as any).avatar ?? undefined} />
            <Avatar.Fallback bg="purple.500" color="white" fontSize="2xl">{user.username?.[0]?.toUpperCase()}</Avatar.Fallback>
          </Avatar.Root>
          <Box>
            <Heading size="md">{user.username}</Heading>
            <Text color="gray.500">{user.email}</Text>
            <Text fontSize="xs" color="purple.500" mt={1}>{(user as any).globalRole ?? user.role}</Text>
          </Box>
        </Flex>

        <form onSubmit={saveProfile}>
          <Stack gap={4}>
            <Field label="Gebruikersnaam">
              <Input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
            </Field>
            <Field label="E-mailadres">
              <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </Field>
            <Field label="Nieuw wachtwoord" helperText="Laat leeg om hetzelfde wachtwoord te houden">
              <PasswordInput value={form.password} onChange={e => setForm(p => ({ ...p, password: (e.target as HTMLInputElement).value }))} placeholder="••••••••" />
            </Field>
            <Button type="submit" colorPalette="purple" loading={saving} alignSelf="flex-start">Opslaan</Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  )
}
