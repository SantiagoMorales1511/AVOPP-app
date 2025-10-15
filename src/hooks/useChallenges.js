import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { format, differenceInDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'

export const useChallenges = () => {
  const { state, actions } = useApp()
  const { tasks, challenges, badges } = state

  // Check and update challenge progress
  useEffect(() => {
    const updateChallengeProgress = () => {
      challenges.forEach(challenge => {
        if (challenge.active && !challenge.completed) {
          let newProgress = 0

          switch (challenge.type) {
            case 'streak':
              // Check for consecutive days without late tasks
              newProgress = calculateStreakProgress(tasks)
              break
            case 'quantity':
              // Count completed tasks in the last week
              newProgress = calculateQuantityProgress(tasks)
              break
            case 'timing':
              // Count tasks completed before 10 AM
              newProgress = calculateTimingProgress(tasks)
              break
            default:
              break
          }

          if (newProgress !== challenge.progress) {
            actions.updateChallengeProgress(challenge.id, newProgress)
            
            // Check if challenge is completed
            if (newProgress >= challenge.total) {
              actions.completeChallenge(challenge.id)
              actions.earnBadge(challenge.reward)
              
              // Show completion notification
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`¡Reto Completado! 🎉`, {
                  body: `Has completado "${challenge.title}" y ganado ${challenge.reward}`,
                  icon: '/favicon.ico'
                })
              }
            }
          }
        }
      })
    }

    updateChallengeProgress()
  }, [tasks, challenges, actions])

  const calculateStreakProgress = (tasks) => {
    const today = new Date()
    let streak = 0
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate)
        return taskDate.toDateString() === checkDate.toDateString()
      })
      
      // Check if all tasks for this day were completed on time
      const allCompletedOnTime = dayTasks.every(task => {
        if (!task.completed) return false
        
        const completedDate = new Date(task.completedAt || task.dueDate)
        const dueDate = new Date(task.dueDate)
        
        return completedDate <= dueDate
      })
      
      if (allCompletedOnTime && dayTasks.length > 0) {
        streak++
      } else if (dayTasks.length === 0) {
        // No tasks for this day, count as successful
        streak++
      } else {
        break
      }
    }
    
    return Math.min(streak, 7)
  }

  const calculateQuantityProgress = (tasks) => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return tasks.filter(task => {
      const completedDate = new Date(task.completedAt || task.dueDate)
      return task.completed && completedDate >= oneWeekAgo
    }).length
  }

  const calculateTimingProgress = (tasks) => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return tasks.filter(task => {
      if (!task.completed) return false
      
      const completedDate = new Date(task.completedAt || task.dueDate)
      const completedHour = completedDate.getHours()
      
      return completedDate >= oneWeekAgo && completedHour < 10
    }).length
  }

  const joinChallenge = (challengeId) => {
    // This would typically involve API calls to join a challenge
    // For now, we'll just simulate it
    console.log(`Joined challenge ${challengeId}`)
  }

  const getAvailableChallenges = () => {
    return [
      {
        id: 1,
        title: '7 Días Sin Retrasos',
        description: 'Completa todas tus tareas a tiempo durante 7 días consecutivos',
        type: 'streak',
        progress: 0,
        total: 7,
        reward: 'Insignia de Puntualidad',
        difficulty: 'medium',
        timeLeft: '7 días',
        participants: 1247,
        active: true,
        completed: false
      },
      {
        id: 2,
        title: 'Estudiante Productivo',
        description: 'Completa 20 tareas en una semana',
        type: 'quantity',
        progress: 0,
        total: 20,
        reward: 'Insignia de Productividad',
        difficulty: 'hard',
        timeLeft: '7 días',
        participants: 892,
        active: true,
        completed: false
      },
      {
        id: 3,
        title: 'Mañana Temprano',
        description: 'Completa 5 tareas antes de las 10 AM',
        type: 'timing',
        progress: 0,
        total: 5,
        reward: 'Insignia de Madrugador',
        difficulty: 'easy',
        timeLeft: '7 días',
        participants: 634,
        active: true,
        completed: false
      }
    ]
  }

  return {
    challenges,
    badges,
    joinChallenge,
    getAvailableChallenges
  }
}
