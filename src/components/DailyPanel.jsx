import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Clock, BookOpen, CheckSquare, AlertTriangle, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { isToday, isSameDay, format, addDays, subDays, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { getPriorityColorByTime, getPriorityTextByTime } from '../services/priorityService'

const DailyPanel = () => {
  const { state, actions } = useApp()
  const { classes, tasks, exams } = state
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Filter activities for selected date
  const filterByDate = (items, dateField = 'dueDate') => {
    return items.filter(item => {
      if (!item[dateField]) return false
      const itemDate = new Date(item[dateField])
      return isSameDay(itemDate, selectedDate)
    })
  }

  // Filter classes by day of week and selected date
  const filterClassesByDate = (classes) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const selectedDayName = dayNames[selectedDate.getDay()]
    
    return classes.filter(cls => {
      if (cls.day && cls.day.toLowerCase() === selectedDayName) {
        return true
      }
      // Si tiene fecha específica, verificar que coincida
      if (cls.date) {
        return isSameDay(new Date(cls.date), selectedDate)
      }
      return false
    })
  }
  
  // Filter data for selected date
  const dailyActivities = {
    classes: filterClassesByDate(classes),
    tasks: filterByDate(tasks, 'dueDate'),
    exams: filterByDate(exams, 'date')
  }

  const totalActivities = dailyActivities.classes.length + dailyActivities.tasks.length + dailyActivities.exams.length
  const completedActivities = [
    ...dailyActivities.classes.filter(c => c.completed),
    ...dailyActivities.tasks.filter(t => t.completed),
    ...dailyActivities.exams.filter(e => e.completed)
  ].length

  const formatDate = (date) => {
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  }

  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1))
  }

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  return (
    <div className="p-4 space-y-6">
      {/* Date Header with Navigation */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToPreviousDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="flex-1 text-center">
            <h2 className="text-base font-semibold text-gray-900 capitalize">
              {formatDate(selectedDate)}
            </h2>
            {!isToday(selectedDate) && (
              <button
                onClick={goToToday}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-1"
              >
                Ir a hoy
              </button>
            )}
          </div>
          
          <button
            onClick={goToNextDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">
                {totalActivities} {totalActivities === 1 ? 'actividad' : 'actividades'} 
                {isToday(selectedDate) ? ' hoy' : ' este día'}
              </p>
              <p className="text-xs text-gray-500">
                {dailyActivities.classes.length} clases · {dailyActivities.tasks.length} tareas · {dailyActivities.exams.length} exámenes
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary-600">{completedActivities}/{totalActivities}</div>
            <div className="text-xs text-gray-500">completadas</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalActivities === 0 && (
        <div className="card text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin actividades
          </h3>
          <p className="text-gray-500 text-sm">
            No hay clases, tareas ni exámenes para este día.
          </p>
          {!isToday(selectedDate) && (
            <button
              onClick={goToToday}
              className="mt-4 btn-primary"
            >
              Ver actividades de hoy
            </button>
          )}
        </div>
      )}

      {/* Classes Section */}
      {dailyActivities.classes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Clases ({dailyActivities.classes.length})
            </h3>
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
      )}

      {/* Tasks Section */}
      {dailyActivities.tasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckSquare size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Tareas ({dailyActivities.tasks.length})
            </h3>
          </div>
          
          {dailyActivities.tasks.map((task) => {
            const priorityColors = getPriorityColorByTime(task.dueDate, task.completed)
            const priorityText = getPriorityTextByTime(task.dueDate, task.completed)
            
            return (
              <div key={task.id} className={`card ${priorityColors.border} ${priorityColors.bg} ${task.completed ? 'opacity-60' : ''}`}>
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
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors.badge}`}>
                  {priorityText}
                </span>
              </div>
            </div>
          </div>
            )
          })}
        </div>
      )}

      {/* Exams Section */}
      {dailyActivities.exams.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Exámenes ({dailyActivities.exams.length})
            </h3>
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
      )}

      {/* Study Suggestions - Only show if there are activities */}
      {totalActivities > 0 && (
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
      )}
    </div>
  )
}

export default DailyPanel
