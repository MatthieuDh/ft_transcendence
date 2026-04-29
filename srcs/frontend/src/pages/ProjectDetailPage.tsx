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
import { ArrowLeft, Plus, UserPlus, Crown, Users } from 'lucide-react'

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
const roleLabel: Record<string, string> = {
  PROJECT_LEADER: 'Projectleider',
  MEMBER: 'Lid',
  GUEST: 'Gast',
}

const columns: Array<{ status: string; label: string }> = [
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
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', deadline: '', assigneeIds: [] as number[] })
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
      const payload: Record<string, unknown> = {
        title: taskForm.title,
        projectId: Number(id),
        assigneeIds: taskForm.assigneeIds,
      }
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
      setTaskForm({ title: '', description: '', deadline: '', assigneeIds: [] })
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
      const newMember: Member = { id: user.id, userId: user.id, role: memberRole, user: { username: user.username, avatar: user.avatar } }
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

  function toggleAssignee(userId: number) {
    setTaskForm((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(userId)
        ? prev.assigneeIds.filter((i) => i !== userId)
        : [...prev.assigneeIds, userId],
    }))
  }

  const memberIds = new Set(members.map((m) => m.user?.username))
  const filteredUsers = allUsers.filter(
    (u) => !memberIds.has(u.username) &&
      u.username.toLowerCase().includes(memberSearch.toLowerCase())
  )

  const leader = members.find((m) => m.role === 'PROJECT_LEADER')
  const regularMembers = members.filter((m) => m.role !== 'PROJECT_LEADER')

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Laden...</div>
  if (!project) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Project niet gevonden</div>

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold">{project.name}</h1>
          {project.description && (
            <p className="text-xs text-muted-foreground">{project.description}</p>
          )}
        </div>
        <Badge variant="secondary">{project.status}</Badge>
        {project.deadline && (
          <span className="text-xs text-muted-foreground hidden md:block">
            Deadline: {new Date(project.deadline).toLocaleDateString('nl-BE')}
          </span>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">

        {/* Team overzicht */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* Projectleider */}
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                Projectleider
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leader ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {leader.user?.username?.[0]?.toUpperCase() ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{leader.user?.username}</p>
                    <p className="text-xs text-muted-foreground">Verantwoordelijk voor dit project</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Geen projectleider</p>
              )}
            </CardContent>
          </Card>

          {/* Teamleden */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Teamleden ({regularMembers.length})
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowMemberForm((v) => !v)}>
                  <UserPlus className="h-4 w-4 mr-1" /> Toevoegen
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {regularMembers.length === 0 && !showMemberForm && (
                <p className="text-sm text-muted-foreground">Nog geen teamleden.</p>
              )}
              <div className="flex flex-wrap gap-2">
                {regularMembers.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-full border px-3 py-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {m.user?.username?.[0]?.toUpperCase() ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{m.user?.username}</span>
                    <span className="text-xs text-muted-foreground">{roleLabel[m.role] ?? m.role}</span>
                  </div>
                ))}
              </div>

              {showMemberForm && (
                <div className="border-t pt-3 space-y-2">
                  {memberError && <p className="text-sm text-destructive">{memberError}</p>}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Zoek gebruiker..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="flex-1"
                      autoFocus
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
                    <div className="border rounded-md divide-y max-h-40 overflow-y-auto">
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
        </div>

        {/* Taken */}
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titel *</Label>
                      <Input id="title" value={taskForm.title} onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dl">Deadline</Label>
                      <Input id="dl" type="date" value={taskForm.deadline} onChange={(e) => setTaskForm((p) => ({ ...p, deadline: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Omschrijving</Label>
                    <Input id="desc" value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} />
                  </div>
                  {members.length > 0 && (
                    <div className="space-y-2">
                      <Label>Toewijzen aan</Label>
                      <div className="flex flex-wrap gap-2">
                        {members.map((m) => {
                          const selected = taskForm.assigneeIds.includes(m.userId ?? m.id)
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => toggleAssignee(m.userId ?? m.id)}
                              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors ${
                                selected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'hover:bg-muted'
                              }`}
                            >
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-xs">
                                  {m.user?.username?.[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {m.user?.username}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
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
                        <Card key={task.id} className="hover:shadow-sm transition-shadow">
                          <CardContent className="p-3 space-y-2">
                            <p className="text-sm font-medium">{task.title}</p>
                            {task.assignee && task.assignee.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {task.assignee.map((a, i) => (
                                  <div key={i} className="flex items-center gap-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarFallback className="text-[10px]">{a.username[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">{a.username}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {task.deadline && (
                              <p className="text-xs text-muted-foreground">
                                📅 {new Date(task.deadline).toLocaleDateString('nl-BE')}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 border-t pt-1">
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
                  <div className="flex items-center gap-3 py-2 px-1">
                    <span className="text-sm flex-1">{t.title}</span>
                    {t.assignee && t.assignee.length > 0 && (
                      <div className="flex -space-x-1">
                        {t.assignee.map((a, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="text-xs">{a.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}
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
