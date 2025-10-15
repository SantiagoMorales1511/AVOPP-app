import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

// Initial state
const initialState = {
  user: {
    type: 'student', // 'student' or 'teacher'
    name: 'Santiago Morales',
    email: 'santiago.morales@icesi.edu.co',
    avatar: null
  },
  tasks: [
    {
      id: 1,
      title: 'Proyecto Final de Programación Web',
      course: 'Programación Web',
      dueDate: '2024-01-20',
      dueTime: '23:59',
      priority: 'high',
      type: 'project',
      completed: false,
      description: 'Desarrollar una aplicación web completa usando React y Node.js',
      createdAt: '2024-01-10',
      fromMoodle: true
    },
    {
      id: 2,
      title: 'Ejercicios de Base de Datos',
      course: 'Bases de Datos',
      dueDate: '2024-01-18',
      dueTime: '18:00',
      priority: 'medium',
      type: 'assignment',
      completed: false,
      description: 'Resolver 10 ejercicios de consultas SQL',
      createdAt: '2024-01-12',
      fromMoodle: true
    },
    {
      id: 3,
      title: 'Tarea de Matemáticas',
      course: 'Cálculo I',
      dueDate: '2024-01-15',
      dueTime: '12:00',
      priority: 'low',
      type: 'assignment',
      completed: true,
      description: 'Resolver problemas de derivadas',
      createdAt: '2024-01-08',
      fromMoodle: false
    }
  ],
  classes: [
    {
      id: 1,
      name: 'Programación Web',
      time: '08:00',
      room: 'A-201',
      professor: 'Dr. García',
      day: 'monday',
      completed: false
    },
    {
      id: 2,
      name: 'Bases de Datos',
      time: '10:00',
      room: 'B-105',
      professor: 'Dra. López',
      day: 'monday',
      completed: false
    },
    {
      id: 3,
      name: 'Matemáticas',
      time: '14:00',
      room: 'C-301',
      professor: 'Dr. Martínez',
      day: 'monday',
      completed: true
    }
  ],
  exams: [
    {
      id: 1,
      subject: 'Cálculo I',
      time: '09:00',
      duration: '2 horas',
      room: 'A-301',
      date: '2024-01-22',
      completed: false
    },
    {
      id: 2,
      subject: 'Física',
      time: '15:00',
      duration: '1.5 horas',
      room: 'B-201',
      date: '2024-01-25',
      completed: false
    }
  ],
  notifications: [
    {
      id: 1,
      title: 'Entrega hoy 11:59 pm',
      course: 'Programación Web',
      type: 'assignment',
      priority: 'high',
      time: '2 horas restantes',
      read: false,
      createdAt: new Date().toISOString()
    }
  ],
  challenges: [
    {
      id: 1,
      title: '7 Días Sin Retrasos',
      description: 'Completa todas tus tareas a tiempo durante 7 días consecutivos',
      type: 'streak',
      progress: 5,
      total: 7,
      reward: 'Insignia de Puntualidad',
      difficulty: 'medium',
      timeLeft: '2 días',
      participants: 1247,
      active: true,
      completed: false
    }
  ],
  badges: [
    { id: 1, name: 'Insignia de Puntualidad', earned: false },
    { id: 2, name: 'Insignia de Productividad', earned: false },
    { id: 3, name: 'Insignia de Madrugador', earned: false },
    { id: 4, name: 'Insignia de Novato', earned: true },
    { id: 5, name: 'Insignia de Disciplina', earned: true }
  ],
  settings: {
    notifications: {
      enabled: true,
      assignmentReminder: 24, // hours before
      examReminder: 72, // hours before
      studySuggestions: true
    },
    theme: 'light',
    language: 'es'
  }
}

// Action types
const ActionTypes = {
  // User actions
  SET_USER_TYPE: 'SET_USER_TYPE',
  UPDATE_USER: 'UPDATE_USER',
  
  // Task actions
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_TASK_COMPLETE: 'TOGGLE_TASK_COMPLETE',
  
  // Class actions
  ADD_CLASS: 'ADD_CLASS',
  UPDATE_CLASS: 'UPDATE_CLASS',
  DELETE_CLASS: 'DELETE_CLASS',
  TOGGLE_CLASS_COMPLETE: 'TOGGLE_CLASS_COMPLETE',
  
  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  
  // Challenge actions
  UPDATE_CHALLENGE_PROGRESS: 'UPDATE_CHALLENGE_PROGRESS',
  COMPLETE_CHALLENGE: 'COMPLETE_CHALLENGE',
  EARN_BADGE: 'EARN_BADGE',
  
  // Settings actions
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // Data persistence
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA'
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER_TYPE:
      return {
        ...state,
        user: { ...state.user, type: action.payload }
      }
    
    case ActionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now() }]
      }
    
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      }
    
    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    
    case ActionTypes.TOGGLE_TASK_COMPLETE:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
            : task
        )
      }
    
    case ActionTypes.ADD_CLASS:
      return {
        ...state,
        classes: [...state.classes, { ...action.payload, id: Date.now() }]
      }
    
    case ActionTypes.UPDATE_CLASS:
      return {
        ...state,
        classes: state.classes.map(classItem =>
          classItem.id === action.payload.id ? { ...classItem, ...action.payload } : classItem
        )
      }
    
    case ActionTypes.DELETE_CLASS:
      return {
        ...state,
        classes: state.classes.filter(classItem => classItem.id !== action.payload)
      }
    
    case ActionTypes.TOGGLE_CLASS_COMPLETE:
      return {
        ...state,
        classes: state.classes.map(classItem =>
          classItem.id === action.payload
            ? { ...classItem, completed: !classItem.completed }
            : classItem
        )
      }
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [{ ...action.payload, id: Date.now() }, ...state.notifications]
      }
    
    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      }
    
    case ActionTypes.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      }
    
    case ActionTypes.UPDATE_CHALLENGE_PROGRESS:
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload.id
            ? { ...challenge, progress: action.payload.progress }
            : challenge
        )
      }
    
    case ActionTypes.COMPLETE_CHALLENGE:
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload
            ? { ...challenge, completed: true, active: false }
            : challenge
        )
      }
    
    case ActionTypes.EARN_BADGE:
      return {
        ...state,
        badges: state.badges.map(badge =>
          badge.name === action.payload
            ? { ...badge, earned: true }
            : badge
        )
      }
    
    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    
    case ActionTypes.LOAD_DATA:
      return { ...state, ...action.payload }
    
    default:
      return state
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('avopp-data')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: ActionTypes.LOAD_DATA, payload: parsedData })
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('avopp-data', JSON.stringify(state))
  }, [state])

  // Action creators
  const actions = {
    setUserType: (type) => dispatch({ type: ActionTypes.SET_USER_TYPE, payload: type }),
    
    addTask: (task) => dispatch({ type: ActionTypes.ADD_TASK, payload: task }),
    updateTask: (task) => dispatch({ type: ActionTypes.UPDATE_TASK, payload: task }),
    deleteTask: (id) => dispatch({ type: ActionTypes.DELETE_TASK, payload: id }),
    toggleTaskComplete: (id) => dispatch({ type: ActionTypes.TOGGLE_TASK_COMPLETE, payload: id }),
    
    addClass: (classItem) => dispatch({ type: ActionTypes.ADD_CLASS, payload: classItem }),
    updateClass: (classItem) => dispatch({ type: ActionTypes.UPDATE_CLASS, payload: classItem }),
    deleteClass: (id) => dispatch({ type: ActionTypes.DELETE_CLASS, payload: id }),
    toggleClassComplete: (id) => dispatch({ type: ActionTypes.TOGGLE_CLASS_COMPLETE, payload: id }),
    
    addNotification: (notification) => dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification }),
    markNotificationRead: (id) => dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: id }),
    deleteNotification: (id) => dispatch({ type: ActionTypes.DELETE_NOTIFICATION, payload: id }),
    
    updateChallengeProgress: (id, progress) => 
      dispatch({ type: ActionTypes.UPDATE_CHALLENGE_PROGRESS, payload: { id, progress } }),
    completeChallenge: (id) => dispatch({ type: ActionTypes.COMPLETE_CHALLENGE, payload: id }),
    earnBadge: (badgeName) => dispatch({ type: ActionTypes.EARN_BADGE, payload: badgeName }),
    
    updateSettings: (settings) => dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings })
  }

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
