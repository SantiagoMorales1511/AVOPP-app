import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Filter, Search, CheckSquare, AlertTriangle, BookOpen, Calendar, Edit, Trash2 } from 'lucide-react'
import { format, differenceInDays, isAfter, isBefore } from 'date-fns'

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
    description: ''
  })

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
      actions.addTask({
        ...newTask,
        fromMoodle: false,
        createdAt: new Date().toISOString()
      })
      setNewTask({
        title: '',
        course: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        type: 'assignment',
        description: ''
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
      description: task.description
    })
    setShowAddTask(true)
  }

  const handleUpdateTask = () => {
    if (editingTask && newTask.title && newTask.course && newTask.dueDate) {
      actions.updateTask({
        id: editingTask.id,
        ...newTask
      })
      setEditingTask(null)
      setNewTask({
        title: '',
        course: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        type: 'assignment',
        description: ''
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

  const sortTasksByPriority = (a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
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

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.sort(sortTasksByPriority).map((task) => {
          const daysUntilDue = getDaysUntilDue(task.dueDate)
          const isOverdue = daysUntilDue < 0 && !task.completed
          const isDueSoon = daysUntilDue <= 1 && !task.completed

          return (
            <div key={task.id} className={`card priority-${task.priority} ${task.completed ? 'opacity-60' : ''}`}>
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
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-2">
                      {getTypeIcon(task.type)}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.priority === 'high' ? 'bg-danger-100 text-danger-600' :
                        task.priority === 'medium' ? 'bg-warning-100 text-warning-600' :
                        'bg-success-100 text-success-600'
                      }`}>
                        {getPriorityText(task.priority)}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit size={14} />
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
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
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
                    description: ''
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
    </div>
  )
}

export default TaskManagement
