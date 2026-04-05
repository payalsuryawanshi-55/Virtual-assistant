// import React, { useContext, useEffect, useState, useRef } from 'react'
// import { userDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// // ✅ Remove these lines - no GIF imports
// // import thinkingGif from '../assets/thinking.gif'
// // import speakingGif from '../assets/speaking.gif'

// const Home = () => {
//   const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext)
//   const navigate = useNavigate()
//   const [latestAssistant, setLatestAssistant] = useState(null)
//   const [transcript, setTranscript] = useState("")
//   const [responseText, setResponseText] = useState("")
//   const [isListening, setIsListening] = useState(true)
//   const [isThinking, setIsThinking] = useState(false)
//   const [typingText, setTypingText] = useState("")
//   const [showGif, setShowGif] = useState(false)
//   const [gifType, setGifType] = useState("thinking")
//   const recognitionRef = useRef(null)
//   const shouldRestartRef = useRef(true)
//   const isSpeakingRef = useRef(false)
//   const typingIntervalRef = useRef(null)

//   // Typing effect function
//   const typeResponse = (text) => {
//     if (typingIntervalRef.current) {
//       clearInterval(typingIntervalRef.current)
//     }
    
//     setTypingText("")
//     let i = 0
    
//     const interval = setInterval(() => {
//       if (i < text.length) {
//         setTypingText(prev => prev + text[i])
//         i++
//       } else {
//         clearInterval(interval)
//         typingIntervalRef.current = null
//       }
//     }, 30)
    
//     typingIntervalRef.current = interval
//     return interval
//   }

//   // Speak function
//   const speak = (text) => {
//     window.speechSynthesis.cancel()
    
//     if (typingIntervalRef.current) {
//       clearInterval(typingIntervalRef.current)
//       typingIntervalRef.current = null
//     }
    
//     setShowGif(true)
//     setGifType("speaking")
    
//     if (recognitionRef.current && isListening) {
//       try {
//         recognitionRef.current.stop()
//         console.log("🔇 Recognition paused while speaking")
//         setIsListening(false)
//         isSpeakingRef.current = true
//       } catch (e) {
//         console.log("Stop error:", e)
//       }
//     }
    
//     const utterance = new SpeechSynthesisUtterance(text)
//     utterance.lang = 'en-US'
//     utterance.rate = 0.9
//     utterance.pitch = 1
    
//     utterance.onend = () => {
//       console.log("✅ Speech finished, restarting recognition")
//       isSpeakingRef.current = false
      
//       setTimeout(() => {
//         setShowGif(false)
//       }, 500)
      
//       if (shouldRestartRef.current && recognitionRef.current && latestAssistant) {
//         setTimeout(() => {
//           try {
//             recognitionRef.current.start()
//             setIsListening(true)
//             console.log("🎤 Recognition restarted")
//           } catch (e) {
//             console.log("Restart error:", e)
//           }
//         }, 500)
//       }
//     }
    
//     utterance.onerror = (e) => {
//       console.log("Speech error:", e)
//       isSpeakingRef.current = false
//       setShowGif(false)
//       if (shouldRestartRef.current && recognitionRef.current) {
//         setTimeout(() => {
//           try {
//             recognitionRef.current.start()
//             setIsListening(true)
//           } catch (e) {}
//         }, 500)
//       }
//     }
    
//     window.speechSynthesis.speak(utterance)
//     setResponseText(text)
//   }

//   // Action handler
//   const handleAction = (type, userInput, responseMessage) => {
//     console.log("🎬 Executing action:", type, userInput)
    
//     if (type === "instagram_open") {
//       window.open('https://www.instagram.com/', '_blank')
//     }
    
//     if (type === "facebook_open") {
//       window.open('https://www.facebook.com/', '_blank')
//     }
    
//     if (type === "google_search") {
//       let query = userInput?.replace(/search|google/gi, '').trim() || "search"
//       window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
//     }
    
//     if (type === "youtube_search" || type === "youtube_play") {
//       let query = userInput?.replace(/play|search|youtube|video/gi, '').trim() || "music"
//       window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank')
//     }
    
