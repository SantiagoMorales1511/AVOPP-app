import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Filter, Search, CheckSquare, AlertTriangle, BookOpen, Calendar, Edit, Trash2, Lock, Unlock } from 'lucide-react'
import { format, differenceInDays, isAfter, isBefore } from 'date-fns'
import { 
  calculateAutoPriority, 
  getPriorityColorByTime, 
  getPriorityTextByTime,
  sortTasksByAutoPriority 
} from '../services/priorityService'
import SubtaskModal from './SubtaskModal'

const TaskManagement = () => {
  const { state, actions } = useApp()
  const { tasks } = state
  
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    course: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    type: 'assignment',
    description: '',
    manualPriority: null // null = automática, 'high'/'medium'/'low' = manual
  })
  const [showPriorityInfo, setShowPriorityInfo] = useState(false)
  const [subtaskModalTask, setSubtaskModalTask] = useState(null)

  // Usar colores dinámicos basados en tiempo
  const getTaskPriorityDisplay = (task) => {
    const colors = getPriorityColorByTime(task.dueDate, task.completed)
    const text = getPriorityTextByTime(task.dueDate, task.completed)
    const isManual = task.manualPriority !== null && task.manualPriority !== undefined
    
    return { colors, text, isManual }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment': return <BookOpen size={16} />
      case 'project': return <CheckSquare size={16} />
      case 'exam': return <AlertTriangle size={16} />
      default: return <Calendar size={16} />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'high' && task.priority === 'high') ||
      (filter === 'medium' && task.priority === 'medium') ||
      (filter === 'low' && task.priority === 'low')
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.course.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const handleAddTask = () => {
    if (newTask.title && newTask.course && newTask.dueDate) {
      const taskToAdd = {
        ...newTask,
        fromMoodle: false,
        createdAt: new Date().toISOString()
      }
      
      // Calcular prioridad automática si no es manual
      if (!newTask.manualPriority) {
        taskToAdd.priority = calculateAutoPriority(taskToAdd)
        taskToAdd.autoPriority = taskToAdd.priority
      }
      
      actions.addTask(taskToAdd)
      setNewTask({
        title: '',
        course: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        type: 'assignment',
        description: '',
        manualPriority: null
      })
      setShowAddTask(false)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      course: task.course,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      priority: task.priority,
      type: task.type,
      description: task.description,
      manualPriority: task.manualPriority || null
    })
    setShowAddTask(true)
  }

  const handleUpdateTask = () => {
    if (editingTask && newTask.title && newTask.course && newTask.dueDate) {
      const taskToUpdate = {
        id: editingTask.id,
        ...newTask
      }
      
      // Recalcular prioridad automática si no es manual
      if (!newTask.manualPriority) {
        taskToUpdate.priority = calculateAutoPriority(taskToUpdate)
        taskToUpdate.autoPriority = taskToUpdate.priority
      }
      
      actions.updateTask(taskToUpdate)
      setEditingTask(null)
      setNewTask({
        title: '',
        course: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        type: 'assignment',
        description: '',
        manualPriority: null
      })
      setShowAddTask(false)
    }
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      actions.deleteTask(taskId)
    }
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const toggleManualPriority = (task) => {
    const newManualPriority = task.manualPriority ? null : task.priority
    actions.updateTask({
      ...task,
      manualPriority: newManualPriority,
      priority: newManualPriority || calculateAutoPriority(task)
    })
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Gestión de Tareas</h2>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Nueva</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'pending', label: 'Pendientes' },
            { id: 'completed', label: 'Completadas' },
            { id: 'high', label: 'Urgentes' },
            { id: 'medium', label: 'Importantes' },
            { id: 'low', label: 'Normales' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === filterOption.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Info Banner */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start space-x-2">
          <AlertTriangle size={16} className="text-primary-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-primary-800">
            <p className="font-medium mb-1">Priorización Automática Activa</p>
            <p>Las tareas se priorizan automáticamente según:</p>
            <ul className="list-disc ml-4 mt-1 space-y-0.5">
              <li><span className="text-red-600 font-medium">Rojo:</span> Menos de 48 horas</li>
              <li><span className="text-yellow-600 font-medium">Amarillo:</span> Entre 3-5 días</li>
              <li><span className="text-green-600 font-medium">Verde:</span> Más de 5 días</li>
            </ul>
            <p className="mt-1">Haz clic en el candado 🔒 para fijar la prioridad manualmente.</p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {sortTasksByAutoPriority(filteredTasks).map((task) => {
          const daysUntilDue = getDaysUntilDue(task.dueDate)
          const isOverdue = daysUntilDue < 0 && !task.completed
          const isDueSoon = daysUntilDue <= 1 && !task.completed
          const priorityDisplay = getTaskPriorityDisplay(task)

          return (
            <div key={task.id} className={`card ${priorityDisplay.colors.border} ${priorityDisplay.colors.bg} ${task.completed ? 'opacity-60' : ''}`}>
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => actions.toggleTaskComplete(task.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                    task.completed 
                      ? 'bg-success-500 border-success-500' 
                      : 'border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {task.completed && <CheckSquare size={12} className="text-white" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">{task.course}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                      {(task.subtasks || []).length > 0 && (
                        <p className="text-xs text-primary-600 mt-2">
                          {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtareas completadas
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-2">
                      {getTypeIcon(task.type)}
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleManualPriority(task)}
                            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                            title={priorityDisplay.isManual ? "Desbloquear prioridad (usar automática)" : "Bloquear prioridad (manual)"}
                          >
                            {priorityDisplay.isManual ? <Lock size={12} /> : <Unlock size={12} />}
                          </button>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityDisplay.colors.badge}`}>
                            {priorityDisplay.text}
                          </span>
                        </div>
                        {priorityDisplay.isManual && (
                          <span className="text-xs text-gray-500 italic">Manual</span>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setSubtaskModalTask(task)}
                          className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Administrar subtareas"
                        >
                          <CheckSquare size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Calendar size={12} className="text-gray-400" />
                      <span className={`text-xs ${
                        isOverdue ? 'text-danger-600 font-medium' :
                        isDueSoon ? 'text-warning-600 font-medium' :
                        'text-gray-500'
                      }`}>
                        {isOverdue ? `Vencida hace ${Math.abs(daysUntilDue)} días` :
                         isDueSoon ? `Vence hoy` :
                         daysUntilDue === 0 ? 'Vence hoy' :
                         `Vence en ${daysUntilDue} días`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {task.dueTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-8">
          <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'No se encontraron tareas con ese criterio' : 'Agrega tu primera tarea'}
          </p>
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Título de la tarea"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curso *
                </label>
                <input
                  type="text"
                  value={newTask.course}
                  onChange={(e) => setNewTask({...newTask, course: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nombre del curso"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de entrega *
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <div className="space-y-2">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      disabled={!newTask.manualPriority}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                    <label className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        checked={newTask.manualPriority !== null}
                        onChange={(e) => setNewTask({
                          ...newTask, 
                          manualPriority: e.target.checked ? newTask.priority : null
                        })}
                        className="rounded"
                      />
                      <span className="text-gray-600">Prioridad manual</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="assignment">Tarea</option>
                    <option value="project">Proyecto</option>
                    <option value="exam">Examen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descripción de la tarea"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTask(false)
                  setEditingTask(null)
                  setNewTask({
                    title: '',
                    course: '',
                    dueDate: '',
                    dueTime: '',
                    priority: 'medium',
                    type: 'assignment',
                    description: '',
                    manualPriority: null
                  })
                }}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                className="flex-1 btn-primary"
              >
                {editingTask ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {subtaskModalTask && (
        <SubtaskModal
          task={subtaskModalTask}
          onClose={() => setSubtaskModalTask(null)}
        />
      )}
    </div>
  )
}

export default TaskManagement
