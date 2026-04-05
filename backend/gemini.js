// import axios from "axios";

// const geminiResponse = async (prompt, assistantName = "Jarvis", userName = "User") => {
//     try {
//         const apiKey = process.env.GEMINI_API_KEY;
        
//         if (!apiKey) {
//             return { success: false, error: "API key not found in .env" };
//         }
        
//         // System prompt for the assistant
//         const systemPrompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
// You are not Google. You will now behave like a voice-enabled assistant.

// Your task is to understand the user's natural language input and respond with a JSON object like this:

// {
//   "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
//           "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
//           "instagram_open" | "facebook_open" | "weather-show",

//   "userInput": "<original user input>",
//   "response": "<a short spoken response to read out loud to the user>"
// }

// Instructions:
// - "type": determine the intent of the user.
// - "userInput": original sentence the user spoke.
// - "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

// Type meanings:
// - "general": if it's a factual or informational question.
// - "google_search": if user wants to search something on Google.
// - "youtube_search": if user wants to search something on YouTube.
// - "youtube_play": if user wants to directly play a video or song.
// - "calculator_open": if user wants to open a calculator.
// - "instagram_open": if user wants to open Instagram.
// - "facebook_open": if user wants to open Facebook.
// - "weather-show": if user wants to know weather.
// - "get_time": if user asks for current time.
// - "get_date": if user asks for today's date.
// - "get_day": if user asks what day it is.
// - "get_month": if user asks for the current month.

// Important:
// - Use "${userName}" if someone asks who created you.
// - Only respond with the JSON object, nothing else.

// Now the user said: "${prompt}"`;
        
//         // Try multiple models in order of preference
//         const models = [
//             "gemini-1.5-flash",
//             "gemini-1.5-pro",
//             "gemini-2.0-flash-exp"
//         ];
        
//         let lastError = null;
        
//         for (const model of models) {
//             try {
//                 const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                
//                 console.log(`Trying model: ${model}`);
//                 console.log(`Assistant: ${assistantName} | User: ${userName}`);
//                 console.log(`User Prompt: ${prompt}`);
                
//                 const result = await axios.post(url, {
//                     contents: [{
//                         parts: [{
//                             text: systemPrompt
//                         }]
//                     }],
//                     generationConfig: {
//                         temperature: 0.5,
//                         topP: 0.95,
//                         topK: 40,
//                         maxOutputTokens: 500
//                     }
//                 });
                
//                 let responseText = result.data.candidates[0].content.parts[0].text;
                
//                 // Clean the response - remove markdown code blocks
//                 responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                
//                 console.log(`Success with model: ${model}`);
//                 console.log(`Raw Response: ${responseText}`);
                
//                 // Parse JSON response
//                 let jsonResponse;
//                 try {
//                     jsonResponse = JSON.parse(responseText);
//                 } catch (e) {
//                     console.error("JSON Parse Error:", e.message);
//                     // Fallback response if JSON parsing fails
//                     jsonResponse = {
//                         type: "general",
//                         userinput: prompt,
//                         response: responseText || "I'm sorry, I couldn't process that request."
//                     };
//                 }
                
//                 // Validate required fields
//                 if (!jsonResponse.type) jsonResponse.type = "general";
//                 if (!jsonResponse.userinput) jsonResponse.userinput = prompt;
//                 if (!jsonResponse.response) jsonResponse.response = "I'm here to help you!";
                
//                 return { 
//                     success: true, 
//                     data: jsonResponse,
//                     model: model 
//                 };
                
//             } catch (error) {
//                 lastError = error;
//                 console.log(`Model ${model} failed:`, error.response?.data?.error?.message);
//                 continue;
//             }
//         }
        
//         throw lastError;
        
//     } catch (error) {
//         console.error("All models failed:", error.response?.data || error.message);
//         return { 
//             success: false, 
//             error: error.response?.data?.error?.message || "All models failed" 
//         };
//     }
// }

// export default geminiResponse;


import axios from "axios";

const geminiResponse = async (userCommand, assistantName = "Jarvis", userName = "User") => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY not found");
            return { success: false, error: "API key not configured" };
        }
        
        console.log("🔑 API Key found, calling Gemini...");
        
        const systemPrompt = `You are a virtual assistant named ${assistantName} created by ${userName}.

Respond with ONLY a JSON object. No other text. Use this exact format:
{
  "type": "general",
  "userInput": "${userCommand}",
  "response": "Your spoken response here"
}

Types to use:
- "google_search" - when user wants to search Google
- "youtube_search" - when user wants to search YouTube  
- "youtube_play" - when user wants to play a video
- "instagram_open" - when user wants to open Instagram
- "facebook_open" - when user wants to open Facebook
- "weather-show" - when user asks about weather
- "calculator_open" - when user wants a calculator
- "get_time" - when user asks for current time
- "get_date" - when user asks for current date
- "get_day" - when user asks what day it is
- "get_month" - when user asks for current month
- "general" - for all other questions

User asked: "${userCommand}"`;

        // ✅ Updated model list - using models from your API response
        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-2.0-flash-001",
            "gemini-2.5-flash",
            "gemini-flash-latest",
            "gemini-pro-latest"
        ];
        
        for (const model of modelsToTry) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                
                console.log(`📡 Trying model: ${model}`);
                
                const result = await axios.post(url, {
                    contents: [{
                        parts: [{ text: systemPrompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500
                    }
                });
                
                console.log(`✅ Success with model: ${model}`);
                
                let responseText = result.data.candidates[0].content.parts[0].text;
                responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                
                console.log(`📝 Response: ${responseText.substring(0, 100)}...`);
                
                let jsonResponse = JSON.parse(responseText);
                
                if (!jsonResponse.type) jsonResponse.type = "general";
                if (!jsonResponse.userInput) jsonResponse.userInput = userCommand;
                if (!jsonResponse.response) jsonResponse.response = "I'm here to help!";
                
                return { 
                    success: true, 
                    data: jsonResponse
                };
                
            } catch (error) {
                console.log(`❌ Model ${model} failed:`, error.response?.data?.error?.message || error.message);
                continue;
            }
        }
        
        throw new Error("All models failed");
        
    } catch (error) {
        console.error("❌ Gemini error:", error);
        return { 
            success: false, 
            error: error.message 
        };
    }
};

export default geminiResponse;