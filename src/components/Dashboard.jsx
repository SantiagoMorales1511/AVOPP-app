import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNotifications } from '../hooks/useNotifications'
import { Bell, Clock, AlertTriangle, CheckCircle, Calendar, BookOpen, Settings, Cloud } from 'lucide-react'
import { format, isToday, isTomorrow, differenceInHours, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import NotificationSettings from './NotificationSettings'
import MoodleSync from './MoodleSync'

const Dashboard = () => {
  const { state, actions } = useApp()
  const { tasks, classes, exams } = state
  const { notifications } = useNotifications()
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [showMoodleSync, setShowMoodleSync] = useState(false)

  // Get today's tasks
  const today = new Date()
  const todayTasks = [
    ...classes.filter(cls => isToday(new Date(today.setHours(parseInt(cls.time.split(':')[0]), parseInt(cls.time.split(':')[1]))))),
    ...tasks.filter(task => isToday(new Date(task.dueDate))),
    ...exams.filter(exam => isToday(new Date(exam.date)))
  ]

  // Calculate weekly stats
  const weeklyStats = {
    assignments: tasks.filter(task => task.type === 'assignment').length,
    exams: exams.length,
    classes: classes.length,
    completed: tasks.filter(task => task.completed).length
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-danger-600 bg-danger-50'
      case 'medium': return 'text-warning-600 bg-warning-50'
      case 'low': return 'text-success-600 bg-success-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment': return <BookOpen size={16} />
      case 'exam': return <AlertTriangle size={16} />
      case 'project': return <CheckCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          ¡Buenos días! 👋
        </h2>
        <p className="text-gray-600 text-sm">
          Tienes {todayTasks.filter(task => !task.completed).length} tareas pendientes para hoy
        </p>
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recordatorios</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMoodleSync(true)}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              title="Sincronizar con Moodle"
            >
              <Cloud size={16} />
            </button>
            <button
              onClick={() => setShowNotificationSettings(true)}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              title="Configurar notificaciones"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
        
        {notifications.slice(0, 3).map((notification) => (
          <div key={notification.id} className={`card priority-${notification.priority} ${notification.read ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getTypeIcon(notification.type)}
                  <span className="font-medium text-sm">{notification.title}</span>
                  {!notification.read && <div className="w-2 h-2 bg-primary-600 rounded-full"></div>}
                </div>
                <p className="text-xs text-gray-600">{notification.course}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                  {notification.priority === 'high' ? 'Urgente' : 
                   notification.priority === 'medium' ? 'Importante' : 'Normal'}
                </div>
                <button
                  onClick={() => actions.markNotificationRead(notification.id)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  {notification.read ? 'Leído' : 'Marcar leído'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Hoy</h3>
        </div>
        
        {todayTasks.map((task) => (
          <div key={task.id} className={`card ${task.completed ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    // Handle different types of tasks
                    if (task.type === 'assignment' || task.type === 'project' || task.type === 'exam') {
                      actions.toggleTaskComplete(task.id)
                    } else if (task.type === 'class' || !task.type) {
                      // For classes, toggle class completion
                      actions.toggleClassComplete(task.id)
                    }
                  }}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    task.completed 
                      ? 'bg-success-500 border-success-500' 
                      : 'border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {task.completed && <CheckCircle size={12} className="text-white" />}
                </button>
                <div>
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title || task.name}
                  </p>
                  <p className="text-xs text-gray-500">{task.time}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {task.type || 'clase'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de la semana</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{weeklyStats.assignments}</div>
            <div className="text-xs text-gray-600">Tareas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">{weeklyStats.exams}</div>
            <div className="text-xs text-gray-600">Exámenes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">{weeklyStats.completed}</div>
            <div className="text-xs text-gray-600">Completadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{weeklyStats.classes}</div>
            <div className="text-xs text-gray-600">Clases</div>
          </div>
        </div>
      </div>

      {/* Notification Settings Modal */}
      <NotificationSettings 
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />

      {/* Moodle Sync Modal */}
      <MoodleSync 
        isOpen={showMoodleSync}
        onClose={() => setShowMoodleSync(false)}
      />
    </div>
  )
}

export default Dashboard
