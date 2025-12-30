
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylingAdvice = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[]) => {
  // Use gemini-3-flash-preview for basic text tasks like styling advice.
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Você é a "Estilista Virtual Mendonça Dreams". 
    Sua missão é dar dicas de moda social e alfaiataria feminina de luxo.
    Seja elegante, profissional, atenciosa e direta.
    Use as cores da marca: Azul Marinho e Branco.
    Ajude a cliente a escolher roupas para trabalho, eventos corporativos e reuniões de gala.
    Responda em Português do Brasil de forma sofisticada.
  `;

  try {
    // Generate content using the model, full conversation history, and system instructions in the config.
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...chatHistory.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Access the .text property directly from the response object.
    return response.text || "Desculpe, não consegui processar seu pedido no momento.";
  } catch (error) {
    console.error("Erro no Gemini API:", error);
    return "Estou com uma pequena instabilidade. Posso te ajudar com outra dúvida sobre nossas coleções?";
  }
};