//     if (type === "weather-show") {
//       let location = userInput?.replace(/weather|show|in/gi, '').trim() || "your city"
//       window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(location)}`, '_blank')
//     }
    
//     if (type === "calculator_open") {
//       window.open('https://www.calculator.net/', '_blank')
//     }
//   }

//   // Handle response with typing animation
//   const handleResponse = async (command) => {
//     try {
//       setIsThinking(true)
//       setShowGif(true)
//       setGifType("thinking")
//       setResponseText("")
//       setTypingText("")
      
//       const response = await getGeminiResponse(command)
//       console.log("🤖 Assistant response:", response)
      
//       setIsThinking(false)
      
//       if (response.response) {
//         typeResponse(response.response)
        
//         const delay = Math.min(response.response.length * 30, 1500)
//         setTimeout(() => {
//           speak(response.response)
//         }, delay)
//       }
      
//       if (response.type && 
//           response.type !== "general" && 
//           response.type !== "get_date" && 
//           response.type !== "get_time" && 
//           response.type !== "get_day" && 
//           response.type !== "get_month") {
        
//         setTimeout(() => {
//           handleAction(response.type, response.userInput || command, response.response)
//         }, 1500)
//       }
      
//     } catch (error) {
//       console.error("Error:", error)
//       setIsThinking(false)
//       setShowGif(false)
//       speak("Sorry, I'm having trouble connecting.")
//     }
//   }

//   // Get latest assistant
//   useEffect(() => {
//     if (userData?.arrayOfAssistants && userData.arrayOfAssistants.length > 0) {
//       const latest = userData.arrayOfAssistants[userData.arrayOfAssistants.length - 1]
//       setLatestAssistant(latest)
//     } else {
//       setLatestAssistant(null)
//     }
//   }, [userData])

//   // Logout handler
//   const handleLogOut = async () => {
//     shouldRestartRef.current = false
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop()
//       } catch (e) {}
//     }
//     if (typingIntervalRef.current) {
//       clearInterval(typingIntervalRef.current)
//     }
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
//     } catch (error) {}
//     setUserData(null)
//     localStorage.removeItem('token')
//     localStorage.removeItem('userData')
//     navigate("/signin")
//   }

//   const handleDashboard = () => {
//     navigate('/dashboard')
//   }

//   // Speech Recognition Setup
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
//     if (!SpeechRecognition) {
//       console.log("Speech recognition not supported")
//       return
//     }

//     const recognition = new SpeechRecognition()
//     recognition.continuous = true
//     recognition.lang = 'en-US'
//     recognition.interimResults = true
//     recognition.maxAlternatives = 1

//     recognition.onstart = () => {
//       console.log("🎤 Speech recognition started")
//       setIsListening(true)
//     }

//     recognition.onend = () => {
//       console.log("🎤 Speech recognition ended")
//       setIsListening(false)
//       if (!isSpeakingRef.current && shouldRestartRef.current && latestAssistant) {
//         setTimeout(() => {
//           try {
//             recognition.start()
//             setIsListening(true)
//           } catch (e) {
//             console.log("Restart error:", e)
//           }
//         }, 500)
//       }
//     }

//     recognition.onresult = async (event) => {
//       if (isSpeakingRef.current) {
//         console.log("⏸️ Skipping - AI is speaking")
//         return
//       }
      
//       const result = event.results[event.results.length - 1]
      
//       if (result.isFinal) {
//         const heardText = result[0].transcript.trim()
//         console.log("👂 Heard:", heardText)
//         setTranscript(heardText)

//         if (latestAssistant?.assistantName) {
//           const wakeWord = latestAssistant.assistantName.toLowerCase()
//           const heardLower = heardText.toLowerCase()
          
//           if (heardLower.includes(wakeWord)) {
//             console.log(`✅ Wake word "${wakeWord}" detected!`)
            
//             let command = heardLower.replace(wakeWord, '').trim()
            
//             if (command) {
//               console.log("📝 Processing command:", command)
//               await handleResponse(command)
//             } else {
//               speak(`Yes? How can I help you?`)
//             }
//           }
//         }
//       }
//     }

//     recognition.onerror = (e) => {
//       console.log("❌ Speech recognition error:", e.error)
//       if (e.error === 'not-allowed') {
//         speak("Please allow microphone access.")
//       }
//       setIsListening(false)
//     }

//     recognitionRef.current = recognition
    
//     try {
//       recognition.start()
//     } catch (e) {
//       console.log("Start error:", e)
//     }

//     return () => {
//       shouldRestartRef.current = false
//       if (typingIntervalRef.current) {
//         clearInterval(typingIntervalRef.current)
//       }
//       if (recognitionRef.current) {
//         try {
//           recognitionRef.current.stop()
//         } catch (e) {}
//       }
//       window.speechSynthesis.cancel()
//     }
//   }, [latestAssistant])

//   const restartListening = () => {
//     if (recognitionRef.current && !isListening && !isSpeakingRef.current) {
//       try {
//         recognitionRef.current.start()
//         setIsListening(true)
//       } catch (e) {
//         console.log("Restart error:", e)
//       }
//     }
//   }

//   return (
//     <div className="h-screen w-full bg-gradient-to-t from-black to-[#020253] flex flex-col items-center justify-center overflow-hidden relative">
      
//       {/* Top Buttons */}
//       <div className="absolute top-5 right-5 flex gap-3 z-10">
//         <button 
//           onClick={handleDashboard}
//           className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition cursor-pointer backdrop-blur-sm"
//         >
//           📊 Dashboard
//         </button>
//         <button 
//           onClick={handleLogOut}
//           className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition cursor-pointer backdrop-blur-sm"
//         >
//           🚪 Logout
//         </button>
//       </div>
      
//       {/* Status Indicator */}
//       <div className="absolute top-5 left-5 z-10">
//         <div className={`px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-2 ${
//           isListening 
//             ? 'bg-green-500/20 text-green-400 border border-green-500' 
//             : isSpeakingRef.current 
//               ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
//               : isThinking
//               ? 'bg-purple-500/20 text-purple-400 border border-purple-500'
//               : 'bg-gray-500/20 text-gray-400'
//         }`}>
//           <div className={`w-2 h-2 rounded-full ${
//             isListening ? 'bg-green-400 animate-pulse' : 
//             isSpeakingRef.current ? 'bg-yellow-400' : 
//             isThinking ? 'bg-purple-400 animate-pulse' : 'bg-gray-400'
//           }`}></div>
//           {isListening ? '🎤 Listening...' : 
//            isSpeakingRef.current ? '🔊 Speaking...' : 
//            isThinking ? '🤔 Thinking...' : '🔇 Idle'}
//         </div>
//       </div>
      
//       {/* GIF Animation Section - Using Emojis */}
//       {showGif && (
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
//           <div className="animate-pulse">
//             {gifType === "thinking" ? (
//               <div className="text-center">
//                 <div className="text-8xl mb-2 animate-bounce">🤔</div>
//                 <p className="text-purple-400 text-sm font-semibold">Thinking...</p>
//               </div>
//             ) : (
//               <div className="text-center">
//                 <div className="text-8xl mb-2 animate-wave">🔊</div>
//                 <p className="text-yellow-400 text-sm font-semibold">Speaking...</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
      
//       {/* Assistant Image with Animation */}
//       <div className={`relative w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-2xl bg-white/10 backdrop-blur-sm transition-all duration-300 ${
//         isListening ? 'ring-4 ring-green-500/50 scale-105' : 
//         isSpeakingRef.current ? 'ring-4 ring-yellow-500/50' : 
//         isThinking ? 'ring-4 ring-purple-500/50' : ''
//       }`}>
//         {latestAssistant?.assistantImage && latestAssistant.assistantImage !== "" ? (
//           <img 
//             src={latestAssistant.assistantImage} 
//             alt="Assistant" 
//             className={`h-full w-full object-cover transition-all duration-500 ${
//               isSpeakingRef.current ? 'animate-pulse' : ''
//             }`}
//             onError={(e) => {
//               e.target.src = "https://via.placeholder.com/300x400?text=No+Image"
//             }}
//           />
//         ) : (
//           <div className="text-center">
//             <div className={`text-6xl mb-2 transition-all duration-300 ${
//               isSpeakingRef.current ? 'animate-bounce' : ''
//             }`}>🤖</div>
//             <p className="text-gray-400 text-sm">
//               {userData?.arrayOfAssistants?.length === 0 
//                 ? "No assistant created yet" 
//                 : "No image selected"}
//             </p>
//           </div>
//         )}
        
