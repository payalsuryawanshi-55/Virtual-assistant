// import React, { useContext, useState } from 'react'
// import { userDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'
// import { MdKeyboardBackspace } from "react-icons/md";
// import axios from 'axios';

// const Customize2 = () => {
//   const { 
//     userData, 
//     setUserData, 
//     serverUrl,
//     selectedImage,
//     frontendImage,
//     backendImage
//   } = useContext(userDataContext);
  
//   const [assistantName, setAssistantName] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const navigate = useNavigate()

//   const handleCreateAssistant = async () => {
//     if (!assistantName.trim()) {
//       alert("Please enter your assistant's name!")
//       return
//     }
    
//     if (!selectedImage && !frontendImage && !backendImage) {
//       alert("Please select an image first!")
//       navigate('/customize')
//       return
//     }
    
//     console.log("=== Creating Assistant ===")
//     console.log("Name:", assistantName)
    
//     setIsLoading(true);

//     try {
//       let formData = new FormData()
//       formData.append("assistantName", assistantName)
      
//       // Check if we have a backendImage (uploaded file) or need to fetch from URL
//       let imageFile = null;
      
//       if (backendImage) {
//         // Use the existing file from upload
//         imageFile = backendImage;
//         formData.append("assistantImage", imageFile)
//         console.log("Using uploaded file")
//       } else if (selectedImage) {
//         // Fetch gallery image and convert to file
//         console.log("Fetching gallery image:", selectedImage)
//         const response = await fetch(selectedImage)
//         const blob = await response.blob()
//         imageFile = new File([blob], `assistant_${Date.now()}.jpg`, { type: "image/jpeg" })
//         formData.append("assistantImage", imageFile)
//         console.log("Uploading gallery image as file")
//       } else {
//         alert("Please select a valid image")
//         setIsLoading(false)
//         return
//       }
      
//       const token = localStorage.getItem('token')
      
//       const result = await axios.post(`${serverUrl}/api/user/upload`, formData, {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         }
//       })

//       console.log("API Response:", result.data)
      
//       if (result.data.user) {
//         setUserData(result.data.user)
//         localStorage.setItem('userData', JSON.stringify(result.data.user))
//       }
      
//       alert("Assistant created successfully!")
//       navigate('/')
      
//     } catch(error) {
//       console.log("Error:", error)
//       alert(error.response?.data?.message || "Error creating assistant")
//     } finally {
//       setIsLoading(false)
//     }
//   };
  
//   return (
//     <div className="h-screen w-full bg-gradient-to-t from-black to-[#020253] flex flex-col items-center justify-center overflow-hidden relative">
//       <MdKeyboardBackspace 
//         className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' 
//         onClick={() => navigate("/customize")}
//       />
      
//       <h1 className="text-white mb-[40px] text-[30px] text-center">
//        Enter Your <span className="text-blue-400"> Assistant Name</span>
//       </h1>
      
//       <input
//         type="text"
//         placeholder="eg: Jarvis, Alexa, etc."
//         className="w-full max-w-lg h-14 outline-none border-2 border-white bg-transparent 
//           text-white placeholder-gray-300 px-5 rounded-full text-lg text-center"
//         onChange={(e) => setAssistantName(e.target.value)} 
//         value={assistantName}
//         autoFocus
//       />
      
//       {assistantName && (
//         <button 
//           className="min-w-[300px] h-[60px] mt-[30px] 
//             text-black font-semibold cursor-pointer bg-white 
//             rounded-full text-[19px] hover:bg-gray-200 transition disabled:opacity-50"
//           onClick={handleCreateAssistant}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Creating...' : ' Finally Create Your Assistant →'}
//         </button>
//       )}
//     </div>
//   )
// }

// export default Customize2;



import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
import axios from 'axios';

