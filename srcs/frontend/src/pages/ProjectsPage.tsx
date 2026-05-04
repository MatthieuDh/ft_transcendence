import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Grid, Box, Heading, Text, Flex, Badge, Button, Input } from '@chakra-ui/react'
import { projectService } from '../api/services'
import type { Project } from '../../../../shared/srcs/types'
import { Field } from '../components/ui/field'

const statusColor: Record<string, string> = { PLANNING: 'gray', ACTIVE: 'green', COMPLETED: 'blue' }
const statusLabel: Record<string, string> = { PLANNING: 'Gepland', ACTIVE: 'Actief', COMPLETED: 'Afgerond' }

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', deadline: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    projectService.getAll()
      .then(r => setProjects(Array.isArray(r.data) ? r.data : []))
      .finally(() => setLoading(false))
  }, [])

  async function createProject(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      const payload: { name: string; description?: string; deadline?: string } = { name: form.name }
      if (form.description) payload.description = form.description
      if (form.deadline) payload.deadline = new Date(form.deadline).toISOString()
      const res = await projectService.create(payload)
      setProjects(prev => [res.data, ...prev])
      setShowForm(false)
      setForm({ name: '', description: '', deadline: '' })
    } catch { setError('Aanmaken mislukt') }
    finally { setCreating(false) }
  }

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center">
        <Heading size="lg">Projecten</Heading>
        <Button colorPalette="purple" onClick={() => setShowForm(v => !v)}>+ Nieuw project</Button>
      </Flex>

      {showForm && (
        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Project aanmaken</Heading>
          <form onSubmit={createProject}>
            <Stack gap={4}>
              {error && <Text color="red.500" fontSize="sm">{error}</Text>}
              <Field label="Naam *">
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </Field>
              <Field label="Omschrijving">
                <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </Field>
              <Field label="Deadline">
                <Input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
              </Field>
              <Flex gap={2}>
                <Button type="submit" colorPalette="purple" loading={creating}>Aanmaken</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuleren</Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      )}

      {loading && <Text color="gray.500">Laden...</Text>}

      {!loading && projects.length === 0 && (
        <Box textAlign="center" py={16}>
          <Text fontSize="4xl" mb={3}>📁</Text>
          <Text color="gray.400">Nog geen projecten. Maak er een aan!</Text>
        </Box>
      )}

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
        {projects.map(p => (
          <Box
            key={p.id}
            bg="white" _dark={{ bg: "gray.800" }}
            p={6} borderRadius="xl" boxShadow="sm"
            borderWidth="1px" borderColor="gray.100"
            cursor="pointer"
            _hover={{ boxShadow: "md", borderColor: "purple.200" }}
            transition="all 0.15s"
            onClick={() => navigate(`/project/${p.id}`)}
          >
            <Flex justify="space-between" align="flex-start" mb={2}>
              <Heading size="sm" flex={1} mr={2}>{p.name}</Heading>
              <Badge colorPalette={statusColor[p.status] ?? 'gray'} variant="subtle" flexShrink={0}>{statusLabel[p.status] ?? p.status}</Badge>
            </Flex>
            {p.description && <Text fontSize="sm" color="gray.500" mb={2} style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</Text>}
            {p.deadline && <Text fontSize="xs" color="gray.400">📅 {new Date(p.deadline).toLocaleDateString('nl-BE')}</Text>}
          </Box>
        ))}
      </Grid>
    </Stack>
  )
}
