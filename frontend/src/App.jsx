import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import Customize2 from './pages/Customize2'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'


const App = () => {
  const { userData, loading } = useContext(userDataContext)
  const token = localStorage.getItem('token')
  
  if (loading) {
    return (
      <div className="h-screen w-full bg-gradient-to-t from-black to-[#020253] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }
  
  const isAuthenticated = token && userData

  return (
    <Routes>
      {/* Home - Directly show if authenticated */}
      <Route 
        path='/' 
        element={
          isAuthenticated ? 
          <Home /> : 
          <Navigate to="/signin" />
        } 
      />
      
      {/* Dashboard */}
      <Route 
        path='/dashboard' 
        element={
          isAuthenticated ? 
          <Dashboard /> : 
          <Navigate to="/signin" />
        } 
      />
      
      {/* Customize2 - Name Entry */}
      <Route 
        path='/customize2' 
        element={
          isAuthenticated ? 
          <Customize2 /> : 
          <Navigate to="/signin" />
        } 
      />
      
      {/* Customize - Image Selection */}
      <Route 
        path='/customize' 
        element={
          isAuthenticated ? 
          <Customize /> : 
          <Navigate to="/signin" />
        } 
      />
      
      {/* Auth Routes */}
      <Route 
        path="/signup" 
        element={
          !isAuthenticated ? 
          <SignUp /> : 
          <Navigate to="/" />
        } 
      />
      
      <Route 
        path="/signin" 
        element={
          !isAuthenticated ? 
          <SignIn /> : 
          <Navigate to="/" />
        } 
      />
    </Routes>
  )
}

export default App