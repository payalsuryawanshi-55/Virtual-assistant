import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'  

export const userDataContext = createContext()

const UserContext = ({ children }) => {
    const serverUrl = "http://localhost:8000"
    const [userData, setUserData] = useState(null)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [loading, setLoading] = useState(true) 

    const handleCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token')
            
            if (!token) {
                setLoading(false)
                return
            }
            
            const result = await axios.get(`${serverUrl}/api/user/current`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            setUserData(result.data)
            console.log("Current user loaded:", result.data)
        } catch (error) {
            console.log("Error fetching current user:", error)
        
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('userData')
                setUserData(null)
            }
        } finally {
            setLoading(false)
        }
    }

    const getGeminiResponse = async (command) => {
        try {
            const token = localStorage.getItem('token')
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, 
                { command }, 
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            return result.data
        } catch(error) {
            console.error("Error getting assistant response:", error)
            return { response: "Sorry, I'm having trouble connecting right now." }
        }
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('userData')
        const token = localStorage.getItem('token')
        
        if (storedUser && token) {
            setUserData(JSON.parse(storedUser))
            setLoading(false)
        } else {
            handleCurrentUser()
        }
    }, [])

    const updateUserData = (data) => {
        setUserData(data)
        if (data) {
            localStorage.setItem('userData', JSON.stringify(data))
        }
    }

    const clearUserData = () => {
        setUserData(null)
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
    }

    const value = {
        serverUrl,
        userData,
        setUserData: updateUserData, 
        clearUserData,  
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        loading,
        getGeminiResponse 
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext