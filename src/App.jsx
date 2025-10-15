import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Dashboard from './components/Dashboard'
import DailyPanel from './components/DailyPanel'
import TaskManagement from './components/TaskManagement'
import WeeklySummary from './components/WeeklySummary'
import Challenges from './components/Challenges'
import TeacherPanel from './components/TeacherPanel'
import BottomNavigation from './components/BottomNavigation'

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard')
  const { state, actions } = useApp()
  const { user } = state

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'daily':
        return <DailyPanel />
      case 'tasks':
        return <TaskManagement />
      case 'weekly':
        return <WeeklySummary />
      case 'challenges':
        return <Challenges />
      case 'teacher':
        return <TeacherPanel />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">AVOPP</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => actions.setUserType(user.type === 'student' ? 'teacher' : 'student')}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {user.type === 'student' ? '👨‍🎓' : '👨‍🏫'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto min-h-screen pb-20">
        {renderCurrentView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        userType={user.type}
      />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App