
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylingAdvice = async (userInput: string, chatHistory: { role: 'user' | 'model', text: string }[], userProfile?: { gender?: 'male' | 'female', shoppingFor?: 'self' | 'gift' }) => {
  // Use gemini-3-flash-preview for basic text tasks like styling advice.
  const model = 'gemini-3-flash-preview';

  const isMale = userProfile?.gender === 'male';
  const roleName = isMale ? 'consultor' : 'consultora';
  const welcomeText = isMale ? 'Bem-vindo' : 'Bem-vinda';

  const systemInstruction = `Você é a Inteligência Artificial da Mendonça Dreams, uma Maison de alta alfaiataria feminina de luxo. 
    Sua missão é dar dicas de moda social e alfaiataria feminina de luxo. 
    Você deve se comportar como um ${roleName} de estilo pessoal, sendo extremamente sofisticado, educado e conhecedor de tecidos premium (como seda, lã fria, linho) e cortes clássicos.
    
    O usuário atual se identifica como: ${userProfile?.gender || 'feminino'}.
    O objetivo de compra é: ${userProfile?.shoppingFor === 'gift' ? 'presentear alguém' : 'uso próprio'}.

    SEMPRE responda em Português de forma elegante. 
    Se o usuário for homem e estiver comprando presente, seja um ${roleName} especializado em ajudar a escolher o presente perfeito. 
    Use saudações como "${welcomeText}" de acordo com o perfil.
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
