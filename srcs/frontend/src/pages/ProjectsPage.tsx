import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Project } from '../../../../shared/srcs/types'
import { ArrowLeft, Plus, FolderOpen } from 'lucide-react'

function getToken() { return localStorage.getItem('token') }
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
}

const statusColor: Record<string, 'secondary' | 'default' | 'success'> = {
  PLANNING: 'secondary',
  ACTIVE: 'default',
  COMPLETED: 'success',
}
const statusLabel: Record<string, string> = {
  PLANNING: 'Gepland',
  ACTIVE: 'Actief',
  COMPLETED: 'Afgerond',
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', deadline: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const base = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    fetch(`${base}/projects`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [navigate, base])

  async function createProject(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      const payload: Record<string, string> = { name: form.name }
      if (form.description) payload.description = form.description
      if (form.deadline) payload.deadline = new Date(form.deadline).toISOString()

      const res = await fetch(`${base}/projects`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Aanmaken mislukt')
      const created: Project = await res.json()
      setProjects((prev) => [created, ...prev])
      setShowForm(false)
      setForm({ name: '', description: '', deadline: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fout')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold">Projecten</span>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Alle projecten</h1>
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="mr-2 h-4 w-4" /> Nieuw project
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project aanmaken</CardTitle>
            </CardHeader>
            <form onSubmit={createProject}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Naam *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Omschrijving</Label>
                  <Input id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" value={form.deadline} onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>{creating ? 'Bezig...' : 'Aanmaken'}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuleren</Button>
                </div>
              </CardContent>
            </form>
          </Card>
        )}

        {loading ? (
          <p className="text-muted-foreground">Laden...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nog geen projecten. Maak er een aan!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <Card
                key={p.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <Badge variant={statusColor[p.status] ?? 'secondary'}>{statusLabel[p.status] ?? p.status}</Badge>
                  </div>
                  {p.description && <CardDescription className="line-clamp-2">{p.description}</CardDescription>}
                </CardHeader>
                {p.deadline && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(p.deadline).toLocaleDateString('nl-BE')}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
