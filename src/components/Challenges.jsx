import { useState } from 'react'
import { useChallenges } from '../hooks/useChallenges'
import { Trophy, Target, Calendar, CheckCircle, Star, Flame, Clock, Award, Plus } from 'lucide-react'

const Challenges = () => {
  const { challenges, badges, joinChallenge, getAvailableChallenges } = useChallenges()
  const [showAvailableChallenges, setShowAvailableChallenges] = useState(false)
  
  const activeChallenges = challenges.filter(challenge => challenge.active && !challenge.completed)
  const completedChallenges = challenges.filter(challenge => challenge.completed)
  const availableChallenges = getAvailableChallenges()

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-success-600 bg-success-100'
      case 'medium': return 'text-warning-600 bg-warning-100'
      case 'hard': return 'text-danger-600 bg-danger-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Medio'
      case 'hard': return 'Difícil'
      default: return 'Normal'
    }
  }

  const getProgressPercentage = (progress, total) => {
    return Math.round((progress / total) * 100)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Trophy size={24} className="text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900">Retos y Logros</h2>
      </div>

      {/* Active Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Retos Activos</h3>
          <button
            onClick={() => setShowAvailableChallenges(true)}
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <Plus size={16} />
            <span>Unirse a más</span>
          </button>
        </div>
        
        {activeChallenges.map((challenge) => {
          const getIcon = (type) => {
            switch (type) {
              case 'streak': return Clock
              case 'quantity': return Target
              case 'timing': return Calendar
              default: return Trophy
            }
          }
          const Icon = getIcon(challenge.type)
          const progressPercentage = getProgressPercentage(challenge.progress, challenge.total)
          
          return (
            <div key={challenge.id} className="card">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon size={24} className="text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {getDifficultyText(challenge.difficulty)}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso: {challenge.progress}/{challenge.total}</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">⏰ {challenge.timeLeft}</span>
                      <span className="text-gray-500">👥 {challenge.participants}</span>
                    </div>
                    <span className="text-primary-600 font-medium">🏆 {challenge.reward}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completed Challenges */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Retos Completados</h3>
        
        {completedChallenges.map((challenge) => {
          const Icon = challenge.icon
          
          return (
            <div key={challenge.id} className="card bg-success-50 border-success-200">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Icon size={24} className="text-success-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-success-900">{challenge.title}</h4>
                      <p className="text-sm text-success-700 mt-1">{challenge.description}</p>
                    </div>
                    <CheckCircle size={20} className="text-success-600" />
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-sm text-success-600 font-medium">🏆 {challenge.reward}</span>
                    <p className="text-xs text-success-600 mt-1">
                      Completado el {new Date(challenge.completedDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Badges Collection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Colección de Insignias</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon
            
            return (
              <div key={badge.id} className={`card text-center ${badge.earned ? 'bg-success-50 border-success-200' : 'bg-gray-50'}`}>
                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 ${
                  badge.earned ? 'bg-success-100' : 'bg-gray-200'
                }`}>
                  <Icon size={24} className={badge.earned ? 'text-success-600' : 'text-gray-400'} />
                </div>
                <h4 className={`text-sm font-medium ${badge.earned ? 'text-success-900' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <p className={`text-xs mt-1 ${badge.earned ? 'text-success-600' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                {badge.earned && (
                  <div className="mt-2">
                    <span className="text-xs bg-success-100 text-success-600 px-2 py-1 rounded-full">
                      ✓ Obtenida
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card bg-primary-50 border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-3">🏆 Ranking de Productividad</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🥇</span>
              <span className="text-sm font-medium text-primary-900">María García</span>
            </div>
            <span className="text-sm text-primary-600">2,450 pts</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🥈</span>
              <span className="text-sm font-medium text-primary-900">Carlos López</span>
            </div>
            <span className="text-sm text-primary-600">2,180 pts</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🥉</span>
              <span className="text-sm font-medium text-primary-900">Ana Martínez</span>
            </div>
            <span className="text-sm text-primary-600">1,950 pts</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">4.</span>
              <span className="text-sm font-medium text-primary-900">Tú</span>
            </div>
            <span className="text-sm text-primary-600">1,320 pts</span>
          </div>
        </div>
      </div>

      {/* Available Challenges Modal */}
      {showAvailableChallenges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Retos Disponibles</h2>
                <button
                  onClick={() => setShowAvailableChallenges(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {availableChallenges.map((challenge) => {
                  const getIcon = (type) => {
                    switch (type) {
                      case 'streak': return Clock
                      case 'quantity': return Target
                      case 'timing': return Calendar
                      default: return Trophy
                    }
                  }
                  const Icon = getIcon(challenge.type)
                  
                  return (
                    <div key={challenge.id} className="card">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Icon size={24} className="text-primary-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                              {getDifficultyText(challenge.difficulty)}
                            </span>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progreso: {challenge.progress}/{challenge.total}</span>
                              <span>{getProgressPercentage(challenge.progress, challenge.total)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getProgressPercentage(challenge.progress, challenge.total)}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-500">⏰ {challenge.timeLeft}</span>
                              <span className="text-gray-500">👥 {challenge.participants}</span>
                            </div>
                            <button
                              onClick={() => {
                                joinChallenge(challenge.id)
                                setShowAvailableChallenges(false)
                              }}
                              className="btn-primary text-xs px-3 py-1"
                            >
                              Unirse
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Challenges
