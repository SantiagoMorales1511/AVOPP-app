import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { RefreshCw, CheckCircle, AlertCircle, Clock, Cloud, CloudOff } from 'lucide-react'
import moodleService from '../services/moodleService'

const MoodleSync = ({ isOpen, onClose }) => {
  const { state, actions } = useApp()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null)
  const [lastSyncData, setLastSyncData] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setSyncStatus(moodleService.getSyncStatus())
    }
  }, [isOpen])

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const syncData = await moodleService.syncAllData()
      setLastSyncData(syncData)
      
      // Update app state with synced data
      if (syncData.assignments) {
        syncData.assignments.forEach(assignment => {
          // Check if assignment already exists
          const exists = state.tasks.some(task => 
            task.fromMoodle && task.title === assignment.title
          )
          if (!exists) {
            actions.addTask(assignment)
          }
        })
      }

      if (syncData.exams) {
        // Update exams in state (this would need to be implemented in context)
        console.log('Exams synced:', syncData.exams)
      }

      if (syncData.classes) {
        // Update classes in state (this would need to be implemented in context)
        console.log('Classes synced:', syncData.classes)
      }

      setSyncStatus(moodleService.getSyncStatus())
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = (lastSync) => {
    if (!lastSync) return 'Nunca'
    const date = new Date(lastSync)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Cloud size={24} className="text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Sincronización con Moodle</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Sync Status */}
            <div className="card">
              <div className="flex items-center space-x-3">
                {syncStatus?.needsSync ? (
                  <AlertCircle size={20} className="text-warning-600" />
                ) : (
                  <CheckCircle size={20} className="text-success-600" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {syncStatus?.needsSync ? 'Sincronización Pendiente' : 'Sincronizado'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Última sincronización: {formatLastSync(syncStatus?.lastSync)}
                  </p>
                </div>
              </div>
            </div>

            {/* Sync Info */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">¿Qué se sincroniza?</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-success-500" />
                  <span>Tareas y proyectos</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-success-500" />
                  <span>Exámenes y evaluaciones</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-success-500" />
                  <span>Horarios de clases</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-success-500" />
                  <span>Fechas de entrega</span>
                </div>
              </div>
            </div>

            {/* Sync Results */}
            {lastSyncData && (
              <div className="card bg-success-50 border-success-200">
                <h3 className="font-medium text-success-900 mb-2">Última Sincronización</h3>
                <div className="space-y-1 text-sm text-success-800">
                  <p>• {lastSyncData.assignments?.length || 0} tareas sincronizadas</p>
                  <p>• {lastSyncData.exams?.length || 0} exámenes sincronizados</p>
                  <p>• {lastSyncData.classes?.length || 0} clases sincronizadas</p>
                </div>
              </div>
            )}

            {/* Auto Sync Info */}
            <div className="card bg-primary-50 border-primary-200">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-900">Sincronización Automática</span>
              </div>
              <p className="text-sm text-primary-800 mt-1">
                Los datos se sincronizan automáticamente cada 24 horas
              </p>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cerrar
            </button>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>Sincronizar Ahora</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodleSync
