import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Grid, Box, Heading, Text, Flex, Badge, Button, Input } from '@chakra-ui/react'
import { LuUsers, LuCalendar, LuPlus, LuSearch } from 'react-icons/lu'
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
  const [search, setSearch] = useState('')

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

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">Projecten</Heading>
          <Text fontSize="sm" color="gray.500" mt={0.5}>{projects.length} project{projects.length !== 1 ? 'en' : ''}</Text>
        </Box>
        <Button colorPalette="purple" onClick={() => setShowForm(v => !v)}>
          <LuPlus /> Nieuw project
        </Button>
      </Flex>

      {showForm && (
        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Heading size="sm" mb={4}>Project aanmaken</Heading>
          <form onSubmit={createProject}>
            <Stack gap={4}>
              {error && <Text color="red.500" fontSize="sm">{error}</Text>}
              <Field label="Naam *">
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Projectnaam..." />
              </Field>
              <Field label="Omschrijving">
                <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optionele beschrijving..." />
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

      {!loading && projects.length > 3 && (
        <Box position="relative">
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" pointerEvents="none">
            <LuSearch size={16} />
          </Box>
          <Input
            pl={9}
            placeholder="Zoek projecten..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            bg="white" _dark={{ bg: "gray.800" }}
          />
        </Box>
      )}

      {loading && <Text color="gray.500">Laden...</Text>}

      {!loading && projects.length === 0 && (
        <Box textAlign="center" py={20} bg="white" _dark={{ bg: "gray.800" }} borderRadius="xl" borderWidth="1px" borderColor="gray.100">
          <Text fontSize="5xl" mb={4}>📁</Text>
          <Heading size="md" mb={2} color="gray.600" _dark={{ color: "gray.300" }}>Nog geen projecten</Heading>
          <Text color="gray.400" mb={6}>Maak je eerste project aan om te beginnen</Text>
          <Button colorPalette="purple" onClick={() => setShowForm(true)}><LuPlus /> Nieuw project</Button>
        </Box>
      )}

      {!loading && filteredProjects.length === 0 && search && (
        <Box textAlign="center" py={10}>
          <Text color="gray.400">Geen projecten gevonden voor "{search}"</Text>
        </Box>
      )}

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
        {filteredProjects.map(p => {
          const isOverdue = p.deadline && new Date(p.deadline) < new Date() && p.status !== 'COMPLETED'
          const memberCount = (p as any).members?.length ?? (p as any)._count?.members ?? null

          return (
            <Box
              key={p.id}
              bg="white" _dark={{ bg: "gray.800" }}
              borderRadius="xl" boxShadow="sm"
              borderWidth="1px" borderColor={isOverdue ? "red.200" : "gray.100"}
              _dark_borderColor={isOverdue ? "red.700" : "gray.700"}
              cursor="pointer"
              _hover={{ boxShadow: "md", borderColor: isOverdue ? "red.300" : "purple.200", transform: "translateY(-2px)" }}
              transition="all 0.2s"
              onClick={() => navigate(`/project/${p.id}`)}
              overflow="hidden"
            >
              <Box h="4px" bg={`${statusColor[p.status] ?? 'gray'}.400`} />
              <Box p={5}>
                <Flex justify="space-between" align="flex-start" mb={2}>
                  <Heading size="sm" flex={1} mr={2} lineClamp={2}>{p.name}</Heading>
                  <Badge colorPalette={statusColor[p.status] ?? 'gray'} variant="subtle" flexShrink={0} fontSize="xs">{statusLabel[p.status] ?? p.status}</Badge>
                </Flex>
                {p.description && (
                  <Text fontSize="sm" color="gray.500" mb={3} style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {p.description}
                  </Text>
                )}
                <Flex align="center" gap={3} mt={3} pt={3} borderTop="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.700" }}>
                  {p.deadline && (
                    <Flex align="center" gap={1} fontSize="xs" color={isOverdue ? "red.500" : "gray.400"}>
                      <LuCalendar size={12} />
                      <Text>{isOverdue ? '⚠️ ' : ''}{new Date(p.deadline).toLocaleDateString('nl-BE')}</Text>
                    </Flex>
                  )}
                  {memberCount !== null && (
                    <Flex align="center" gap={1} fontSize="xs" color="gray.400" ml={p.deadline ? undefined : 0}>
                      <LuUsers size={12} />
                      <Text>{memberCount} {memberCount === 1 ? 'lid' : 'leden'}</Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Box>
          )
        })}
      </Grid>
    </Stack>
  )
}
