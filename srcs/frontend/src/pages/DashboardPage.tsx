import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import type { Project, Task } from '../../../../shared/srcs/types'
import { FolderOpen, ListTodo, Plus, LogOut } from 'lucide-react'

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
}

const statusLabel: Record<string, string> = {
  PLANNING: 'Gepland',
  ACTIVE: 'Actief',
  COMPLETED: 'Afgerond',
}

const taskStatusColor: Record<string, 'default' | 'secondary' | 'warning' | 'success' | 'destructive'> = {
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

export default function DashboardPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) { navigate('/login'); return }

    const base = import.meta.env.VITE_API_BASE_URL
    Promise.all([
      fetch(`${base}/projects`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${base}/tasks/my`, { headers: authHeaders() }).then((r) => r.json()),
    ])
      .then(([p, t]) => {
        setProjects(Array.isArray(p) ? p : [])
        setMyTasks(Array.isArray(t) ? t : [])
      })
      .finally(() => setLoading(false))
  }, [navigate])

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const doneTasks = myTasks.filter((t) => t.status === 'DONE').length
  const progress = myTasks.length > 0 ? Math.round((doneTasks / myTasks.length) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-lg">Transcendence</span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
            <FolderOpen className="mr-2 h-4 w-4" /> Projecten
          </Button>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {loading ? (
          <p className="text-muted-foreground">Laden...</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Projecten" value={projects.length} icon={<FolderOpen className="h-5 w-5 text-primary" />} />
              <StatCard label="Mijn taken" value={myTasks.length} icon={<ListTodo className="h-5 w-5 text-primary" />} />
              <StatCard label="Klaar" value={doneTasks} icon={<ListTodo className="h-5 w-5 text-green-500" />} />
              <StatCard label="Bezig" value={myTasks.filter((t) => t.status === 'IN_PROGRESS').length} icon={<ListTodo className="h-5 w-5 text-yellow-500" />} />
            </div>

            {/* Voortgang */}
            {myTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Mijn voortgang</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">{progress}% voltooid ({doneTasks}/{myTasks.length} taken)</p>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Projecten */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Mijn projecten</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/projects')}>
                    <Plus className="h-4 w-4 mr-1" /> Nieuw
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projects.length === 0 && (
                    <p className="text-sm text-muted-foreground">Geen projecten gevonden.</p>
                  )}
                  {projects.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      className="w-full text-left flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted transition-colors"
                      onClick={() => navigate(`/projects/${p.id}`)}
                    >
                      <span className="text-sm font-medium truncate">{p.name}</span>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {statusLabel[p.status] ?? p.status}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Taken */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Mijn taken</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {myTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground">Geen taken toegewezen.</p>
                  )}
                  {myTasks.slice(0, 5).map((t, i) => (
                    <div key={t.id}>
                      {i > 0 && <Separator className="my-1" />}
                      <div className="flex items-center justify-between py-1">
                        <span className="text-sm truncate">{t.title}</span>
                        <Badge variant={taskStatusColor[t.status] ?? 'secondary'} className="ml-2 shrink-0">
                          {taskStatusLabel[t.status] ?? t.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