//         {/* Voice Wave Animation when speaking */}
//         {isSpeakingRef.current && (
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
//             <div className="w-1 h-3 bg-yellow-400 rounded-full animate-sound-wave" style={{ animationDelay: '0s' }}></div>
//             <div className="w-1 h-5 bg-yellow-400 rounded-full animate-sound-wave" style={{ animationDelay: '0.2s' }}></div>
//             <div className="w-1 h-4 bg-yellow-400 rounded-full animate-sound-wave" style={{ animationDelay: '0.4s' }}></div>
//             <div className="w-1 h-6 bg-yellow-400 rounded-full animate-sound-wave" style={{ animationDelay: '0.6s' }}></div>
//             <div className="w-1 h-3 bg-yellow-400 rounded-full animate-sound-wave" style={{ animationDelay: '0.8s' }}></div>
//           </div>
//         )}
        
//         {/* Thinking Dots when thinking */}
//         {isThinking && (
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
//             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
//             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//           </div>
//         )}
//       </div>
      
//       {/* Assistant Name */}
//       <h1 className='text-white text-2xl font-bold mt-6'>
//         {latestAssistant?.assistantName 
//           ? `I'm ${latestAssistant.assistantName}` 
//           : userData?.arrayOfAssistants?.length === 0 
//             ? "No Assistant" 
//             : "Your Assistant"}
//       </h1>
      
//       {/* Wake Word Instruction */}
//       {latestAssistant && (
//         <p className="text-gray-400 text-sm mt-2 text-center">
//           Say <span className="text-blue-400 font-semibold">"{latestAssistant.assistantName}"</span> to talk to me
//         </p>
//       )}
      
//       {/* Response Area */}
//       <div className="mt-6 w-full max-w-md px-4">
//         {/* Thinking Indicator */}
//         {isThinking && !typingText && (
//           <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl backdrop-blur-sm animate-pulse">
//             <p className="text-purple-300 text-sm font-semibold mb-1 flex items-center gap-2">
//               <span>🤔 Assistant is thinking</span>
//               <span className="flex gap-1">
//                 <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
//                 <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
//                 <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
//               </span>
//             </p>
//           </div>
//         )}
        
//         {/* Typing Animation with Cursor */}
//         {typingText && (
//           <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
//             <p className="text-blue-300 text-sm font-semibold mb-1">Assistant says:</p>
//             <p className="text-white text-base">
//               {typingText}
//               <span className="inline-block w-0.5 h-4 bg-white ml-0.5 animate-pulse"></span>
//             </p>
//           </div>
//         )}
        
//         {/* Original Response Text (fallback) */}
//         {responseText && !typingText && (
//           <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
//             <p className="text-blue-300 text-sm font-semibold mb-1">Assistant says:</p>
//             <p className="text-white text-base">{responseText}</p>
//           </div>
//         )}
        
//         {/* Transcript Display */}
//         {transcript && (
//           <div className="mb-4 p-4 bg-gray-500/10 border border-gray-500/30 rounded-2xl backdrop-blur-sm">
//             <p className="text-gray-400 text-sm font-semibold mb-1">You said:</p>
//             <p className="text-white text-base">{transcript}</p>
//           </div>
//         )}
        
//         {/* Listening Animation */}
//         <div className="flex justify-center mt-4">
//           {isListening && (
//             <div className="flex gap-1">
//               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
//               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Restart Button */}
//       {!isListening && !isSpeakingRef.current && !isThinking && latestAssistant && (
//         <button
//           onClick={restartListening}
//           className="mt-4 px-4 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm hover:bg-blue-500/30 transition cursor-pointer"
//         >
//           🔄 Restart Listening
//         </button>
//       )}
      
//       {/* Create Assistant Button */}
//       {!latestAssistant && (
//         <button
//           onClick={() => navigate('/customize')}
//           className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
//         >
//           ✨ Create Your Assistant
//         </button>
//       )}

//       {/* Add CSS Animations */}
//       <style jsx>{`
//         @keyframes sound-wave {
//           0%, 100% { height: 3px; }
//           50% { height: 12px; }
//         }
//         .animate-sound-wave {
//           animation: sound-wave 0.5s ease-in-out infinite;
//         }
//         @keyframes wave {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.2); }
//         }
//         .animate-wave {
//           animation: wave 0.5s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Home




import React, { useContext, useEffect, useState, useRef } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const { userData, setUserData, serverUrl, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [latestAssistant, setLatestAssistant] = useState(null)
  const [transcript, setTranscript] = useState("")
  const [responseText, setResponseText] = useState("")
  const [isListening, setIsListening] = useState(true)
  const [isThinking, setIsThinking] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const shouldRestartRef = useRef(true)
  const isSpeakingRef = useRef(false)

  const speak = (text) => {
    window.speechSynthesis.cancel()
    setIsSpeaking(true)
    isSpeakingRef.current = true
    
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
      } catch (e) {}
    }
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    
    utterance.onend = () => {
      setIsSpeaking(false)
      isSpeakingRef.current = false
      
      if (shouldRestartRef.current && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start()
            setIsListening(true)
          } catch (e) {}
        }, 500)
      }
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
      isSpeakingRef.current = false
    }
    
    window.speechSynthesis.speak(utterance)
    setResponseText(text)
  }

  const handleAction = (type, userInput) => {
    if (type === "instagram_open") {
      window.open('https://www.instagram.com/', '_blank')
    } else if (type === "facebook_open") {
      window.open('https://www.facebook.com/', '_blank')
    } else if (type === "google_search") {
      let query = userInput?.replace(/search|google/gi, '').trim() || "search"
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
    } else if (type === "youtube_search" || type === "youtube_play") {
      let query = userInput?.replace(/play|search|youtube/gi, '').trim() || "music"
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank')
    } else if (type === "weather-show") {
      let location = userInput?.replace(/weather|show|in/gi, '').trim() || "your city"
      window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(location)}`, '_blank')
    } else if (type === "calculator_open") {
      window.open('https://www.calculator.net/', '_blank')
    }
  }

  const handleResponse = async (command) => {
    try {
      console.log("🚀 Sending command to assistant:", command);
      setIsThinking(true)
      setResponseText("")
      
      const response = await getGeminiResponse(command)
      console.log("🤖 Assistant response:", response)
      
      setIsThinking(false)
      
      if (response.response) {
        speak(response.response)
      } else {
        speak("I didn't understand that. Can you please repeat?")
      }
      
      if (response.type && !["general", "get_date", "get_time", "get_day", "get_month"].includes(response.type)) {
        setTimeout(() => {
          handleAction(response.type, response.userInput || command)
        }, 1000)
      }
      
    } catch (error) {
      console.error("Error in handleResponse:", error)
      setIsThinking(false)
      speak("Sorry, I'm having trouble connecting.")
    }
  }

  useEffect(() => {
    if (userData?.arrayOfAssistants && userData.arrayOfAssistants.length > 0) {
      const latest = userData.arrayOfAssistants[userData.arrayOfAssistants.length - 1]
      setLatestAssistant(latest)
      console.log("✅ Latest assistant loaded:", latest.assistantName);
    } else {
      console.log("⚠️ No assistants found for this user");
      setLatestAssistant(null)
    }
  }, [userData])

  const handleLogOut = async () => {
    shouldRestartRef.current = false
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
    }
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
    } catch (error) {}
    setUserData(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    navigate("/signin")
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.log("Speech recognition not supported")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = true

    recognition.onstart = () => {
      console.log("🎤 Listening...")
      setIsListening(true)
    }

    recognition.onend = () => {
      console.log("🎤 Stopped listening")
      setIsListening(false)
      if (!isSpeakingRef.current && shouldRestartRef.current && latestAssistant) {
        setTimeout(() => {
          try {
            recognition.start()
            setIsListening(true)
          } catch (e) {}
        }, 500)
      }
    }

    recognition.onresult = async (event) => {
      if (isSpeakingRef.current) return
      
      const result = event.results[event.results.length - 1]
      
      if (result.isFinal) {
        const heardText = result[0].transcript.trim()
        console.log("👂 Heard:", heardText)
        setTranscript(heardText)

        if (!latestAssistant) {
          console.log("❌ No assistant created.");
          speak("Please create an assistant first.");
          return;
        }

        const wakeWord = latestAssistant.assistantName.toLowerCase()
        const heardLower = heardText.toLowerCase()
        
        console.log(`🔍 Wake word: "${wakeWord}"`);
        console.log(`🔍 Heard text: "${heardLower}"`);
        
        if (heardLower.includes(wakeWord)) {
          console.log(`✅ Wake word "${wakeWord}" detected!`)
          
          // Extract command after wake word
          let command = heardLower;
          
          // Find position of wake word
          const wakeIndex = command.indexOf(wakeWord);
          if (wakeIndex !== -1) {
            command = command.substring(wakeIndex + wakeWord.length);
          }
          
          // Clean up the command
          command = command
            .replace(/^hey\s*/i, '')
            .replace(/^,\s*/, '')
            .replace(/,/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          console.log(`📝 Cleaned command: "${command}"`)
          
          if (command && command.length > 0) {
            await handleResponse(command)
          } else {
            speak(`Yes? How can I help you?`)
          }
        } else {
          console.log(`⏸️ Ignoring - wake word "${wakeWord}" not detected`);
        }
      }
    }

    recognition.onerror = (e) => {
      console.log("❌ Error:", e.error)
      setIsListening(false)
    }

    recognitionRef.current = recognition
    
    try {
      recognition.start()
    } catch (e) {
      console.log("Start error:", e)
    }

    return () => {
      shouldRestartRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
      window.speechSynthesis.cancel()
    }
  }, [latestAssistant])

  return (
    <div className="h-screen w-full bg-gradient-to-t from-black to-[#020253] flex flex-col items-center justify-center">
      
      <div className="absolute top-5 right-5 flex gap-3">
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
        >
          Dashboard
        </button>
        <button 
          onClick={handleLogOut}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>
      
      <div className="absolute top-5 left-5">
        <div className={`px-3 py-1 rounded-full text-sm ${
          isListening ? 'bg-green-500/20 text-green-400' : 
          isSpeaking ? 'bg-yellow-500/20 text-yellow-400' :
          isThinking ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {isListening ? '🎤 Listening...' : 
           isSpeaking ? '🔊 Speaking...' : 
           isThinking ? '🤔 Thinking...' : 'Idle'}
        </div>
      </div>
      
      <div className={`w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm transition-all ${
        isListening ? 'ring-2 ring-green-500' : 
        isSpeaking ? 'ring-2 ring-yellow-500' : 
        isThinking ? 'ring-2 ring-purple-500' : ''
      }`}>
        {latestAssistant?.assistantImage ? (
          <img 
            src={latestAssistant.assistantImage} 
            alt="Assistant" 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-6xl">
            🤖
          </div>
        )}
      </div>
      
      <h1 className='text-white text-2xl font-bold mt-6'>
        {latestAssistant?.assistantName || "No Assistant Created"}
      </h1>
      
      {latestAssistant && (
        <p className="text-gray-400 text-sm mt-2">
          Say <span className="text-blue-400 font-bold">"{latestAssistant.assistantName}"</span> then your command
        </p>
      )}
      
      {(responseText || isThinking) && (
        <div className="mt-6 w-full max-w-md px-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
            <p className="text-blue-300 text-sm font-semibold mb-1">
              {isThinking ? '🤔 Thinking...' : 'Assistant says:'}
            </p>
            {!isThinking && (
              <p className="text-white text-base">{responseText}</p>
            )}
          </div>
        </div>
      )}
      
      {transcript && !isThinking && (
        <div className="mt-4 w-full max-w-md px-4">
          <div className="p-4 bg-gray-500/10 border border-gray-500/30 rounded-2xl">
            <p className="text-gray-400 text-sm font-semibold mb-1">You said:</p>
            <p className="text-white text-base">{transcript}</p>
          </div>
        </div>
      )}
      
      {!latestAssistant && (
        <button
          onClick={() => navigate('/customize')}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Create Your Assistant
        </button>
      )}
    </div>
  )
}

export default Home