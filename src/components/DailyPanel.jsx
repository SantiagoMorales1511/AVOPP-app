import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Clock, BookOpen, CheckSquare, AlertTriangle, Calendar, Users } from 'lucide-react'

const DailyPanel = () => {
  const { state, actions } = useApp()
  const { classes, tasks, exams } = state
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Use actual data from context
  const dailyActivities = {
    classes: classes,
    tasks: tasks,
    exams: exams
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-danger-500 bg-danger-50'
      case 'medium': return 'border-warning-500 bg-warning-50'
      case 'low': return 'border-success-500 bg-success-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Urgente'
      case 'medium': return 'Importante'
      case 'low': return 'Normal'
      default: return 'Normal'
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Date Header */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <Calendar size={24} className="text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(selectedDate)}
            </h2>
            <p className="text-sm text-gray-600">
              {dailyActivities.classes.length} clases, {dailyActivities.tasks.length} tareas, {dailyActivities.exams.length} exámenes
            </p>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Users size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Clases</h3>
        </div>
        
        {dailyActivities.classes.map((classItem) => (
          <div key={classItem.id} className={`card ${classItem.completed ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <button 
                    onClick={() => actions.toggleClassComplete(classItem.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      classItem.completed 
                        ? 'bg-success-500 border-success-500' 
                        : 'border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {classItem.completed && <CheckSquare size={12} className="text-white" />}
                  </button>
                  <Clock size={16} className="text-gray-500" />
                  <span className={`font-medium text-sm ${classItem.completed ? 'line-through text-gray-500' : ''}`}>
                    {classItem.name}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{classItem.time} - {classItem.room}</p>
                <p className="text-xs text-gray-500">{classItem.professor}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-primary-100 text-primary-600 rounded-full">
                Clase
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <CheckSquare size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tareas</h3>
        </div>
        
        {dailyActivities.tasks.map((task) => (
          <div key={task.id} className={`card priority-${task.priority} ${task.completed ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <button 
                    onClick={() => actions.toggleTaskComplete(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-success-500 border-success-500' 
                        : 'border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {task.completed && <CheckSquare size={12} className="text-white" />}
                  </button>
                  <BookOpen size={16} className="text-gray-500" />
                  <span className={`font-medium text-sm ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{task.course}</p>
                <p className="text-xs text-gray-500">Entrega: {task.dueTime}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.priority === 'high' ? 'bg-danger-100 text-danger-600' :
                  task.priority === 'medium' ? 'bg-warning-100 text-warning-600' :
                  'bg-success-100 text-success-600'
                }`}>
                  {getPriorityText(task.priority)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exams Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Exámenes</h3>
        </div>
        
        {dailyActivities.exams.map((exam) => (
          <div key={exam.id} className={`card ${exam.completed ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle size={16} className="text-warning-500" />
                  <span className={`font-medium text-sm ${exam.completed ? 'line-through' : ''}`}>
                    {exam.subject}
                  </span>
                  {exam.completed && <CheckSquare size={16} className="text-success-500" />}
                </div>
                <p className="text-xs text-gray-600">{exam.time} - {exam.duration}</p>
                <p className="text-xs text-gray-500">{exam.room}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-warning-100 text-warning-600 rounded-full">
                Examen
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Study Suggestions */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-center space-x-2 mb-2">
          <Clock size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-primary-900">Sugerencias de Estudio</h3>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-primary-800">
            <p>• Bloque de estudio: 16:00 - 17:30 (Matemáticas)</p>
            <p>• Repaso rápido: 19:00 - 19:30 (Programación)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyPanel
