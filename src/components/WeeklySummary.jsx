import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar, TrendingUp, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react'

const WeeklySummary = () => {
  const [selectedWeek, setSelectedWeek] = useState(0)
  
  const weeklyData = [
    {
      week: 'Semana 1',
      data: [
        { day: 'Lun', assignments: 2, exams: 1, classes: 4, completed: 3 },
        { day: 'Mar', assignments: 1, exams: 0, classes: 3, completed: 2 },
        { day: 'Mié', assignments: 3, exams: 1, classes: 5, completed: 4 },
        { day: 'Jue', assignments: 1, exams: 0, classes: 3, completed: 1 },
        { day: 'Vie', assignments: 2, exams: 1, classes: 4, completed: 3 },
        { day: 'Sáb', assignments: 0, exams: 0, classes: 0, completed: 0 },
        { day: 'Dom', assignments: 1, exams: 0, classes: 0, completed: 1 }
      ]
    },
    {
      week: 'Semana 2',
      data: [
        { day: 'Lun', assignments: 1, exams: 0, classes: 3, completed: 2 },
        { day: 'Mar', assignments: 2, exams: 1, classes: 4, completed: 3 },
        { day: 'Mié', assignments: 1, exams: 0, classes: 3, completed: 1 },
        { day: 'Jue', assignments: 3, exams: 1, classes: 5, completed: 4 },
        { day: 'Vie', assignments: 1, exams: 0, classes: 3, completed: 2 },
        { day: 'Sáb', assignments: 0, exams: 0, classes: 0, completed: 0 },
        { day: 'Dom', assignments: 0, exams: 0, classes: 0, completed: 0 }
      ]
    }
  ]

  const currentWeek = weeklyData[selectedWeek]
  const totalAssignments = currentWeek.data.reduce((sum, day) => sum + day.assignments, 0)
  const totalExams = currentWeek.data.reduce((sum, day) => sum + day.exams, 0)
  const totalClasses = currentWeek.data.reduce((sum, day) => sum + day.classes, 0)
  const totalCompleted = currentWeek.data.reduce((sum, day) => sum + day.completed, 0)
  const completionRate = totalCompleted > 0 ? Math.round((totalCompleted / (totalAssignments + totalExams + totalClasses)) * 100) : 0

  const pieData = [
    { name: 'Tareas', value: totalAssignments, color: '#3b82f6' },
    { name: 'Exámenes', value: totalExams, color: '#f59e0b' },
    { name: 'Clases', value: totalClasses, color: '#10b981' }
  ]

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Resumen Semanal</h2>
        <div className="flex space-x-2">
          {weeklyData.map((week, index) => (
            <button
              key={index}
              onClick={() => setSelectedWeek(index)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedWeek === index
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
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
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividades por Día</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentWeek.data}>
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

      {/* Distribution Chart */}
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

      {/* Performance Insights */}
      <div className="card bg-primary-50 border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-3">Insights de Productividad</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-primary-600" />
            <span className="text-sm text-primary-800">
              Tu día más productivo fue {currentWeek.data.reduce((max, day) => 
                day.completed > max.completed ? day : max
              ).day}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className="text-success-600" />
            <span className="text-sm text-primary-800">
              Tasa de completado: {completionRate}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle size={16} className="text-warning-600" />
            <span className="text-sm text-primary-800">
              {totalExams > 0 ? `${totalExams} examen(es) esta semana` : 'Sin exámenes esta semana'}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Desglose Diario</h3>
        {currentWeek.data.map((day, index) => (
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
                <div className="text-lg font-semibold text-primary-600">{day.completed}</div>
                <div className="text-xs text-gray-500">completadas</div>
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${day.assignments + day.exams + day.classes > 0 
                    ? (day.completed / (day.assignments + day.exams + day.classes)) * 100 
                    : 0}%` 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklySummary
