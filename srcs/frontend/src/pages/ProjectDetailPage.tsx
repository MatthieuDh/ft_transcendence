import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Project, Task, User } from '../../../../shared/srcs/types'
import { ArrowLeft, Plus, UserPlus } from 'lucide-react'

function getToken() { return localStorage.getItem('token') }
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
}

const taskStatusColor: Record<string, 'default' | 'secondary' | 'warning' | 'success'> = {
  TODO: 'secondary',
  IN_PROGRESS: 'default',
  PENDING_EVALUATION: 'warning',
  DONE: 'success',
}
const taskStatusLabel: Record<string, string> = {
  TODO: 'Te doen',
  IN_PROGRESS: 'Bezig',
  PENDING_EVALUATION: 'Wacht op evaluatie',
  DONE: 'Klaar',
}

const columns: Array<{ status: string; label: string }> = [
  { status: 'TODO', label: 'Te doen' },
  { status: 'IN_PROGRESS', label: 'Bezig' },
  { status: 'PENDING_EVALUATION', label: 'Evaluatie' },
  { status: 'DONE', label: 'Klaar' },
]

type Member = { id: number; role: string; user: { username: string; avatar?: string } }

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', deadline: '' })
  const [memberSearch, setMemberSearch] = useState('')
  const [memberRole, setMemberRole] = useState('MEMBER')
  const [creating, setCreating] = useState(false)
  const [addingMember, setAddingMember] = useState(false)
  const [memberError, setMemberError] = useState('')

  const base = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }
    if (!id) return
    Promise.all([
      fetch(`${base}/projects/${id}`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${base}/projects/${id}/tasks`, { headers: authHeaders() }).then((r) => r.json()).catch(() => []),
      fetch(`${base}/users`, { headers: authHeaders() }).then((r) => r.json()).catch(() => []),
    ]).then(([p, t, u]) => {
      setProject(p)
      setTasks(Array.isArray(t) ? t : [])
      setMembers(Array.isArray(p?.members) ? p.members : [])
      setAllUsers(Array.isArray(u) ? u : [])
    }).finally(() => setLoading(false))
  }, [id, navigate, base])

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setCreating(true)
    try {
      const payload: Record<string, unknown> = { title: taskForm.title, projectId: Number(id), assigneeIds: [] }
      if (taskForm.description) payload.description = taskForm.description
      if (taskForm.deadline) payload.deadline = new Date(taskForm.deadline).toISOString()
      const res = await fetch(`${base}/tasks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Aanmaken mislukt')
      const created: Task = await res.json()
      setTasks((prev) => [...prev, created])
      setShowTaskForm(false)
      setTaskForm({ title: '', description: '', deadline: '' })
    } finally {
      setCreating(false)
    }
  }

  async function addMember(user: User) {
    if (!id) return
    setAddingMember(true)
    setMemberError('')
    try {
      const res = await fetch(`${base}/projects/${id}/members`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId: user.id, role: memberRole }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message ?? 'Toevoegen mislukt')
      }
      const newMember: Member = { id: user.id, role: memberRole, user: { username: user.username, avatar: user.avatar } }
      setMembers((prev) => [...prev, newMember])
      setMemberSearch('')
      setShowMemberForm(false)
    } catch (err: unknown) {
      setMemberError(err instanceof Error ? err.message : 'Fout')
    } finally {
      setAddingMember(false)
    }
  }

  async function updateTaskStatus(taskId: number, status: string) {
    await fetch(`${base}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    })
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: status as Task['status'] } : t))
  }

  const memberIds = new Set(members.map((m) => m.user?.username))
  const filteredUsers = allUsers.filter(
    (u) => !memberIds.has(u.username) &&
      u.username.toLowerCase().includes(memberSearch.toLowerCase())
  )

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Laden...</div>
  if (!project) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Project niet gevonden</div>

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold">{project.name}</span>
        <Badge variant="secondary" className="ml-auto">
          {project.status}
        </Badge>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {project.description && (
          <p className="text-muted-foreground">{project.description}</p>
        )}

        {/* Leden */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Teamleden ({members.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setShowMemberForm((v) => !v)}>
                <UserPlus className="h-4 w-4 mr-2" /> Lid toevoegen
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {members.map((m, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full border px-3 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {m.user?.username?.[0]?.toUpperCase() ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{m.user?.username}</span>
                  <Badge variant="secondary" className="text-xs py-0">{m.role}</Badge>
                </div>
              ))}
            </div>

            {showMemberForm && (
              <div className="border-t pt-3 space-y-3">
                {memberError && (
                  <p className="text-sm text-destructive">{memberError}</p>
                )}
                <div className="flex gap-2">
                  <Input
                    placeholder="Zoek gebruiker..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="max-w-xs"
                  />
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm bg-background"
                  >
                    <option value="MEMBER">Lid</option>
                    <option value="GUEST">Gast</option>
                    <option value="PROJECT_LEADER">Projectleider</option>
                  </select>
                </div>
                {memberSearch && (
                  <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                    {filteredUsers.length === 0 && (
                      <p className="text-sm text-muted-foreground p-3">Geen gebruikers gevonden</p>
                    )}
                    {filteredUsers.map((u) => (
                      <button
                        key={u.id}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left"
                        onClick={() => addMember(u)}
                        disabled={addingMember}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{u.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{u.username}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{u.email}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="board">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="board">Kanban board</TabsTrigger>
              <TabsTrigger value="list">Lijst</TabsTrigger>
            </TabsList>
            <Button size="sm" onClick={() => setShowTaskForm((v) => !v)}>
              <Plus className="mr-2 h-4 w-4" /> Taak toevoegen
            </Button>
          </div>

          {showTaskForm && (
            <Card className="mt-4">
              <CardHeader><CardTitle className="text-base">Nieuwe taak</CardTitle></CardHeader>
              <form onSubmit={createTask}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel *</Label>
                    <Input id="title" value={taskForm.title} onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Omschrijving</Label>
                    <Input id="desc" value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dl">Deadline</Label>
                    <Input id="dl" type="date" value={taskForm.deadline} onChange={(e) => setTaskForm((p) => ({ ...p, deadline: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={creating}>{creating ? 'Bezig...' : 'Aanmaken'}</Button>
                    <Button type="button" variant="outline" onClick={() => setShowTaskForm(false)}>Annuleren</Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}

          {/* Kanban */}
          <TabsContent value="board">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {columns.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.status)
                return (
                  <div key={col.status} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{col.label}</h3>
                      <Badge variant="secondary" className="text-xs">{colTasks.length}</Badge>
                    </div>
                    <div className="space-y-2 min-h-[120px]">
                      {colTasks.map((task) => (
                        <Card key={task.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-3 space-y-2">
                            <p className="text-sm font-medium">{task.title}</p>
                            {task.deadline && (
                              <p className="text-xs text-muted-foreground">
                                {new Date(task.deadline).toLocaleDateString('nl-BE')}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {columns
                                .filter((c) => c.status !== col.status)
                                .map((c) => (
                                  <button
                                    key={c.status}
                                    className="text-xs text-primary underline hover:no-underline"
                                    onClick={() => updateTaskStatus(task.id, c.status)}
                                  >
                                    → {c.label}
                                  </button>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* Lijst */}
          <TabsContent value="list">
            <div className="mt-4 space-y-1">
              {tasks.length === 0 && <p className="text-sm text-muted-foreground">Geen taken.</p>}
              {tasks.map((t, i) => (
                <div key={t.id}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center justify-between py-2 px-1">
                    <span className="text-sm">{t.title}</span>
                    <Badge variant={taskStatusColor[t.status] ?? 'secondary'}>
                      {taskStatusLabel[t.status] ?? t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
