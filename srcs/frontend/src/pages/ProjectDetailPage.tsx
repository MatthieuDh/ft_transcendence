import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Stack, Box, Heading, Text, Flex, Badge, Button, Input, Grid, Avatar } from '@chakra-ui/react'
import { projectService, taskService, userService } from '../api/services'
import type { Project, Task, User } from '../../../../shared/srcs/types'
import { Field } from '../components/ui/field'
import { toaster } from '../components/ui/toaster'

const taskStatusColor: Record<string, string> = { TODO: 'gray', IN_PROGRESS: 'blue', PENDING_EVALUATION: 'orange', DONE: 'green' }
const taskStatusLabel: Record<string, string> = { TODO: 'Te doen', IN_PROGRESS: 'Bezig', PENDING_EVALUATION: 'Evaluatie', DONE: 'Klaar' }
const roleLabel: Record<string, string> = { PROJECT_LEADER: 'Projectleider', MEMBER: 'Lid', GUEST: 'Gast' }

const columns = [
  { status: 'TODO', label: 'Te doen' },
  { status: 'IN_PROGRESS', label: 'Bezig' },
  { status: 'PENDING_EVALUATION', label: 'Evaluatie' },
  { status: 'DONE', label: 'Klaar' },
]

type Member = { id: number; role: string; userId: number; user: { username: string; avatar?: string } }

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'board' | 'list' | 'chat'>('board')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', deadline: '', assigneeIds: [] as number[] })
  const [memberSearch, setMemberSearch] = useState('')
  const [memberRole, setMemberRole] = useState('MEMBER')
  const [chatMessage, setChatMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      projectService.getById(Number(id)),
      userService.getAllUsers(),
      projectService.getMessages(Number(id)),
    ]).then(([p, u, m]) => {
      setProject(p.data)
      setMembers(Array.isArray((p.data as any).members) ? (p.data as any).members : [])
      setTasks(Array.isArray((p.data as any).tasks) ? (p.data as any).tasks : [])
      setAllUsers(Array.isArray(u.data) ? u.data : [])
      setMessages(Array.isArray(m.data) ? m.data : [])
    }).finally(() => setLoading(false))
  }, [id])

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setCreating(true)
    try {
      const payload: any = { title: taskForm.title, projectId: Number(id), assigneeIds: taskForm.assigneeIds }
      if (taskForm.description) payload.description = taskForm.description
      if (taskForm.deadline) payload.deadline = new Date(taskForm.deadline).toISOString()
      const res = await taskService.create(payload)
      setTasks(prev => [...prev, res.data])
      setShowTaskForm(false)
      setTaskForm({ title: '', description: '', deadline: '', assigneeIds: [] })
      toaster.create({ title: 'Taak aangemaakt', type: 'success' })
    } catch { toaster.create({ title: 'Aanmaken mislukt', type: 'error' }) }
    finally { setCreating(false) }
  }

  async function addMember(user: User) {
    if (!id) return
    try {
      await projectService.addMember(Number(id), user.id, memberRole as any)
      setMembers(prev => [...prev, { id: user.id, userId: user.id, role: memberRole, user: { username: user.username, avatar: (user as any).avatar } }])
      setMemberSearch('')
      setShowMemberForm(false)
      toaster.create({ title: `${user.username} toegevoegd`, type: 'success' })
    } catch (err: any) {
      toaster.create({ title: err.response?.data?.message ?? 'Toevoegen mislukt', type: 'error' })
    }
  }

  async function updateStatus(taskId: number, status: string) {
    await taskService.update(taskId, { status: status as any })
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: status as any } : t))
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !chatMessage.trim()) return
    try {
      const res = await projectService.createMessage(Number(id), chatMessage)
      setMessages(prev => [...prev, res.data])
      setChatMessage('')
    } catch { /* ignore */ }
  }

  function toggleAssignee(userId: number) {
    setTaskForm(p => ({
      ...p,
      assigneeIds: p.assigneeIds.includes(userId) ? p.assigneeIds.filter(i => i !== userId) : [...p.assigneeIds, userId]
    }))
  }

  const leader = members.find(m => m.role === 'PROJECT_LEADER')
  const memberIds = new Set(members.map(m => m.user?.username))
  const filteredUsers = allUsers.filter(u => !memberIds.has(u.username) && u.username.toLowerCase().includes(memberSearch.toLowerCase()))

  if (loading) return <Flex h="200px" align="center" justify="center"><Text color="gray.500">Laden...</Text></Flex>
  if (!project) return <Flex h="200px" align="center" justify="center"><Text color="gray.500">Project niet gevonden</Text></Flex>

  return (
    <Stack gap={6}>
      <Flex align="center" gap={3} wrap="wrap">
        <Button size="sm" variant="ghost" onClick={() => navigate('/projects')}>← Terug</Button>
        <Heading size="lg" flex={1}>{project.name}</Heading>
        <Badge colorPalette="purple" variant="subtle" size="lg">{project.status}</Badge>
        {project.deadline && <Text fontSize="sm" color="gray.500">📅 {new Date(project.deadline).toLocaleDateString('nl-BE')}</Text>}
      </Flex>
      {project.description && <Text color="gray.500">{project.description}</Text>}

      {/* Team */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
        <Box bg="white" _dark={{ bg: "gray.800" }} p={5} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="purple.100">
          <Text fontSize="xs" fontWeight="bold" color="purple.500" mb={3}>👑 PROJECTLEIDER</Text>
          {leader ? (
            <Flex align="center" gap={3}>
              <Avatar.Root size="md">
                <Avatar.Fallback bg="purple.500" color="white">{leader.user?.username?.[0]?.toUpperCase()}</Avatar.Fallback>
              </Avatar.Root>
              <Box>
                <Text fontWeight="semibold">{leader.user?.username}</Text>
                <Text fontSize="xs" color="gray.500">Verantwoordelijk voor dit project</Text>
              </Box>
            </Flex>
          ) : <Text fontSize="sm" color="gray.400">Geen projectleider</Text>}
        </Box>

        <Box bg="white" _dark={{ bg: "gray.800" }} p={5} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Flex justify="space-between" align="center" mb={3}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500">👥 TEAMLEDEN ({members.filter(m => m.role !== 'PROJECT_LEADER').length})</Text>
            <Button size="xs" colorPalette="purple" variant="ghost" onClick={() => setShowMemberForm(v => !v)}>+ Toevoegen</Button>
          </Flex>
          <Flex wrap="wrap" gap={2}>
            {members.filter(m => m.role !== 'PROJECT_LEADER').map((m, i) => (
              <Flex key={i} align="center" gap={1} borderWidth="1px" borderColor="gray.200" borderRadius="full" px={3} py={1}>
                <Avatar.Root size="2xs"><Avatar.Fallback>{m.user?.username?.[0]?.toUpperCase()}</Avatar.Fallback></Avatar.Root>
                <Text fontSize="xs">{m.user?.username}</Text>
                <Text fontSize="xs" color="gray.400">{roleLabel[m.role] ?? m.role}</Text>
              </Flex>
            ))}
            {members.filter(m => m.role !== 'PROJECT_LEADER').length === 0 && <Text fontSize="sm" color="gray.400">Nog geen leden</Text>}
          </Flex>

          {showMemberForm && (
            <Box mt={3} pt={3} borderTop="1px" borderColor="gray.200">
              <Flex gap={2} mb={2}>
                <Input placeholder="Zoek gebruiker..." size="sm" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} autoFocus />
                <select value={memberRole} onChange={e => setMemberRole(e.target.value)} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', fontSize: '14px' }}>
                  <option value="MEMBER">Lid</option>
                  <option value="GUEST">Gast</option>
                  <option value="PROJECT_LEADER">Projectleider</option>
                </select>
              </Flex>
              {memberSearch && (
                <Box borderWidth="1px" borderRadius="md" maxH="150px" overflowY="auto">
                  {filteredUsers.length === 0 && <Text p={3} fontSize="sm" color="gray.400">Geen gebruikers gevonden</Text>}
                  {filteredUsers.map(u => (
                    <Flex key={u.id} align="center" justify="space-between" px={3} py={2} _hover={{ bg: "gray.50" }} cursor="pointer" onClick={() => addMember(u)}>
                      <Text fontSize="sm">{u.username}</Text>
                      <Text fontSize="xs" color="gray.400">{u.email}</Text>
                    </Flex>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Grid>

      {/* Tabs */}
      <Flex gap={2} borderBottom="1px" borderColor="gray.200" pb={0}>
        {(['board', 'list', 'chat'] as const).map(tab => (
          <Button key={tab} size="sm" variant="ghost"
            borderBottom={view === tab ? "2px solid" : "2px solid transparent"}
            borderColor={view === tab ? "purple.500" : "transparent"}
            borderRadius={0} color={view === tab ? "purple.600" : "gray.500"}
            onClick={() => setView(tab)}
          >
            {tab === 'board' ? '📋 Kanban' : tab === 'list' ? '📄 Lijst' : '💬 Chat'}
          </Button>
        ))}
        <Box flex={1} />
        <Button size="sm" colorPalette="purple" onClick={() => setShowTaskForm(v => !v)}>+ Taak</Button>
      </Flex>

      {showTaskForm && (
        <Box bg="white" _dark={{ bg: "gray.800" }} p={5} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Nieuwe taak</Heading>
          <form onSubmit={createTask}>
            <Stack gap={4}>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <Field label="Titel *"><Input value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))} required /></Field>
                <Field label="Deadline"><Input type="date" value={taskForm.deadline} onChange={e => setTaskForm(p => ({ ...p, deadline: e.target.value }))} /></Field>
              </Grid>
              <Field label="Omschrijving"><Input value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))} /></Field>
              {members.length > 0 && (
                <Field label="Toewijzen aan">
                  <Flex wrap="wrap" gap={2} mt={1}>
                    {members.map(m => {
                      const uid = m.userId ?? m.id
                      const sel = taskForm.assigneeIds.includes(uid)
                      return (
                        <Flex key={m.id} align="center" gap={1} borderWidth="1px" borderRadius="full" px={3} py={1} cursor="pointer"
                          borderColor={sel ? "purple.500" : "gray.200"} bg={sel ? "purple.50" : "transparent"} color={sel ? "purple.600" : "gray.700"}
                          onClick={() => toggleAssignee(uid)}
                        >
                          <Avatar.Root size="2xs"><Avatar.Fallback>{m.user?.username?.[0]?.toUpperCase()}</Avatar.Fallback></Avatar.Root>
                          <Text fontSize="sm">{m.user?.username}</Text>
                        </Flex>
                      )
                    })}
                  </Flex>
                </Field>
              )}
              <Flex gap={2}>
                <Button type="submit" colorPalette="purple" loading={creating}>Aanmaken</Button>
                <Button type="button" variant="ghost" onClick={() => setShowTaskForm(false)}>Annuleren</Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      )}

      {/* Kanban */}
      {view === 'board' && (
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.status)
            return (
              <Box key={col.status}>
                <Flex align="center" gap={2} mb={3}>
                  <Text fontWeight="semibold" fontSize="sm">{col.label}</Text>
                  <Badge colorPalette="gray" variant="subtle">{colTasks.length}</Badge>
                </Flex>
                <Stack gap={2} minH="80px">
                  {colTasks.map(task => (
                    <Box key={task.id} bg="white" _dark={{ bg: "gray.800" }} p={3} borderRadius="lg" boxShadow="xs" borderWidth="1px" borderColor="gray.100" _hover={{ boxShadow: "sm" }}>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>{task.title}</Text>
                      {task.assignees && task.assignees.length > 0 && (
                        <Flex gap={1} mb={2}>
                          {task.assignees.map((a, i) => (
                            <Avatar.Root key={i} size="2xs" title={a.username}>
                              <Avatar.Fallback fontSize="8px">{a.username[0].toUpperCase()}</Avatar.Fallback>
                            </Avatar.Root>
                          ))}
                        </Flex>
                      )}
                      {task.deadline && <Text fontSize="xs" color="gray.400" mb={2}>📅 {new Date(task.deadline).toLocaleDateString('nl-BE')}</Text>}
                      <Flex wrap="wrap" gap={1} borderTop="1px" borderColor="gray.100" pt={2}>
                        {columns.filter(c => c.status !== col.status).map(c => (
                          <Text key={c.status} fontSize="xs" color="purple.500" cursor="pointer" _hover={{ textDecoration: 'underline' }} onClick={() => updateStatus(task.id, c.status)}>→ {c.label}</Text>
                        ))}
                      </Flex>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )
          })}
        </Grid>
      )}

      {/* Lijst */}
      {view === 'list' && (
        <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          {tasks.length === 0 && <Box p={8} textAlign="center"><Text color="gray.400">Geen taken</Text></Box>}
          <Stack gap={0} divideY="1px">
            {tasks.map(t => (
              <Flex key={t.id} align="center" gap={3} p={4}>
                <Text fontSize="sm" flex={1}>{t.title}</Text>
                {t.assignees && t.assignees.length > 0 && (
                  <Flex gap={1}>
                    {t.assignees.map((a, i) => <Avatar.Root key={i} size="xs" title={a.username}><Avatar.Fallback>{a.username[0].toUpperCase()}</Avatar.Fallback></Avatar.Root>)}
                  </Flex>
                )}
                <Badge colorPalette={taskStatusColor[t.status] ?? 'gray'} variant="subtle">{taskStatusLabel[t.status] ?? t.status}</Badge>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}

      {/* Chat */}
      {view === 'chat' && (
        <Box bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100" display="flex" flexDirection="column" h="400px">
          <Box flex={1} overflowY="auto" p={4}>
            <Stack gap={3}>
              {messages.length === 0 && <Text fontSize="sm" color="gray.400" textAlign="center">Nog geen berichten. Stuur het eerste bericht!</Text>}
              {messages.map((m, i) => (
                <Box key={i}>
                  <Text fontSize="xs" color="gray.400" mb={0.5}>{m.user?.username ?? 'Onbekend'}</Text>
                  <Box bg="gray.50" _dark={{ bg: "gray.700" }} px={3} py={2} borderRadius="lg" display="inline-block" maxW="80%">
                    <Text fontSize="sm">{m.content}</Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
          <Box borderTop="1px" borderColor="gray.200" p={3}>
            <form onSubmit={sendMessage}>
              <Flex gap={2}>
                <Input placeholder="Typ een bericht..." value={chatMessage} onChange={e => setChatMessage(e.target.value)} size="sm" />
                <Button type="submit" colorPalette="purple" size="sm" disabled={!chatMessage.trim()}>Sturen</Button>
              </Flex>
            </form>
          </Box>
        </Box>
      )}
    </Stack>
  )
}
