import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Box, Heading, Text, Stack, Flex, Badge, Progress } from '@chakra-ui/react'
import { projectService, taskService } from '../api/services'
import type { Project, Task } from '../../../../shared/srcs/types'

const statusLabel: Record<string, string> = { PLANNING: 'Gepland', ACTIVE: 'Actief', COMPLETED: 'Afgerond' }
const taskStatusLabel: Record<string, string> = { TODO: 'Te doen', IN_PROGRESS: 'Bezig', PENDING_EVALUATION: 'Evaluatie', DONE: 'Klaar' }
const taskStatusColor: Record<string, string> = { TODO: 'gray', IN_PROGRESS: 'blue', PENDING_EVALUATION: 'orange', DONE: 'green' }

function StatCard({ label, value, color = 'purple' }: { label: string; value: number; color?: string }) {
  return (
    <Box bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
      <Text fontSize="sm" color="gray.500" mb={1}>{label}</Text>
      <Text fontSize="3xl" fontWeight="bold" color={`${color}.500`}>{value}</Text>
    </Box>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
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
  const progress = myTasks.length > 0 ? Math.round((doneTasks / myTasks.length) * 100) : 0

  if (loading) return <Flex h="200px" align="center" justify="center"><Text color="gray.500">Laden...</Text></Flex>

  return (
    <Stack gap={6}>
      <Heading size="lg">Goedendag 👋</Heading>

      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
        <StatCard label="Mijn projecten" value={projects.length} color="purple" />
        <StatCard label="Mijn taken" value={myTasks.length} color="blue" />
        <StatCard label="Klaar" value={doneTasks} color="green" />
        <StatCard label="Bezig" value={myTasks.filter(t => t.status === 'IN_PROGRESS').length} color="orange" />
      </Grid>

      {myTasks.length > 0 && (
        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontWeight="semibold" mb={3}>Mijn voortgang</Text>
          <Progress.Root value={progress} size="sm" colorPalette="purple">
            <Progress.Track><Progress.Range /></Progress.Track>
          </Progress.Root>
          <Text fontSize="sm" color="gray.500" mt={2}>{progress}% voltooid ({doneTasks}/{myTasks.length} taken)</Text>
        </Box>
      )}

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="semibold">Mijn projecten</Text>
            <Text fontSize="sm" color="purple.500" cursor="pointer" onClick={() => navigate('/projects')} _hover={{ textDecoration: 'underline' }}>Alles zien →</Text>
          </Flex>
          <Stack gap={2}>
            {projects.length === 0 && <Text fontSize="sm" color="gray.400">Geen projecten.</Text>}
            {projects.slice(0, 5).map(p => (
              <Flex key={p.id} align="center" justify="space-between" p={3} borderRadius="md" _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }} cursor="pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                <Text fontSize="sm" fontWeight="medium">{p.name}</Text>
                <Badge colorPalette="purple" variant="subtle">{statusLabel[p.status] ?? p.status}</Badge>
              </Flex>
            ))}
          </Stack>
        </Box>

        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontWeight="semibold" mb={4}>Mijn taken</Text>
          <Stack gap={2}>
            {myTasks.length === 0 && <Text fontSize="sm" color="gray.400">Geen taken toegewezen.</Text>}
            {myTasks.slice(0, 5).map(t => (
              <Flex key={t.id} align="center" justify="space-between" p={3} borderRadius="md">
                <Text fontSize="sm">{t.title}</Text>
                <Badge colorPalette={taskStatusColor[t.status] ?? 'gray'} variant="subtle">{taskStatusLabel[t.status] ?? t.status}</Badge>
              </Flex>
            ))}
          </Stack>
        </Box>
      </Grid>
    </Stack>
  )
}
