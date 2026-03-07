import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function analyzeLeafImage(base64Image: string, lang: string = 'en'): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    }
    
    const textPart = {
      text: `You are an expert agricultural AI. Analyze this leaf image. Identify the crop if it's Paddy, Corn, Areca nut, or Tomato. Detect any visible diseases. Provide a diagnosis, confidence level, and recommended treatment. Also, recommend specific medicines/pesticides with dosage instructions. For each medicine, provide a Markdown link to search and buy it online (e.g., [Buy Medicine Name](https://www.amazon.in/s?k=Medicine+Name+pesticide)). If the image is not a leaf, state that clearly. Please provide the response in the language corresponding to this language code: ${lang}.`,
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, textPart] },
    })
    
    return response.text || "Could not analyze the image."
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw new Error("Failed to analyze image")
  }
}

let chatSession: any = null

export async function sendMessageToChatbot(message: string): Promise<string> {
  try {
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a helpful agriculture assistant. Always detect the user's language. If they speak Kannada, English, Malayalam, Tamil, or Telugu, respond fluently in that specific language. Provide solutions for crop diseases, fertilizer recommendations, and government schemes. Be concise and practical.",
        },
      })
    }
    
    const response = await chatSession.sendMessage({ message })
    return response.text || "I'm sorry, I couldn't process that request."
  } catch (error) {
    console.error("Error sending message:", error)
    throw new Error("Failed to send message")
  }
}

