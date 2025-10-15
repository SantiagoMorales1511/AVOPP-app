import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Bell, BellOff, Clock, Settings, X } from 'lucide-react'

const NotificationSettings = ({ isOpen, onClose }) => {
  const { state, actions } = useApp()
  const { settings } = state
  const [localSettings, setLocalSettings] = useState(settings.notifications)

  const handleSave = () => {
    actions.updateSettings({
      notifications: localSettings
    })
    onClose()
  }

  const handleTestNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('AVOPP - Notificación de Prueba', {
          body: 'Esta es una notificación de prueba de AVOPP',
          icon: '/favicon.ico'
        })
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('AVOPP - Notificación de Prueba', {
              body: 'Esta es una notificación de prueba de AVOPP',
              icon: '/favicon.ico'
            })
          }
        })
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Bell size={24} className="text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Configuración de Notificaciones</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Enable Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Notificaciones</h3>
                <p className="text-sm text-gray-600">Recibir notificaciones en el navegador</p>
              </div>
              <button
                onClick={() => setLocalSettings({...localSettings, enabled: !localSettings.enabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.enabled ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Assignment Reminder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recordatorio de Tareas
              </label>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-400" />
                <select
                  value={localSettings.assignmentReminder}
                  onChange={(e) => setLocalSettings({...localSettings, assignmentReminder: parseInt(e.target.value)})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={1}>1 hora antes</option>
                  <option value={2}>2 horas antes</option>
                  <option value={6}>6 horas antes</option>
                  <option value={12}>12 horas antes</option>
                  <option value={24}>1 día antes</option>
                  <option value={48}>2 días antes</option>
                  <option value={72}>3 días antes</option>
                </select>
              </div>
            </div>

            {/* Exam Reminder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recordatorio de Exámenes
              </label>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-400" />
                <select
                  value={localSettings.examReminder}
                  onChange={(e) => setLocalSettings({...localSettings, examReminder: parseInt(e.target.value)})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={1}>1 hora antes</option>
                  <option value={6}>6 horas antes</option>
                  <option value={12}>12 horas antes</option>
                  <option value={24}>1 día antes</option>
                  <option value={48}>2 días antes</option>
                  <option value={72}>3 días antes</option>
                  <option value={168}>1 semana antes</option>
                </select>
              </div>
            </div>

            {/* Study Suggestions */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Sugerencias de Estudio</h3>
                <p className="text-sm text-gray-600">Recibir sugerencias de horarios de estudio</p>
              </div>
              <button
                onClick={() => setLocalSettings({...localSettings, studySuggestions: !localSettings.studySuggestions})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.studySuggestions ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.studySuggestions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Test Notification */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleTestNotification}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Bell size={16} />
                <span>Probar Notificación</span>
              </button>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 btn-primary"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings
