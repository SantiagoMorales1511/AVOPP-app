import { useMemo } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { Bell, CheckCircle, Trash2, Eye, EyeOff, Clock } from 'lucide-react'

const NotificationsCenter = () => {
  const { notifications, markAsRead, deleteNotification } = useNotifications()

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [notifications])

  const unreadCount = sortedNotifications.filter((n) => !n.read).length

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell size={24} className="text-primary-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Centro de Notificaciones</h2>
            <p className="text-sm text-gray-600">
              {unreadCount === 0 ? 'Todo al día' : `${unreadCount} pendiente(s) por revisar`}
            </p>
          </div>
        </div>
      </div>

      {sortedNotifications.length === 0 ? (
        <div className="card text-center py-10">
          <CheckCircle size={32} className="mx-auto text-success-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Sin notificaciones</h3>
          <p className="text-sm text-gray-500 mt-1">
            Aquí verás tus recordatorios y alertas importantes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card border-l-4 ${
                notification.priority === 'high'
                  ? 'border-danger-500'
                  : notification.priority === 'medium'
                  ? 'border-warning-500'
                  : 'border-primary-500'
              } ${notification.read ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {notification.type === 'exam'
                        ? 'Examen'
                        : notification.type === 'assignment'
                        ? 'Tarea'
                        : notification.type === 'project'
                        ? 'Proyecto'
                        : 'Aviso'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center space-x-1">
                      <Clock size={12} />
                      <span>
                        {new Date(notification.createdAt).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mt-2">{notification.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{notification.course}</p>
                  {notification.time && (
                    <p className="text-xs text-gray-500 mt-1">⏰ {notification.time}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    title={notification.read ? 'Marcado como leído' : 'Marcar como leído'}
                  >
                    {notification.read ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
                    title="Eliminar notificación"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsCenter

