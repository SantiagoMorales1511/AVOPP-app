import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Users, BarChart3, AlertTriangle, CheckCircle, Calendar, MessageSquare, FileText, TrendingUp, Plus, Send } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const TeacherPanel = () => {
  const { state, actions } = useApp()
  const { tasks, classes, exams } = state
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    course: '',
    priority: 'normal'
  })
  
  // Generate student data based on actual tasks
  const generateStudentData = () => {
    const students = ['María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez', 'Sofia Pérez', 'Diego Torres']
    
    return students.map(student => {
      const studentTasks = tasks.filter(task => 
        Math.random() > 0.3 // Simulate some students having more tasks
      )
      const completed = studentTasks.filter(task => task.completed).length
      const late = studentTasks.filter(task => {
        if (!task.completed) return false
        const dueDate = new Date(task.dueDate)
        const completedDate = new Date(task.completedAt || task.dueDate)
        return completedDate > dueDate
      }).length
      
      return {
        name: student,
        assignments: studentTasks.length,
        exams: Math.floor(Math.random() * 3) + 1,
        completed,
        late,
        grade: (3.5 + Math.random() * 1.5).toFixed(1)
      }
    })
  }

  const studentData = generateStudentData()

  // Generate weekly stats based on actual data
  const generateWeeklyStats = () => {
    const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5']
    return weeks.map((week, index) => {
      const baseAssignments = tasks.length
      const variation = Math.floor(Math.random() * 6) - 3 // -3 to +3
      const assignments = Math.max(1, baseAssignments + variation)
      const completed = Math.floor(assignments * (0.7 + Math.random() * 0.2)) // 70-90% completion
      const late = Math.floor(completed * (0.1 + Math.random() * 0.1)) // 10-20% late
      
      return {
        week,
        assignments,
        exams: Math.floor(Math.random() * 4) + 1,
        completed,
        late
      }
    })
  }

  const weeklyStats = generateWeeklyStats()

  const courseData = [
    { name: 'Programación Web', assignments: 25, exams: 5, students: 45, completion: 85 },
    { name: 'Bases de Datos', assignments: 20, exams: 3, students: 38, completion: 78 },
    { name: 'Matemáticas', assignments: 15, exams: 4, students: 52, completion: 72 }
  ]

  const pieData = [
    { name: 'Completadas', value: 65, color: '#10b981' },
    { name: 'Pendientes', value: 25, color: '#f59e0b' },
    { name: 'Retrasadas', value: 10, color: '#ef4444' }
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

  const totalStudents = studentData.length
  const totalAssignments = studentData.reduce((sum, student) => sum + student.assignments, 0)
  const totalCompleted = studentData.reduce((sum, student) => sum + student.completed, 0)
  const totalLate = studentData.reduce((sum, student) => sum + student.late, 0)
  const averageGrade = (studentData.reduce((sum, student) => sum + parseFloat(student.grade), 0) / totalStudents).toFixed(1)

  const handleSendAnnouncement = () => {
    if (announcement.title && announcement.message) {
      // Create notification for students
      actions.addNotification({
        title: announcement.title,
        course: announcement.course || 'General',
        type: 'announcement',
        priority: announcement.priority,
        time: 'Ahora',
        read: false,
        createdAt: new Date().toISOString()
      })
      
      // Reset form
      setAnnouncement({
        title: '',
        message: '',
        course: '',
        priority: 'normal'
      })
      setShowAnnouncementModal(false)
      
      alert('Anuncio enviado exitosamente')
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Users size={24} className="text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900">Panel Docente</h2>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2">
        {[
          { id: 'week', label: 'Esta Semana' },
          { id: 'month', label: 'Este Mes' },
          { id: 'semester', label: 'Semestre' }
        ].map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === period.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{totalStudents}</div>
          <div className="text-sm text-gray-600">Estudiantes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{totalAssignments}</div>
          <div className="text-sm text-gray-600">Tareas Asignadas</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{totalCompleted}</div>
          <div className="text-sm text-gray-600">Completadas</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">{totalLate}</div>
          <div className="text-sm text-gray-600">Retrasadas</div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso Semanal</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="assignments" fill="#3b82f6" name="Asignadas" />
              <Bar dataKey="completed" fill="#10b981" name="Completadas" />
              <Bar dataKey="late" fill="#ef4444" name="Retrasadas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Performance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Rendimiento de Estudiantes</h3>
        
        {studentData.map((student, index) => {
          const completionRate = Math.round((student.completed / student.assignments) * 100)
          const isHighPerformer = completionRate >= 90
          const isAtRisk = completionRate < 70 || student.late > 2
          
          return (
            <div key={index} className={`card ${isAtRisk ? 'border-danger-200 bg-danger-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    {isHighPerformer && <CheckCircle size={16} className="text-success-500" />}
                    {isAtRisk && <AlertTriangle size={16} className="text-danger-500" />}
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                    <span>{student.assignments} tareas</span>
                    <span>{student.completed} completadas</span>
                    <span>{student.late} retrasadas</span>
                    <span>Promedio: {student.grade}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    isHighPerformer ? 'text-success-600' :
                    isAtRisk ? 'text-danger-600' :
                    'text-gray-600'
                  }`}>
                    {completionRate}%
                  </div>
                  <div className="text-xs text-gray-500">completado</div>
                </div>
              </div>
              
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isHighPerformer ? 'bg-success-500' :
                    isAtRisk ? 'bg-danger-500' :
                    'bg-primary-500'
                  }`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Course Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Resumen por Curso</h3>
        
        {courseData.map((course, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{course.name}</h4>
                <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                  <span>{course.assignments} tareas</span>
                  <span>{course.exams} exámenes</span>
                  <span>{course.students} estudiantes</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary-600">{course.completion}%</div>
                <div className="text-xs text-gray-500">completado</div>
              </div>
            </div>
            
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.completion}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Tareas</h3>
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
              <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts and Recommendations */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Alertas y Recomendaciones</h3>
        
        <div className="card bg-warning-50 border-warning-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle size={20} className="text-warning-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-warning-900">Estudiantes en Riesgo</h4>
              <p className="text-sm text-warning-800 mt-1">
                2 estudiantes tienen un rendimiento por debajo del 70%. Considera contactarlos.
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-start space-x-2">
            <TrendingUp size={20} className="text-primary-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary-900">Tendencia Positiva</h4>
              <p className="text-sm text-primary-800 mt-1">
                La tasa de completado ha aumentado un 15% esta semana.
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-success-50 border-success-200">
          <div className="flex items-start space-x-2">
            <CheckCircle size={20} className="text-success-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-success-900">Excelente Rendimiento</h4>
              <p className="text-sm text-success-800 mt-1">
                4 estudiantes mantienen un rendimiento superior al 90%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Center */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Centro de Comunicación</h3>
        <div className="space-y-2">
          <button 
            onClick={() => setShowAnnouncementModal(true)}
            className="w-full flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageSquare size={16} className="text-primary-600" />
            <span className="text-sm font-medium">Enviar anuncio general</span>
          </button>
          <button 
            onClick={() => {
              // Simulate creating task reminder
              const newTask = {
                title: 'Recordatorio de Tarea',
                course: 'General',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                dueTime: '23:59',
                priority: 'medium',
                type: 'assignment',
                description: 'Tarea creada por el profesor',
                fromMoodle: false
              }
              actions.addTask(newTask)
              alert('Recordatorio de tarea creado')
            }}
            className="w-full flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText size={16} className="text-primary-600" />
            <span className="text-sm font-medium">Crear recordatorio de tarea</span>
          </button>
          <button 
            onClick={() => {
              // Simulate scheduling exam
              const newExam = {
                subject: 'Examen Programado',
                time: '09:00',
                duration: '2 horas',
                room: 'A-301',
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                completed: false
              }
              // This would need to be implemented in the context
              alert('Evaluación programada')
            }}
            className="w-full flex items-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar size={16} className="text-primary-600" />
            <span className="text-sm font-medium">Programar evaluación</span>
          </button>
        </div>
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Enviar Anuncio</h2>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={announcement.title}
                    onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Título del anuncio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso
                  </label>
                  <select
                    value={announcement.course}
                    onChange={(e) => setAnnouncement({...announcement, course: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">General</option>
                    <option value="Programación Web">Programación Web</option>
                    <option value="Bases de Datos">Bases de Datos</option>
                    <option value="Cálculo I">Cálculo I</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={announcement.priority}
                    onChange={(e) => setAnnouncement({...announcement, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={4}
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendAnnouncement}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <Send size={16} />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherPanel
