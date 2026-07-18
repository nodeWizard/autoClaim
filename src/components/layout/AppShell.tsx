import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  Bell,
  BarChart3,
  FilePlus2,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  PanelLeftClose,
} from 'lucide-react'
import { authAtom, sidebarCollapsedAtom, themeAtom } from '@/features/atoms'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

const assureLinks = [
  { to: '/assure', label: 'Mes sinistres', icon: FolderOpen, end: true },
  { to: '/assure/declarer', label: 'Déclarer', icon: FilePlus2 },
  { to: '/assure/notifications', label: 'Notifications', icon: Bell },
]

const assuranceLinks = [
  { to: '/assurance', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/assurance/sinistres', label: 'Sinistres', icon: FolderOpen },
  { to: '/assurance/analytique', label: 'Analytique', icon: BarChart3 },
  { to: '/assurance/rapports', label: 'Rapports', icon: FileText },
  { to: '/assurance/notifications', label: 'Notifications', icon: Bell },
  { to: '/assurance/settings', label: 'Paramètres', icon: Settings },
]

export function AppShell({ role }: { role: UserRole }) {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom)
  const [theme, setTheme] = useAtom(themeAtom)
  const auth = useAtomValue(authAtom)
  const setAuth = useSetAtom(authAtom)
  const navigate = useNavigate()
  const links = role === 'assure' ? assureLinks : assuranceLinks

  function logout() {
    setAuth({ isAuthenticated: false, user: null })
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          'sticky top-0 flex h-screen flex-col border-r border-white/5 bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] transition-all',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--sidebar-accent))] text-sm font-bold text-[hsl(var(--sidebar))]">
            AC
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold tracking-wide">AutoClaim</p>
              <p className="text-[11px] text-[hsl(var(--sidebar-muted))]">
                {role === 'assure' ? 'Espace Assuré' : 'Espace Assurance'}
              </p>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-[hsl(var(--sidebar-muted))] hover:bg-white/5 hover:text-white'
                )
              }
            >
              <link.icon className="size-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-white/10 text-xs text-white">
                {auth.user?.avatarInitials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{auth.user?.name}</p>
                <p className="truncate text-[10px] text-[hsl(var(--sidebar-muted))]">
                  {auth.user?.email}
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-[hsl(var(--sidebar-muted))] hover:bg-white/10 hover:text-white"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <Menu className="size-4" /> : <PanelLeftClose className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[hsl(var(--sidebar-muted))] hover:bg-white/10 hover:text-white"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[hsl(var(--sidebar-muted))] hover:bg-white/10 hover:text-white"
              onClick={logout}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
