import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, format, subWeeks, addWeeks } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Obtiene los datos de una semana específica basados en tareas, clases y exámenes reales
 */
export const getWeeklyData = (tasks, classes, exams, weekOffset = 0) => {
  const today = new Date()
  const targetWeek = weekOffset === 0 ? today : addWeeks(today, weekOffset)
  
  const weekStart = startOfWeek(targetWeek, { weekStartsOn: 1 }) // Lunes
  const weekEnd = endOfWeek(targetWeek, { weekStartsOn: 1 }) // Domingo
  
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  const weekData = daysOfWeek.map(day => {
    const dayName = format(day, 'EEE', { locale: es }) // Lun, Mar, etc.
    const fullDayName = format(day, 'EEEE', { locale: es }).toLowerCase() // monday, tuesday, etc.
    
    // Filtrar tareas del día
    const dayTasks = tasks.filter(task => {
      if (!task.dueDate) return false
      return isSameDay(new Date(task.dueDate), day)
    })
    
    // Filtrar exámenes del día
    const dayExams = exams.filter(exam => {
      if (!exam.date) return false
      return isSameDay(new Date(exam.date), day)
    })
    
    // Filtrar clases del día (las clases se repiten semanalmente)
    const dayClasses = classes.filter(cls => {
      // Mapeo de días en inglés (como se almacenan en el estado)
      const dayMapping = {
        'lunes': 'monday',
        'martes': 'tuesday',
        'miércoles': 'wednesday',
        'jueves': 'thursday',
        'viernes': 'friday',
        'sábado': 'saturday',
        'domingo': 'sunday'
      }
      
      const classDayName = cls.day ? cls.day.toLowerCase() : null
      
      // Buscar coincidencia en ambas direcciones
      if (classDayName === fullDayName) return true
      
      // Buscar por el valor mapeado
      for (const [spanish, english] of Object.entries(dayMapping)) {
        if ((classDayName === english && fullDayName === spanish) ||
            (classDayName === spanish && fullDayName === english)) {
          return true
        }
      }
      
      return false
    })
    
    // Contar tareas completadas del día
    const completed = dayTasks.filter(t => t.completed).length + 
                     dayExams.filter(e => e.completed).length +
                     dayClasses.filter(c => c.completed).length
    
    return {
      day: dayName,
      fullDate: day,
      assignments: dayTasks.filter(t => t.type === 'assignment' || t.type === 'project').length,
      exams: dayExams.length + dayTasks.filter(t => t.type === 'exam').length,
      classes: dayClasses.length,
      completed: completed,
      total: dayTasks.length + dayExams.length + dayClasses.length
    }
  })
  
  return weekData
}

/**
 * Calcula las estadísticas totales de la semana
 */
export const getWeeklyStats = (weekData) => {
  const totalAssignments = weekData.reduce((sum, day) => sum + day.assignments, 0)
  const totalExams = weekData.reduce((sum, day) => sum + day.exams, 0)
  const totalClasses = weekData.reduce((sum, day) => sum + day.classes, 0)
  const totalCompleted = weekData.reduce((sum, day) => sum + day.completed, 0)
  const totalActivities = weekData.reduce((sum, day) => sum + day.total, 0)
  
  const completionRate = totalActivities > 0 
    ? Math.round((totalCompleted / totalActivities) * 100) 
    : 0
  
  return {
    totalAssignments,
    totalExams,
    totalClasses,
    totalCompleted,
    totalActivities,
    completionRate
  }
}

/**
 * Encuentra el día más productivo de la semana
 */
export const getMostProductiveDay = (weekData) => {
  if (weekData.length === 0) return null
  
  return weekData.reduce((max, day) => 
    day.completed > max.completed ? day : max
  , weekData[0])
}

/**
 * Obtiene datos para múltiples semanas (para navegación)
 */
export const getMultipleWeeksData = (tasks, classes, exams, weeksCount = 4) => {
  const weeks = []
  
  for (let i = -(weeksCount - 1); i <= 0; i++) {
    const weekData = getWeeklyData(tasks, classes, exams, i)
    const stats = getWeeklyStats(weekData)
    const mostProductiveDay = getMostProductiveDay(weekData)
    
    const weekStart = startOfWeek(addWeeks(new Date(), i), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(addWeeks(new Date(), i), { weekStartsOn: 1 })
    
    weeks.push({
      offset: i,
      label: `Semana ${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM', { locale: es })}`,
      data: weekData,
      stats,
      mostProductiveDay
    })
  }
  
  return weeks
}

