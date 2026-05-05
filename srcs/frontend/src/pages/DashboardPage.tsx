import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Box, Heading, Text, Stack, Flex, Badge, Progress } from '@chakra-ui/react'
import { LuFolder, LuCheckSquare, LuClock, LuTrendingUp } from 'react-icons/lu'
import { projectService, taskService } from '../api/services'
import type { Project, Task } from '../../../../shared/srcs/types'
import { useAuth } from '../context/AuthContext'

const statusLabel: Record<string, string> = { PLANNING: 'Gepland', ACTIVE: 'Actief', COMPLETED: 'Afgerond' }
const statusColor: Record<string, string> = { PLANNING: 'gray', ACTIVE: 'green', COMPLETED: 'blue' }
const taskStatusLabel: Record<string, string> = { TODO: 'Te doen', IN_PROGRESS: 'Bezig', PENDING_EVALUATION: 'Evaluatie', DONE: 'Klaar' }
const taskStatusColor: Record<string, string> = { TODO: 'gray', IN_PROGRESS: 'blue', PENDING_EVALUATION: 'orange', DONE: 'green' }

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Goedemorgen'
  if (h < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

function StatCard({ label, value, color = 'purple', icon }: { label: string; value: number; color?: string; icon: React.ReactNode }) {
  return (
    <Box
      bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      p={5} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100"
      position="relative" overflow="hidden"
    >
      <Box
        position="absolute" top={0} right={0} w="80px" h="80px"
        bg={`${color}.50`} _dark={{ bg: `${color}.900` }}
        borderBottomLeftRadius="full" opacity={0.6}
      />
      <Flex direction="column" gap={3} position="relative">
        <Box
          w="36px" h="36px" borderRadius="lg"
          bg={`${color}.100`} _dark={{ bg: `${color}.800` }}
          color={`${color}.600`} _dark_color={`${color}.300`}
          display="flex" alignItems="center" justifyContent="center"
        >
          {icon}
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`} _dark={{ color: `${color}.300` }} lineHeight="1">{value}</Text>
          <Text fontSize="xs" color="gray.500" mt={1}>{label}</Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('access_token')) { navigate('/login'); return }
    Promise.all([projectService.getAll(), taskService.getMyTasks()])
      .then(([p, t]) => { setProjects(Array.isArray(p.data) ? p.data : []); setMyTasks(Array.isArray(t.data) ? t.data : []) })
      .finally(() => setLoading(false))
  }, [navigate])

  const doneTasks = myTasks.filter(t => t.status === 'DONE').length
  const inProgressTasks = myTasks.filter(t => t.status === 'IN_PROGRESS').length
  const progress = myTasks.length > 0 ? Math.round((doneTasks / myTasks.length) * 100) : 0

  const overdueTaskCount = myTasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'DONE').length

  if (loading) return (
    <Flex h="200px" align="center" justify="center" gap={3}>
      <Box w="8px" h="8px" borderRadius="full" bg="purple.400" style={{ animation: 'pulse 1s infinite' }} />
      <Text color="gray.500">Laden...</Text>
    </Flex>
  )

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="lg" mb={1}>
          {getGreeting()}{currentUser?.username ? `, ${currentUser.username}` : ''} 👋
        </Heading>
        <Text color="gray.500" fontSize="sm">
          {new Date().toLocaleDateString('nl-BE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </Box>

      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
        <StatCard label="Projecten" value={projects.length} color="purple" icon={<LuFolder size={18} />} />
        <StatCard label="Mijn taken" value={myTasks.length} color="blue" icon={<LuCheckSquare size={18} />} />
        <StatCard label="Voltooid" value={doneTasks} color="green" icon={<LuTrendingUp size={18} />} />
        <StatCard label="Bezig" value={inProgressTasks} color="orange" icon={<LuClock size={18} />} />
      </Grid>

      {overdueTaskCount > 0 && (
        <Box bg="red.50" _dark={{ bg: "red.900" }} border="1px solid" borderColor="red.200" _dark_borderColor="red.700" p={4} borderRadius="xl">
          <Flex align="center" gap={2}>
            <Text color="red.600" _dark={{ color: "red.300" }} fontWeight="semibold" fontSize="sm">
              ⚠️ {overdueTaskCount} {overdueTaskCount === 1 ? 'taak heeft' : 'taken hebben'} de deadline overschreden
            </Text>
          </Flex>
        </Box>
      )}

      {myTasks.length > 0 && (
        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Flex justify="space-between" align="center" mb={3}>
            <Text fontWeight="semibold">Mijn voortgang</Text>
            <Text fontSize="sm" color={progress === 100 ? "green.500" : "gray.500"} fontWeight="medium">{progress}%</Text>
          </Flex>
          <Progress.Root value={progress} size="sm" colorPalette={progress === 100 ? "green" : "purple"}>
            <Progress.Track borderRadius="full"><Progress.Range borderRadius="full" /></Progress.Track>
          </Progress.Root>
          <Text fontSize="xs" color="gray.400" mt={2}>{doneTasks} van {myTasks.length} taken voltooid</Text>
        </Box>
      )}

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="semibold">Recente projecten</Text>
            <Text fontSize="sm" color="purple.500" cursor="pointer" onClick={() => navigate('/projects')} _hover={{ textDecoration: 'underline' }}>
              Alles zien →
            </Text>
          </Flex>
          <Stack gap={1}>
            {projects.length === 0 && (
              <Flex direction="column" align="center" py={6} gap={2}>
                <Text fontSize="2xl">📁</Text>
                <Text fontSize="sm" color="gray.400">Nog geen projecten.</Text>
              </Flex>
            )}
            {projects.slice(0, 5).map(p => (
              <Flex
                key={p.id} align="center" justify="space-between"
                p={3} borderRadius="md"
                _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                cursor="pointer"
                onClick={() => navigate(`/project/${p.id}`)}
              >
                <Flex align="center" gap={3}>
                  <Box w="8px" h="8px" borderRadius="full" bg={`${statusColor[p.status] ?? 'gray'}.400`} flexShrink={0} />
                  <Text fontSize="sm" fontWeight="medium">{p.name}</Text>
                </Flex>
                <Badge colorPalette={statusColor[p.status] ?? 'gray'} variant="subtle" fontSize="xs">{statusLabel[p.status] ?? p.status}</Badge>
              </Flex>
            ))}
          </Stack>
        </Box>

        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontWeight="semibold" mb={4}>Mijn taken</Text>
          <Stack gap={1}>
            {myTasks.length === 0 && (
              <Flex direction="column" align="center" py={6} gap={2}>
                <Text fontSize="2xl">✅</Text>
                <Text fontSize="sm" color="gray.400">Geen taken toegewezen.</Text>
              </Flex>
            )}
            {myTasks.slice(0, 5).map(t => {
              const isOverdue = t.deadline && new Date(t.deadline) < new Date() && t.status !== 'DONE'
              return (
                <Flex key={t.id} align="center" justify="space-between" p={3} borderRadius="md" _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}>
                  <Flex align="center" gap={3} flex={1} minW={0}>
                    <Box w="8px" h="8px" borderRadius="full" bg={`${taskStatusColor[t.status] ?? 'gray'}.400`} flexShrink={0} />
                    <Text fontSize="sm" truncate flex={1}>{t.title}</Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    {isOverdue && <Text fontSize="xs" color="red.500">⚠️</Text>}
                    <Badge colorPalette={taskStatusColor[t.status] ?? 'gray'} variant="subtle" fontSize="xs">{taskStatusLabel[t.status] ?? t.status}</Badge>
                  </Flex>
                </Flex>
              )
            })}
          </Stack>
        </Box>
      </Grid>
    </Stack>
  )
}
