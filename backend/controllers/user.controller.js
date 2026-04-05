// import geminiResponse from "../gemini.js";
// import User from "../models/user.model.js";
// import moment from "moment";

// export const getCurrentUser = async (req, res) => {
//     try {
//         const userId = req.userId;

//         if (!userId) {
//             return res.status(400).json({ message: "User ID not found" });
//         }

//         const user = await User.findById(userId).select("-password");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         return res.status(200).json(user);

//     } catch (error) {
//         console.log("Get current user error:", error);
//         return res.status(500).json({ message: "Error fetching user details" });
//     }
// };

// export const updateAssistant = async (req, res) => {
//     try {
//         const { assistantName } = req.body;
//         const userId = req.userId;

//         if (!userId) {
//             return res.status(400).json({ message: "User ID not found" });
//         }

//         if (!assistantName || assistantName.trim() === "") {
//             return res.status(400).json({ message: "Assistant name is required" });
//         }

//         let assistantImage = "";

//         if (req.file) {
//             const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
//             assistantImage = `${baseUrl}/uploads/${req.file.filename}`;
//             console.log("✅ Local image saved:", assistantImage);
//         } else {
//             return res.status(400).json({ message: "Image is required" });
//         }

//         const newAssistant = {
//             assistantName: assistantName.trim(),
//             assistantImage: assistantImage,
//             createdAt: new Date()
//         };

//         const user = await User.findByIdAndUpdate(
//             userId,
//             {
//                 $push: { arrayOfAssistants: newAssistant }
//             },
//             { new: true, runValidators: true }
//         ).select("-password");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         return res.status(200).json({
//             message: "Assistant created successfully",
//             user: user,
//             assistant: newAssistant
//         });
  
//     } catch (error) {
//         console.log("Update assistant error:", error);
//         return res.status(500).json({ message: "Error updating assistant: " + error.message });
//     }
// };

// export const getAssistants = async (req, res) => {
//     try {
//         const userId = req.userId;
        
//         const user = await User.findById(userId).select("arrayOfAssistants");
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
        
//         return res.status(200).json({
//             success: true,
//             assistants: user.arrayOfAssistants
//         });
        
//     } catch (error) {
//         console.log("Get assistants error:", error);
//         return res.status(500).json({ message: "Error fetching assistants" });
//     }
// };

// export const getAssistantById = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const { assistantId } = req.params;
        
//         const user = await User.findById(userId);
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
        
//         const assistant = user.arrayOfAssistants.id(assistantId);
        
//         if (!assistant) {
//             return res.status(404).json({ message: "Assistant not found" });
//         }
        
//         return res.status(200).json({
//             success: true,
//             assistant: assistant
//         });
        
//     } catch (error) {
//         console.log("Get assistant error:", error);
//         return res.status(500).json({ message: "Error fetching assistant" });
//     }
// };

// export const deleteAssistant = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const { assistantId } = req.params;
        
//         const user = await User.findByIdAndUpdate(
//             userId,
//             {
//                 $pull: { arrayOfAssistants: { _id: assistantId } }
//             },
//             { new: true }
//         ).select("-password");
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
        
//         return res.status(200).json({
//             success: true,
//             message: "Assistant deleted successfully",
//             user: user
//         });
        
//     } catch (error) {
//         console.log("Delete assistant error:", error);
//         return res.status(500).json({ message: "Error deleting assistant" });
//     }
// };

// export const askToAssistant = async (req, res) => {
//     try {
//         const { command } = req.body;
        
//         if (!command) {
//             return res.status(400).json({ response: "No command provided" });
//         }
        
//         const user = await User.findById(req.userId);
        
//         if (!user) {
//             return res.status(404).json({ response: "User not found" });
//         }
        
//         // ✅ Get latest assistant from array
//         let assistantName = "Jarvis";
//         if (user.arrayOfAssistants && user.arrayOfAssistants.length > 0) {
//             const latestAssistant = user.arrayOfAssistants[user.arrayOfAssistants.length - 1];
//             assistantName = latestAssistant.assistantName;
//         }
        
//         const userName = user.name;
        
//         // ✅ geminiResponse returns object, not string
//         const result = await geminiResponse(command, userName, assistantName);
        
//         if (!result.success) {
//             return res.status(400).json({ response: "Sorry, I can't understand that" });
//         }
        
//         // ✅ Directly use result.data
//         const gemResult = result.data;
//         const type = gemResult.type;
        
//         switch(type) {
//             case "get_date":
//                 return res.json({
//                     type,
//                     userInput: gemResult.userinput,
//                     response: `Current date is ${moment().format("YYYY-MM-DD")}`
//                 });
                
//             case "get_time":
//                 return res.json({
//                     type,
//                     userInput: gemResult.userinput,
//                     response: `Current time is ${moment().format("hh:mm A")}`
//                 });
                
//             case "get_day":
//                 return res.json({
//                     type,
//                     userInput: gemResult.userinput,
//                     response: `Today is ${moment().format("dddd")}`
//                 });
                
