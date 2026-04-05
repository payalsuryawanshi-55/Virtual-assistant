import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import path from "path";
import { fileURLToPath } from 'url';
import geminiResponse from "./gemini.js";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ List all available Gemini models (for debugging)
app.get("/api/list-models", async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(400).json({ 
                success: false,
                error: "GEMINI_API_KEY not found in .env file" 
            });
        }
        
        console.log("Fetching available models...");
        
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        
        // Filter only models that support generateContent
        const models = response.data.models?.filter(model => 
            model.supportedGenerationMethods?.includes('generateContent')
        ) || [];
        
        res.json({ 
            success: true, 
            allModels: response.data.models,
            supportedModels: models,
            message: "Models that support generateContent are listed in supportedModels"
        });
        
    } catch (error) {
        console.error("Error listing models:", error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data || error.message,
            hint: "Your API key might be invalid. Get a new one from: https://aistudio.google.com/app/apikey"
        });
    }
});

// ✅ Gemini Route with Assistant Name and User Name Support
app.get("/api/gemini", async (req, res) => {
    try {
        let prompt = req.query.prompt;
        let assistantName = req.query.assistantName || "Jarvis";
        let userName = req.query.userName || "User";
        
        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                message: "Prompt is required" 
            });
        }
        
        console.log("=" .repeat(50));
        console.log(`Assistant: ${assistantName} | User: ${userName}`);
        console.log(`Prompt: ${prompt}`);
        console.log("=" .repeat(50));
        
        let data = await geminiResponse(prompt, assistantName, userName);
        res.json(data);
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ✅ Alternative POST route for larger prompts
app.post("/api/gemini", async (req, res) => {
    try {
        let { prompt, assistantName, userName } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                message: "Prompt is required" 
            });
        }
        
        assistantName = assistantName || "Jarvis";
        userName = userName || "User";
        
        console.log("=" .repeat(50));
        console.log(`Assistant: ${assistantName} | User: ${userName}`);
        console.log(`Prompt: ${prompt}`);
        console.log("=" .repeat(50));
        
        let data = await geminiResponse(prompt, assistantName, userName);
        res.json(data);
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Test route
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

// Start server
app.listen(port, () => {
    connectDb();
    console.log(`Server running on port ${port}`);
});