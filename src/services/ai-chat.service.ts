import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY not found in environment variables. AI chat will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are FinSpan AI, a helpful financial planning assistant specializing in retirement planning. Your role is to help users understand their retirement simulation results and provide insights.

Guidelines:
1. Be concise but informative - aim for 2-4 paragraphs max
2. Use specific numbers from the user's simulation data when relevant
3. Provide actionable suggestions when appropriate
4. Explain financial concepts in simple terms
5. If the user's plan has issues (low success rate, shortfall years), be encouraging but honest about the challenges
6. Never provide specific investment advice or recommend specific financial products
7. Always include a disclaimer that you're an AI assistant and not a licensed financial advisor
8. Use markdown formatting (bold, bullet points) for better readability
9. When comparing scenarios, highlight key differences clearly
10. If asked about taxes, explain the projections but remind users tax laws change

Context: You'll be provided with the user's simulation data including their age, income, savings, expenses, and simulation results. Use this data to provide personalized responses.

Tone: Professional yet friendly, encouraging, and educational.`;

class AIChatService {
  private model: GenerativeModel | null = null;
  private chatSession: ChatSession | null = null;

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        systemInstruction: SYSTEM_PROMPT,
      });
    }
  }

  async sendMessage(
    message: string, 
    history: Message[], 
    simulationContext: string
  ): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key configuration.');
    }

    try {
      // Build conversation history for Gemini
      const formattedHistory = history
        .filter(msg => msg.id !== 'welcome') // Exclude welcome message from history
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

      // Start a new chat session with history
      this.chatSession = this.model.startChat({
        history: formattedHistory,
      });

      // Build the prompt with context
      const prompt = this.buildPrompt(message, simulationContext);

      // Send message
      const result = await this.chatSession.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('AI Chat Service Error:', error);
      throw error;
    }
  }

  private buildPrompt(message: string, simulationContext: string): string {
    return `${simulationContext}

---

User Question: ${message}

Please provide a helpful response based on the simulation data above. Be specific with numbers and provide actionable insights where appropriate.`;
  }

  async sendMessageStream(
    message: string,
    history: Message[],
    simulationContext: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key configuration.');
    }

    try {
      const formattedHistory = history
        .filter(msg => msg.id !== 'welcome')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

      this.chatSession = this.model.startChat({
        history: formattedHistory,
      });

      const prompt = this.buildPrompt(message, simulationContext);
      const result = await this.chatSession.sendMessageStream(prompt);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        onChunk(chunkText);
      }
    } catch (error) {
      console.error('AI Chat Stream Error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiChatService = new AIChatService();

// Also export the class for testing
export { AIChatService };
