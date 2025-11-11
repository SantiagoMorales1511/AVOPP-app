import {
  Home,
  Calendar,
  CheckSquare,
  BarChart3,
  Trophy,
  Users,
  Bell,
  ClipboardList
} from 'lucide-react'

const BottomNavigation = ({ currentView, setCurrentView, userType }) => {
  const studentNavItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'daily', label: 'Hoy', icon: Calendar },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare },
    { id: 'notifications', label: 'Alertas', icon: Bell },
    { id: 'weekly', label: 'Semana', icon: BarChart3 },
    { id: 'challenges', label: 'Retos', icon: Trophy },
    { id: 'report', label: 'Informe', icon: ClipboardList }
  ]

  const teacherNavItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'teacher', label: 'Panel', icon: Users },
    { id: 'notifications', label: 'Alertas', icon: Bell },
    { id: 'weekly', label: 'Reportes', icon: BarChart3 },
    { id: 'report', label: 'Informe', icon: ClipboardList }
  ]

  const navItems = userType === 'student' ? studentNavItems : teacherNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                  isActive 
                    ? 'text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNavigation
