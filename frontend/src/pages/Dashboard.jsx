import React, { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaRobot, FaTrashAlt, FaComments, FaPlus, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'

const Dashboard = () => {
  const { serverUrl, userData, setUserData } = useContext(userDataContext)
  const [assistants, setAssistants] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAssistants()
  }, [])

  const fetchAssistants = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/signin')
        return
      }

      const response = await axios.get(`${serverUrl}/api/user/assistants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setAssistants(response.data.assistants || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching assistants:", error)
      setLoading(false)
    }
  }

  const deleteAssistant = async (assistantId) => {
    if (!confirm("Are you sure you want to delete this assistant? This action cannot be undone!")) return

    setDeletingId(assistantId)
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${serverUrl}/api/user/assistant/${assistantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Show success message
      alert("✅ Assistant deleted successfully!")
      fetchAssistants()
    } catch (error) {
      console.error("Error deleting assistant:", error)
      alert("❌ Error deleting assistant. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  const createNewAssistant = () => {
    navigate('/customize')
  }

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      } catch (error) {
        console.log("Logout error:", error)
      }
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      setUserData(null)
      navigate('/signin')
    }
  }

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-[#020253] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded-lg w-1/3 mb-4"></div>
            <div className="h-6 bg-white/10 rounded-lg w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 rounded-2xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-[#020253] to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <MdDashboard className="text-blue-400 text-3xl" />
              <h1 className="text-white text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaUserCircle className="text-blue-400" />
              <p className="text-lg">
                Welcome back, <span className="text-blue-400 font-semibold">{userData?.name || 'User'}</span>!
              </p>
            </div>
            <p className="text-gray-400 mt-1 text-sm">
              Manage your virtual assistants and create new ones
            </p>
          </div>
          
          <div className="flex gap-3 animate-slideIn">
            <button
              onClick={createNewAssistant}
              className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 
                text-white font-semibold rounded-full transition-all duration-300 
                hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105
                flex items-center gap-2 overflow-hidden"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Create New Assistant</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            </button>
            
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 
                text-red-400 font-semibold rounded-full transition-all duration-300 
                hover:shadow-lg hover:shadow-red-500/20 flex items-center gap-2
                border border-red-500/30 hover:border-red-500/60"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Assistants</p>
                <p className="text-white text-3xl font-bold">{assistants.length}</p>
              </div>
              <FaRobot className="text-blue-400 text-4xl opacity-50" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white text-sm font-medium truncate">{userData?.email}</p>
              </div>
              <FaUserCircle className="text-purple-400 text-4xl opacity-50" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="text-white text-sm font-medium">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="text-green-400 text-2xl">🎉</div>
            </div>
          </div>
        </div>

        {/* Assistants Section */}
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
            <FaRobot className="text-blue-400" />
            Your Assistants
            <span className="text-sm text-gray-400 font-normal">({assistants.length})</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Click on any assistant to start chatting
          </p>
        </div>

        {assistants.length === 0 ? (
          // Empty State
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 animate-fadeIn">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-white text-xl font-semibold mb-2">No Assistants Created Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first virtual assistant to get started with voice commands and AI conversations
            </p>
            <button
              onClick={createNewAssistant}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/30 
                transition-all duration-300 hover:scale-105"
            >
              <FaPlus />
              Create Your First Assistant
            </button>
          </div>
        ) : (
          // Assistants Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assistants.map((assistant, index) => (
              <div
                key={assistant._id}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden 
                  border border-white/10 hover:border-blue-500/50 transition-all duration-500 
                  hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20
                  animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  {assistant.assistantImage && assistant.assistantImage !== "" ? (
                    <>
                      <img
                        src={assistant.assistantImage}
                        alt={assistant.assistantName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 
                      flex items-center justify-center">
                      <FaRobot className="text-white text-6xl opacity-50" />
                    </div>
                  )}
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteAssistant(assistant._id)}
                    disabled={deletingId === assistant._id}
                    className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-600 
                      rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed z-10
                      backdrop-blur-sm border border-red-400"
                  >
                    {deletingId === assistant._id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaTrashAlt className="text-white text-sm" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white text-xl font-bold mb-1 truncate group-hover:text-blue-400 transition-colors">
                    {assistant.assistantName}
                  </h3>
                  <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                    <span>📅 Created:</span>
                    {new Date(assistant.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  
                 
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Virtual Assistant | Powered by Gemini AI
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Dashboard





