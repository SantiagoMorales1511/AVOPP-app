import { differenceInHours, differenceInDays, parseISO } from 'date-fns'

/**
 * Calcula la prioridad automática de una tarea basándose en:
 * - Fecha de entrega
 * - Tipo de actividad
 * - Estado de finalización
 */
export const calculateAutoPriority = (task) => {
  // Si está completada, prioridad baja
  if (task.completed) {
    return 'low'
  }

  const now = new Date()
  const dueDate = new Date(task.dueDate)
  const hoursUntilDue = differenceInHours(dueDate, now)
  const daysUntilDue = differenceInDays(dueDate, now)

  // Prioridad base según tipo de actividad
  const typePriority = {
    'exam': 3,      // Exámenes tienen mayor peso
    'project': 2,   // Proyectos son importantes
    'assignment': 1 // Tareas regulares
  }

  const typeWeight = typePriority[task.type] || 1

  // Cálculo de prioridad según tiempo restante
  let timePriority = 0
  
  if (hoursUntilDue < 0) {
    // Vencida - máxima prioridad
    timePriority = 4
  } else if (hoursUntilDue < 48) {
    // Menos de 48 horas - urgente
    timePriority = 3
  } else if (daysUntilDue >= 2 && daysUntilDue <= 5) {
    // 3-5 días - importante
    timePriority = 2
  } else {
    // Más de 5 días - normal
    timePriority = 1
  }

  // Combinar prioridades
  const totalPriority = timePriority + (typeWeight * 0.3)

  // Determinar nivel final
  if (totalPriority >= 3.5 || hoursUntilDue < 48) {
    return 'high'
  } else if (totalPriority >= 2) {
    return 'medium'
  } else {
    return 'low'
  }
}

/**
 * Obtiene el color dinámico basado en el tiempo restante
 */
export const getPriorityColorByTime = (dueDate, completed = false) => {
  if (completed) {
    return {
      border: 'border-gray-300',
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      badge: 'bg-gray-100 text-gray-600'
    }
  }

  const now = new Date()
  const due = new Date(dueDate)
  const hoursUntilDue = differenceInHours(due, now)
  const daysUntilDue = differenceInDays(due, now)

  if (hoursUntilDue < 0) {
    // Vencida
    return {
      border: 'border-red-500',
      bg: 'bg-red-50',
      text: 'text-red-600',
      badge: 'bg-red-100 text-red-700'
    }
  } else if (hoursUntilDue < 48) {
    // Menos de 48h - Rojo (urgente)
    return {
      border: 'border-danger-500',
      bg: 'bg-danger-50',
      text: 'text-danger-600',
      badge: 'bg-danger-100 text-danger-600'
    }
  } else if (daysUntilDue >= 2 && daysUntilDue <= 5) {
    // 3-5 días - Amarillo (importante)
    return {
      border: 'border-warning-500',
      bg: 'bg-warning-50',
      text: 'text-warning-600',
      badge: 'bg-warning-100 text-warning-600'
    }
  } else {
    // Más de 5 días - Verde (normal)
    return {
      border: 'border-success-500',
      bg: 'bg-success-50',
      text: 'text-success-600',
      badge: 'bg-success-100 text-success-600'
    }
  }
}

/**
 * Obtiene el texto de prioridad según tiempo
 */
export const getPriorityTextByTime = (dueDate, completed = false) => {
  if (completed) {
    return 'Completada'
  }

  const now = new Date()
  const due = new Date(dueDate)
  const hoursUntilDue = differenceInHours(due, now)
  const daysUntilDue = differenceInDays(due, now)

  if (hoursUntilDue < 0) {
    return 'Vencida'
  } else if (hoursUntilDue < 48) {
    return 'Urgente'
  } else if (daysUntilDue >= 2 && daysUntilDue <= 5) {
    return 'Importante'
  } else {
    return 'Normal'
  }
}

/**
 * Ordena tareas por prioridad automática
 */
export const sortTasksByAutoPriority = (tasks) => {
  return [...tasks].sort((a, b) => {
    // Completadas al final
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Si no están completadas, ordenar por prioridad automática
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const aPriority = a.manualPriority || calculateAutoPriority(a)
    const bPriority = b.manualPriority || calculateAutoPriority(b)

    if (aPriority !== bPriority) {
      return priorityOrder[bPriority] - priorityOrder[aPriority]
    }

    // Si tienen la misma prioridad, ordenar por fecha
    return new Date(a.dueDate) - new Date(b.dueDate)
  })
}

/**
 * Actualiza las prioridades automáticas de todas las tareas
 */
export const updateTasksPriorities = (tasks) => {
  return tasks.map(task => ({
    ...task,
    autoPriority: calculateAutoPriority(task),
    priority: task.manualPriority || calculateAutoPriority(task)
  }))
}