const Customize2 = () => {
  const { 
    userData, 
    setUserData, 
    serverUrl,
    selectedImage,
    frontendImage,
    backendImage
  } = useContext(userDataContext);
  
  const [assistantName, setAssistantName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleCreateAssistant = async () => {
    // Validation
    if (!assistantName.trim()) {
      setError("Please enter your assistant's name!")
      return
    }
    
    if (assistantName.length < 2) {
      setError("Assistant name must be at least 2 characters!")
      return
    }
    
    if (!selectedImage && !frontendImage && !backendImage) {
      setError("Please select an image first!")
      setTimeout(() => navigate('/customize'), 1500)
      return
    }
    
    setError("")
    setIsLoading(true);

    try {
      let formData = new FormData()
      formData.append("assistantName", assistantName.trim())
      
      let imageFile = null;
      
      if (backendImage) {
        imageFile = backendImage;
        formData.append("assistantImage", imageFile)
        console.log("Using uploaded file")
      } else if (selectedImage) {
        console.log("Fetching gallery image:", selectedImage)
        const response = await fetch(selectedImage)
        const blob = await response.blob()
        imageFile = new File([blob], `assistant_${Date.now()}.jpg`, { type: "image/jpeg" })
        formData.append("assistantImage", imageFile)
        console.log("Uploading gallery image as file")
      } else {
        setError("Please select a valid image")
        setIsLoading(false)
        return
      }
      
      const token = localStorage.getItem('token')
      
      const result = await axios.post(`${serverUrl}/api/user/upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000 // 30 second timeout
      })

      console.log("API Response:", result.data)
      
      if (result.data.user) {
        setUserData(result.data.user)
        localStorage.setItem('userData', JSON.stringify(result.data.user))
      }
      
      // Success message
      alert(`✨ Assistant "${assistantName}" created successfully!`)
      navigate('/')
      
    } catch(error) {
      console.log("Error:", error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.code === 'ECONNABORTED') {
        setError("Request timeout. Please check your internet connection.")
      } else {
        setError("Error creating assistant. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  };
  
  return (
    <div className="h-screen w-full bg-gradient-to-t from-black to-[#020253] flex flex-col items-center justify-center overflow-hidden relative">
      <MdKeyboardBackspace 
        className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px] hover:text-blue-400 transition' 
        onClick={() => navigate("/customize")}
      />
      
      <h1 className="text-white mb-[40px] text-[30px] text-center">
       Enter Your <span className="text-blue-400"> Assistant Name</span>
      </h1>
      
      <input
        type="text"
        placeholder="eg: Jarvis, Alexa, etc."
        className="w-full max-w-lg h-14 outline-none border-2 border-white bg-transparent 
          text-white placeholder-gray-300 px-5 rounded-full text-lg text-center
          focus:border-blue-400 transition duration-300"
        onChange={(e) => {
          setAssistantName(e.target.value)
          if (error) setError("")
        }} 
        value={assistantName}
        autoFocus
        disabled={isLoading}
      />
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center max-w-lg">
          ⚠️ {error}
        </div>
      )}
      
      {/* Character Count */}
      {assistantName && (
        <p className="text-gray-500 text-xs mt-2">
          {assistantName.length} characters
        </p>
      )}
      
      {assistantName && (
        <button 
          className={`min-w-[300px] h-[60px] mt-[30px] 
            text-black font-semibold cursor-pointer bg-white 
            rounded-full text-[19px] hover:bg-gray-200 transition 
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2`}
          onClick={handleCreateAssistant}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Creating...
            </>
          ) : (
            '✨ Finally Create Your Assistant →'
          )}
        </button>
      )}
      
      {/* Preview Section */}
      {frontendImage && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-gray-400 text-xs mb-2">Selected Image Preview</p>
          <img 
            src={frontendImage} 
            alt="Preview" 
            className="w-16 h-16 rounded-lg object-cover border-2 border-blue-400"
          />
        </div>
      )}
    </div>
  )
}

export default Customize2