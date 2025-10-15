import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar, TrendingUp, CheckCircle, AlertTriangle, BookOpen, RefreshCw } from 'lucide-react'
import { getWeeklyData, getWeeklyStats, getMostProductiveDay, getMultipleWeeksData } from '../services/weeklyService'

const WeeklySummary = () => {
  const { state } = useApp()
  const { tasks, classes, exams } = state
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0)
  const [weeksData, setWeeksData] = useState([])
  
  // Generar datos de las últimas 4 semanas automáticamente
  useEffect(() => {
    const weeks = getMultipleWeeksData(tasks, classes, exams, 4)
    setWeeksData(weeks)
  }, [tasks, classes, exams])

  // Obtener la semana seleccionada actual
  const currentWeekData = weeksData.find(w => w.offset === selectedWeekOffset) || {
    data: [],
    stats: { totalAssignments: 0, totalExams: 0, totalClasses: 0, totalCompleted: 0, completionRate: 0 },
    mostProductiveDay: null
  }

  const { data: weekData, stats, mostProductiveDay } = currentWeekData
  const { totalAssignments, totalExams, totalClasses, totalCompleted, completionRate, totalActivities } = stats

  const pieData = [
    { name: 'Tareas', value: totalAssignments, color: '#3b82f6' },
    { name: 'Exámenes', value: totalExams, color: '#f59e0b' },
    { name: 'Clases', value: totalClasses, color: '#10b981' }
  ].filter(item => item.value > 0) // Solo mostrar categorías con datos

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Resumen Semanal</h2>
          <RefreshCw size={18} className="text-primary-600" />
        </div>
        
        {/* Week Selector */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {weeksData.map((week, index) => (
            <button
              key={index}
              onClick={() => setSelectedWeekOffset(week.offset)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedWeekOffset === week.offset
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {week.label}
            </button>
          ))}
        </div>

        {/* Data info banner */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-2">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              Datos actualizados automáticamente desde tus tareas, clases y exámenes reales.
            </p>
          </div>
        </div>
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{totalAssignments}</div>
          <div className="text-sm text-gray-600">Tareas</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{totalExams}</div>
          <div className="text-sm text-gray-600">Exámenes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{totalClasses}</div>
          <div className="text-sm text-gray-600">Clases</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">Completado</div>
        </div>
      </div>

      {/* Weekly Chart */}
      {weekData.length > 0 ? (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividades por Día</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="assignments" fill="#3b82f6" name="Tareas" />
                <Bar dataKey="exams" fill="#f59e0b" name="Exámenes" />
                <Bar dataKey="classes" fill="#10b981" name="Clases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos esta semana</h3>
          <p className="text-gray-500 text-sm">
            No hay actividades registradas para esta semana.
          </p>
        </div>
      )}

      {/* Distribution Chart */}
      {pieData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Actividades</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      {totalActivities > 0 && (
        <div className="card bg-primary-50 border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-3">Insights de Productividad</h3>
          <div className="space-y-2">
            {mostProductiveDay && mostProductiveDay.completed > 0 && (
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-primary-600" />
                <span className="text-sm text-primary-800">
                  Tu día más productivo fue {mostProductiveDay.day} con {mostProductiveDay.completed} {mostProductiveDay.completed === 1 ? 'actividad completada' : 'actividades completadas'}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-success-600" />
              <span className="text-sm text-primary-800">
                Tasa de completado: {completionRate}% ({totalCompleted} de {totalActivities})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} className="text-warning-600" />
              <span className="text-sm text-primary-800">
                {totalExams > 0 ? `${totalExams} examen(es) esta semana` : 'Sin exámenes esta semana'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen size={16} className="text-blue-600" />
              <span className="text-sm text-primary-800">
                {totalAssignments > 0 ? `${totalAssignments} tarea(s) asignadas` : 'Sin tareas asignadas'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Daily Breakdown */}
      {weekData.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Desglose Diario</h3>
          {weekData.map((day, index) => {
            const dayTotal = day.total
            const dayProgress = dayTotal > 0 ? (day.completed / dayTotal) * 100 : 0
            
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{day.day}</h4>
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>{day.assignments} tareas</span>
                      <span>{day.exams} exámenes</span>
                      <span>{day.classes} clases</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary-600">{day.completed}/{dayTotal}</div>
                    <div className="text-xs text-gray-500">completadas</div>
                  </div>
                </div>
                {dayTotal > 0 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${dayProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WeeklySummary
