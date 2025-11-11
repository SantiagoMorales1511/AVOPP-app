import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CheckSquare, Square, Plus, Trash2, Edit2, Save, X } from 'lucide-react'

const SubtaskModal = ({ task, onClose }) => {
  const { actions } = useApp()
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [editingSubtaskId, setEditingSubtaskId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  if (!task) return null

  const handleAddSubtask = () => {
    const title = newSubtaskTitle.trim()
    if (!title) return
    actions.addSubtask(task.id, {
      title,
      completed: false,
      completedAt: null
    })
    setNewSubtaskTitle('')
  }

  const startEditing = (subtask) => {
    setEditingSubtaskId(subtask.id)
    setEditingTitle(subtask.title)
  }

  const handleUpdate = (subtask) => {
    const title = editingTitle.trim()
    if (!title) return
    actions.updateSubtask(task.id, { ...subtask, title })
    setEditingSubtaskId(null)
    setEditingTitle('')
  }

  const handleDelete = (subtaskId) => {
    actions.deleteSubtask(task.id, subtaskId)
  }

  const toggleSubtask = (subtaskId) => {
    actions.toggleSubtaskComplete(task.id, subtaskId)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Subtareas</h2>
              <p className="text-sm text-gray-600 mt-1">{task.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {(task.subtasks || []).length === 0 && (
              <div className="card bg-gray-50 text-sm text-gray-600">
                No hay subtareas todavía. Crea la primera para dividir el trabajo.
              </div>
            )}

            {(task.subtasks || []).map((subtask) => {
              const isEditing = editingSubtaskId === subtask.id
              return (
                <div
                  key={subtask.id}
                  className={`card ${subtask.completed ? 'bg-success-50 border-success-200' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleSubtask(subtask.id)}
                      className="mt-1 text-primary-600 hover:text-primary-700"
                      title={subtask.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      {subtask.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>

                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          placeholder="Nombre de la subtarea"
                        />
                      ) : (
                        <p
                          className={`text-sm font-medium ${
                            subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {subtask.title}
                        </p>
                      )}
                      {subtask.completedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completado el {new Date(subtask.completedAt).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <button
                          onClick={() => handleUpdate(subtask)}
                          className="p-2 text-success-600 hover:text-success-700 transition-colors"
                          title="Guardar cambios"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(subtask)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Editar subtarea"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(subtask.id)}
                        className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
                        title="Eliminar subtarea"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card bg-gray-50 border-dashed border-2 border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Nueva subtarea</h3>
            <div className="flex space-x-2">
              <input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Escribe el título..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleAddSubtask}
                className="btn-primary flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubtaskModal

