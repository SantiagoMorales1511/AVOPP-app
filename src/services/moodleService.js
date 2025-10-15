// Simulated Moodle API service
class MoodleService {
  constructor() {
    this.baseUrl = 'https://moodle.icesi.edu.co'
    this.apiKey = 'simulated_api_key'
    this.lastSync = localStorage.getItem('moodle_last_sync') || null
  }

  // Simulate API delay
  async delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Simulate fetching courses from Moodle
  async getCourses() {
    await this.delay(500)
    
    return [
      {
        id: 1,
        shortname: 'PROG-WEB',
        fullname: 'Programación Web',
        summary: 'Desarrollo de aplicaciones web modernas',
        startdate: '2024-01-15',
        enddate: '2024-06-15',
        enrolled: true
      },
      {
        id: 2,
        shortname: 'BD-2024',
        fullname: 'Bases de Datos',
        summary: 'Diseño y administración de bases de datos',
        startdate: '2024-01-15',
        enddate: '2024-06-15',
        enrolled: true
      },
      {
        id: 3,
        shortname: 'CALC-I',
        fullname: 'Cálculo I',
        summary: 'Cálculo diferencial e integral',
        startdate: '2024-01-15',
        enddate: '2024-06-15',
        enrolled: true
      }
    ]
  }

  // Simulate fetching assignments from Moodle
  async getAssignments() {
    await this.delay(800)
    
    const assignments = [
      {
        id: 101,
        course: 'Programación Web',
        courseId: 1,
        name: 'Proyecto Final - Aplicación Web',
        description: 'Desarrollar una aplicación web completa usando React y Node.js',
        duedate: '2024-01-20T23:59:00Z',
        timelimit: 0,
        allowsubmissionsfromdate: '2024-01-10T00:00:00Z',
        grade: 100,
        cmid: 1001,
        fromMoodle: true,
        priority: 'high',
        type: 'project'
      },
      {
        id: 102,
        course: 'Bases de Datos',
        courseId: 2,
        name: 'Ejercicios de Consultas SQL',
        description: 'Resolver 10 ejercicios de consultas SQL complejas',
        duedate: '2024-01-18T18:00:00Z',
        timelimit: 0,
        allowsubmissionsfromdate: '2024-01-12T00:00:00Z',
        grade: 50,
        cmid: 1002,
        fromMoodle: true,
        priority: 'medium',
        type: 'assignment'
      },
      {
        id: 103,
        course: 'Cálculo I',
        courseId: 3,
        name: 'Tarea de Derivadas',
        description: 'Resolver problemas de derivadas y aplicaciones',
        duedate: '2024-01-15T12:00:00Z',
        timelimit: 0,
        allowsubmissionsfromdate: '2024-01-08T00:00:00Z',
        grade: 30,
        cmid: 1003,
        fromMoodle: true,
        priority: 'low',
        type: 'assignment'
      }
    ]

    // Mark some as completed randomly
    return assignments.map(assignment => ({
      ...assignment,
      completed: Math.random() > 0.7,
      completedAt: Math.random() > 0.7 ? new Date().toISOString() : null
    }))
  }

  // Simulate fetching quizzes/exams from Moodle
  async getQuizzes() {
    await this.delay(600)
    
    return [
      {
        id: 201,
        course: 'Cálculo I',
        courseId: 3,
        name: 'Examen Parcial - Derivadas',
        description: 'Examen parcial sobre derivadas y aplicaciones',
        timeopen: '2024-01-22T09:00:00Z',
        timeclose: '2024-01-22T11:00:00Z',
        timelimit: 7200, // 2 hours in seconds
        grade: 100,
        cmid: 2001,
        fromMoodle: true,
        priority: 'high',
        type: 'exam'
      },
      {
        id: 202,
        course: 'Física I',
        courseId: 4,
        name: 'Quiz de Mecánica',
        description: 'Quiz sobre conceptos básicos de mecánica',
        timeopen: '2024-01-25T15:00:00Z',
        timeclose: '2024-01-25T16:30:00Z',
        timelimit: 5400, // 1.5 hours in seconds
        grade: 50,
        cmid: 2002,
        fromMoodle: true,
        priority: 'medium',
        type: 'exam'
      }
    ]
  }

  // Simulate fetching course events/calendar
  async getCourseEvents() {
    await this.delay(400)
    
    return [
      {
        id: 301,
        course: 'Programación Web',
        courseId: 1,
        name: 'Clase: Introducción a React',
        description: 'Clase presencial sobre conceptos básicos de React',
        timestart: '2024-01-16T08:00:00Z',
        timeduration: 7200, // 2 hours
        location: 'A-201',
        type: 'class',
        fromMoodle: true
      },
      {
        id: 302,
        course: 'Bases de Datos',
        courseId: 2,
        name: 'Laboratorio: Consultas Avanzadas',
        description: 'Sesión de laboratorio sobre consultas SQL avanzadas',
        timestart: '2024-01-16T10:00:00Z',
        timeduration: 7200, // 2 hours
        location: 'B-105',
        type: 'class',
        fromMoodle: true
      }
    ]
  }

  // Simulate syncing all data from Moodle
  async syncAllData() {
    try {
      console.log('🔄 Iniciando sincronización con Moodle...')
      
      const [courses, assignments, quizzes, events] = await Promise.all([
        this.getCourses(),
        this.getAssignments(),
        this.getQuizzes(),
        this.getCourseEvents()
      ])

      const syncData = {
        courses,
        assignments: assignments.map(assignment => ({
          id: assignment.id,
          title: assignment.name,
          course: assignment.course,
          dueDate: assignment.duedate.split('T')[0],
          dueTime: assignment.duedate.split('T')[1].substring(0, 5),
          priority: assignment.priority,
          type: assignment.type,
          completed: assignment.completed,
          description: assignment.description,
          fromMoodle: true,
          createdAt: assignment.allowsubmissionsfromdate.split('T')[0]
        })),
        exams: quizzes.map(quiz => ({
          id: quiz.id,
          subject: quiz.course,
          time: quiz.timeopen.split('T')[1].substring(0, 5),
          duration: `${Math.floor(quiz.timelimit / 3600)} horas`,
          room: 'A-301', // Simulated room
          date: quiz.timeopen.split('T')[0],
          completed: false,
          fromMoodle: true
        })),
        classes: events.map(event => ({
          id: event.id,
          name: event.name,
          time: event.timestart.split('T')[1].substring(0, 5),
          room: event.location,
          professor: 'Dr. García', // Simulated professor
          day: 'monday', // Simulated day
          completed: false,
          fromMoodle: true
        }))
      }

      // Update last sync time
      this.lastSync = new Date().toISOString()
      localStorage.setItem('moodle_last_sync', this.lastSync)

      console.log('✅ Sincronización con Moodle completada')
      return syncData
    } catch (error) {
      console.error('❌ Error en sincronización con Moodle:', error)
      throw error
    }
  }

  // Check if sync is needed (every 24 hours)
  needsSync() {
    if (!this.lastSync) return true
    
    const lastSyncDate = new Date(this.lastSync)
    const now = new Date()
    const hoursSinceSync = (now - lastSyncDate) / (1000 * 60 * 60)
    
    return hoursSinceSync >= 24
  }

  // Get sync status
  getSyncStatus() {
    return {
      lastSync: this.lastSync,
      needsSync: this.needsSync(),
      nextSync: this.lastSync ? 
        new Date(new Date(this.lastSync).getTime() + 24 * 60 * 60 * 1000).toISOString() : 
        null
    }
  }
}

export default new MoodleService()
