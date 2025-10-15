import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { format, differenceInHours, differenceInDays, isToday, isTomorrow } from 'date-fns'

export const useNotifications = () => {
  const { state, actions } = useApp()
  const { tasks, exams, settings } = state

  // Generate notifications based on tasks and exams
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications = []
      const now = new Date()

      // Check tasks for notifications
      tasks.forEach(task => {
        if (!task.completed) {
          const dueDate = new Date(task.dueDate)
          const hoursUntilDue = differenceInHours(dueDate, now)
          const daysUntilDue = differenceInDays(dueDate, now)

          // High priority notification for urgent tasks
          if (hoursUntilDue <= 2 && hoursUntilDue > 0) {
            newNotifications.push({
              title: `Entrega hoy ${task.dueTime || '23:59'}`,
              course: task.course,
              type: task.type,
              priority: 'high',
              time: `${Math.floor(hoursUntilDue)} horas restantes`,
              read: false,
              createdAt: now.toISOString(),
              taskId: task.id
            })
          }
          // Medium priority for tasks due tomorrow
          else if (isTomorrow(dueDate)) {
            newNotifications.push({
              title: `Entrega mañana ${task.dueTime || '23:59'}`,
              course: task.course,
              type: task.type,
              priority: 'medium',
              time: 'Mañana',
              read: false,
              createdAt: now.toISOString(),
              taskId: task.id
            })
          }
          // Low priority for tasks due in 3 days
          else if (daysUntilDue <= 3 && daysUntilDue > 0) {
            newNotifications.push({
              title: `Entrega en ${daysUntilDue} días`,
              course: task.course,
              type: task.type,
              priority: 'low',
              time: `${daysUntilDue} días`,
              read: false,
              createdAt: now.toISOString(),
              taskId: task.id
            })
          }
        }
      })

      // Check exams for notifications
      exams.forEach(exam => {
        if (!exam.completed) {
          const examDate = new Date(exam.date)
          const hoursUntilExam = differenceInHours(examDate, now)
          const daysUntilExam = differenceInDays(examDate, now)

          // High priority for exams tomorrow or today
          if (isToday(examDate) || isTomorrow(examDate)) {
            newNotifications.push({
              title: `Examen ${isToday(examDate) ? 'hoy' : 'mañana'} ${exam.time}`,
              course: exam.subject,
              type: 'exam',
              priority: 'high',
              time: isToday(examDate) ? 'Hoy' : 'Mañana',
              read: false,
              createdAt: now.toISOString(),
              examId: exam.id
            })
          }
          // Medium priority for exams in 3 days
          else if (daysUntilExam <= 3 && daysUntilExam > 0) {
            newNotifications.push({
              title: `Examen en ${daysUntilExam} días`,
              course: exam.subject,
              type: 'exam',
              priority: 'medium',
              time: `${daysUntilExam} días`,
              read: false,
              createdAt: now.toISOString(),
              examId: exam.id
            })
          }
        }
      })

      // Add new notifications to state
      newNotifications.forEach(notification => {
        // Check if notification already exists
        const exists = state.notifications.some(n => 
          n.taskId === notification.taskId || n.examId === notification.examId
        )
        if (!exists) {
          actions.addNotification(notification)
        }
      })
    }

    // Generate notifications on mount and every hour
    generateNotifications()
    const interval = setInterval(generateNotifications, 60 * 60 * 1000) // Every hour

    return () => clearInterval(interval)
  }, [tasks, exams, settings, state.notifications, actions])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Show browser notifications for high priority items
  useEffect(() => {
    if (settings.notifications.enabled && 'Notification' in window && Notification.permission === 'granted') {
      const unreadHighPriority = state.notifications.filter(n => 
        !n.read && n.priority === 'high'
      )

      unreadHighPriority.forEach(notification => {
        new Notification(`AVOPP - ${notification.title}`, {
          body: `${notification.course} - ${notification.time}`,
          icon: '/favicon.ico',
          tag: notification.id
        })
      })
    }
  }, [state.notifications, settings.notifications.enabled])

  return {
    notifications: state.notifications,
    markAsRead: actions.markNotificationRead,
    deleteNotification: actions.deleteNotification
  }
}