//             case "get_month":
//                 return res.json({
//                     type,
//                     userInput: gemResult.userinput,
//                     response: `Current month is ${moment().format("MMMM")}`
//                 });
                
//             case "google_search":
//             case "youtube_search":
//             case "youtube_play":
//             case "general":
//             case "calculator_open":
//             case "instagram_open":
//             case "facebook_open":
//             case "weather-show":
//                 return res.json({
//                     type,
//                     userInput: gemResult.userinput,
//                     response: gemResult.response
//                 });
                
//             default:
//                 return res.status(400).json({ response: "I didn't understand that command." });
//         }
        
//     } catch(error) {
//         console.error("Ask to assistant error:", error);
//         return res.status(500).json({ response: "Error processing your request" });
//     }
// };


import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.log("Get current user error:", error);
        return res.status(500).json({ message: "Error fetching user details" });
    }
};

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found" });
        }

        if (!assistantName || assistantName.trim() === "") {
            return res.status(400).json({ message: "Assistant name is required" });
        }

        let assistantImage = "";

        if (req.file) {
            const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
            assistantImage = `${baseUrl}/uploads/${req.file.filename}`;
            console.log("✅ Local image saved:", assistantImage);
        } else {
            return res.status(400).json({ message: "Image is required" });
        }

        const newAssistant = {
            assistantName: assistantName.trim(),
            assistantImage: assistantImage,
            createdAt: new Date()
        };

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $push: { arrayOfAssistants: newAssistant }
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Assistant created successfully",
            user: user,
            assistant: newAssistant
        });
  
    } catch (error) {
        console.log("Update assistant error:", error);
        return res.status(500).json({ message: "Error updating assistant: " + error.message });
    }
};

export const getAssistants = async (req, res) => {
    try {
        const userId = req.userId;
        
        const user = await User.findById(userId).select("arrayOfAssistants");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({
            success: true,
            assistants: user.arrayOfAssistants
        });
        
    } catch (error) {
        console.log("Get assistants error:", error);
        return res.status(500).json({ message: "Error fetching assistants" });
    }
};

export const getAssistantById = async (req, res) => {
    try {
        const userId = req.userId;
        const { assistantId } = req.params;
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const assistant = user.arrayOfAssistants.id(assistantId);
        
        if (!assistant) {
            return res.status(404).json({ message: "Assistant not found" });
        }
        
        return res.status(200).json({
            success: true,
            assistant: assistant
        });
        
    } catch (error) {
        console.log("Get assistant error:", error);
        return res.status(500).json({ message: "Error fetching assistant" });
    }
};

export const deleteAssistant = async (req, res) => {
    try {
        const userId = req.userId;
        const { assistantId } = req.params;
        
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { arrayOfAssistants: { _id: assistantId } }
            },
            { new: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({
            success: true,
            message: "Assistant deleted successfully",
            user: user
        });
        
    } catch (error) {
        console.log("Delete assistant error:", error);
        return res.status(500).json({ message: "Error deleting assistant" });
    }
};

export const askToAssistant = async (req, res) => {
    try {
        console.log("📥 Full request body:", req.body);
        
        let { command } = req.body;
        
        // Clean the command - remove commas, extra spaces, etc.
        if (command) {
            command = command
                .replace(/,/g, '')
                .replace(/^\s+/, '')
                .replace(/\s+$/, '')
                .replace(/\s+/g, ' ')
                .trim();
        }
        
        console.log("📝 Cleaned command:", command);
        
        if (!command || command.length === 0) {
            return res.status(400).json({ response: "No command provided" });
        }
        
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ response: "User not found" });
        }
        
        let assistantName = "Jarvis";
        if (user.arrayOfAssistants && user.arrayOfAssistants.length > 0) {
            const latestAssistant = user.arrayOfAssistants[user.arrayOfAssistants.length - 1];
            assistantName = latestAssistant.assistantName;
        }
        
        const userName = user.name;
        
        console.log("Calling geminiResponse with:", { command, userName, assistantName });
        
        const result = await geminiResponse(command, assistantName, userName);
        
        console.log("Gemini result success:", result.success);
        
        if (!result.success) {
            return res.status(400).json({ response: "Sorry, I can't understand that" });
        }
        
        const gemResult = result.data;
        const type = gemResult.type;
        
        switch(type) {
            case "get_date":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current date is ${moment().format("YYYY-MM-DD")}`
                });
                
            case "get_time":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current time is ${moment().format("hh:mm A")}`
                });
                
            case "get_day":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format("dddd")}`
                });
                
            case "get_month":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format("MMMM")}`
                });
                
            case "google_search":
            case "youtube_search":
            case "youtube_play":
            case "general":
            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
            case "weather-show":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response
                });
                
            default:
                return res.json({
                    type: "general",
                    userInput: command,
                    response: gemResult.response || "I didn't understand that command."
                });
        }
        
    } catch(error) {
        console.error("❌ Ask to assistant error:", error);
        return res.status(500).json({ response: "Error processing your request" });
    }
};