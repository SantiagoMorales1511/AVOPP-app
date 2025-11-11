import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { TrendingUp, Target, Award, Zap, CalendarRange, CheckCircle } from 'lucide-react'
import { getWeeklyData, getWeeklyStats, getMostProductiveDay } from '../services/weeklyService'

const ProductivityReport = () => {
  const { state } = useApp()
  const { tasks, classes, exams, challenges } = state

  const weekData = useMemo(() => getWeeklyData(tasks, classes, exams, 0), [tasks, classes, exams])
  const weekStats = useMemo(() => getWeeklyStats(weekData), [weekData])
  const mostProductiveDay = useMemo(() => getMostProductiveDay(weekData), [weekData])

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)
  const activeChallenges = challenges.filter((challenge) => challenge.active && !challenge.completed)
  const completedChallenges = challenges.filter((challenge) => challenge.completed)

  const progressByPriority = ['high', 'medium', 'low'].map((priority) => {
    const total = tasks.filter((task) => task.priority === priority).length
    const completed = tasks.filter(
      (task) => task.priority === priority && task.completed
    ).length
    return {
      priority,
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  })

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <TrendingUp size={24} className="text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Informe de Productividad</h2>
        </div>
        <p className="text-sm text-gray-600">
          Un vistazo rápido a tu rendimiento reciente y áreas de oportunidad.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{completedTasks.length}</div>
          <div className="text-sm text-gray-600">Tareas completadas</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{pendingTasks.length}</div>
          <div className="text-sm text-gray-600">Pendientes directos</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">
            {weekStats.completionRate}%
          </div>
          <div className="text-sm text-gray-600">Avance semanal</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {activeChallenges.length}
          </div>
          <div className="text-sm text-gray-600">Retos en progreso</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Prioridades a la vista</h3>
        <div className="space-y-3">
          {progressByPriority.map((item) => (
            <div key={item.priority}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize text-gray-800">
                  {item.priority === 'high'
                    ? 'Alta (Urgente)'
                    : item.priority === 'medium'
                    ? 'Media (Importante)'
                    : 'Baja (Normal)'}
                </span>
                <span className="text-xs text-gray-500">
                  {item.completed}/{item.total} completadas
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.priority === 'high'
                      ? 'bg-danger-500'
                      : item.priority === 'medium'
                      ? 'bg-warning-500'
                      : 'bg-success-500'
                  }`}
                  style={{ width: `${item.completionRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start space-x-3">
          <Target size={20} className="text-primary-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-primary-900">Enfoque recomendado</h3>
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-primary-800 mt-1">
                ¡Todo en orden! Aprovecha para adelantar en tus retos activos.
              </p>
            ) : (
              <ul className="list-disc ml-4 mt-2 space-y-1 text-sm text-primary-800">
                {pendingTasks.slice(0, 3).map((task) => (
                  <li key={task.id}>
                    <span className="font-medium">{task.title}</span> ·{' '}
                    <span>{task.course}</span>
                  </li>
                ))}
                {pendingTasks.length > 3 && (
                  <li className="font-medium">
                    +{pendingTasks.length - 3} pendientes adicionales
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Retos motivacionales</h3>
        <div className="space-y-2">
          {activeChallenges.length === 0 && completedChallenges.length === 0 && (
            <p className="text-sm text-gray-500">
              Todavía no te has unido a retos. Visita la sección "Retos" para activarlos.
            </p>
          )}
          {activeChallenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-gray-900">{challenge.title}</p>
                <p className="text-xs text-gray-500">
                  Progreso {challenge.progress}/{challenge.total} · {challenge.timeLeft}
                </p>
              </div>
              <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                En progreso
              </span>
            </div>
          ))}
          {completedChallenges.slice(0, 2).map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-success-700">{challenge.title}</p>
                <p className="text-xs text-success-600">
                  Recompensa: {challenge.reward}
                </p>
              </div>
              <CheckCircle size={16} className="text-success-600" />
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-gray-50 border-gray-200">
        <div className="flex items-start space-x-3">
          <CalendarRange size={20} className="text-gray-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resumen semanal</h3>
            <div className="mt-1 text-sm text-gray-600 space-y-1">
              <p>Total de actividades: {weekStats.totalActivities}</p>
              <p>Completadas: {weekStats.totalCompleted}</p>
              <p>Tareas asignadas: {weekStats.totalAssignments}</p>
              <p>Exámenes: {weekStats.totalExams}</p>
              <p>Clases: {weekStats.totalClasses}</p>
            </div>
            {mostProductiveDay && (
              <p className="text-sm text-primary-700 mt-2 flex items-center space-x-1">
                <Award size={16} className="text-primary-600" />
                <span>
                  Día más productivo: {mostProductiveDay.day} ({mostProductiveDay.completed}{' '}
                  completadas)
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductivityReport

