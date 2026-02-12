# FinSpan AI Chat Toolbar

## Overview

The FinSpan AI Chat Toolbar is a right-hand side (RHS) slide-out panel that provides users with AI-powered retirement planning insights using Google's Gemini API.

## Features

- **Slide-out Panel**: Clean, animated slide-out interface from the right side of the screen
- **Floating Action Button**: Sparkles icon button that appears when panel is closed
- **Context-Aware AI**: Uses simulation data to provide personalized responses
- **Welcome Message**: Dynamic welcome based on simulation results (success rate, shortfall warnings, etc.)
- **Chat History**: Maintains conversation history within the session
- **Markdown Support**: AI responses support bold text and formatting
- **Auto-scroll**: Automatically scrolls to latest message

## Components

### AIChatToolbar (`src/components/ai/AIChatToolbar.tsx`)

The main component that provides:
- Chat interface with message history
- Input field with keyboard support (Enter to send, Shift+Enter for new line)
- Integration with SimulationContext for data access
- Welcome message generation based on simulation results
- Clear chat functionality

### AI Chat Service (`src/services/ai-chat.service.ts`)

Service layer for Gemini API communication:
- Singleton pattern for efficient API usage
- System prompt with retirement planning context
- Message history management
- Simulation context building for personalized responses

## Environment Variables

Add the following to your `.env` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Usage

The AI Chat Toolbar is automatically included in all dashboard pages via the `DashboardLayout` component. Users can:

1. Click the floating sparkles button to open the chat
2. Ask questions about their retirement simulation
3. View personalized insights based on their simulation data
4. Clear the chat history using the trash icon

## Example Questions

Users can ask questions like:
- "What happens if I retire 2 years later?"
- "How can I improve my success rate?"
- "Explain my tax projections"
- "What if I increase my savings by $500/month?"

## Security Considerations

Currently, the Gemini API key is used directly from the frontend. For production deployments, consider:

1. **Backend Proxy**: Route AI requests through your backend to protect the API key
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **User Authentication**: Ensure only authenticated users can access AI features
4. **Input Validation**: Sanitize user inputs before sending to AI

## Future Enhancements

Potential improvements:
- Streaming responses for real-time typing effect
- Persistent chat history across sessions
- Quick action buttons for common questions
- Multi-language support
- Voice input/output
- Export chat history

## Dependencies

- `@google/generative-ai`: Google Gemini API client
- `framer-motion`: Animations for slide-out panel
- `lucide-react`: Icons (Bot, User, Sparkles, etc.)

## Integration with Simulation Context

The AI toolbar automatically accesses:
- User's age, retirement age, life expectancy
- Income and expense data
- Savings balances (taxable, deferred, Roth)
- Simulation results (success probability, shortfall years)
- Assumptions (inflation, returns, social security)

This data is formatted and sent to Gemini as context for personalized responses.
