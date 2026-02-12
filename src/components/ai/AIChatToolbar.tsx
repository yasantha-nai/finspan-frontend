import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimulation } from '@/context/SimulationContext';
import { aiChatService } from '@/services/ai-chat.service';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatToolbarProps {
  className?: string;
}

export function AIChatToolbar({ className }: AIChatToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { result, inputs, rawBackendResults } = useSimulation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Add welcome message when opened and empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  function getWelcomeMessage(): string {
    if (!result) {
      return "👋 Hi! I'm your FinSpan AI assistant. I can help you understand your retirement simulation results and answer questions about your financial plan. Run a simulation first, and I'll be able to provide personalized insights!";
    }

    const successRate = result.successProbability;
    const shortfallYears = result.shortfallYears.length;
    const fiAge = result.financialIndependenceAge;
    
    let welcome = `👋 Hi! I've analyzed your retirement simulation. `;
    
    if (successRate >= 90) {
      welcome += `Great news! Your plan has a **${successRate.toFixed(0)}% success rate**. `;
      welcome += `You're on track to reach financial independence around age **${fiAge}**. `;
    } else if (successRate >= 70) {
      welcome += `Your plan shows a **${successRate.toFixed(0)}% success rate** with some room for improvement. `;
      if (shortfallYears > 0) {
        welcome += `I noticed potential shortfalls in ${shortfallYears} years. `;
      }
    } else {
      welcome += `⚠️ Your current plan has a **${successRate.toFixed(0)}% success rate** and needs attention. `;
      welcome += `Let's discuss strategies to improve your retirement outlook. `;
    }
    
    welcome += `\n\nAsk me anything about your results! For example:\n`;
    welcome += `• "What happens if I retire 2 years later?"\n`;
    welcome += `• "How can I improve my success rate?"\n`;
    welcome += `• "Explain my tax projections"`;
    
    return welcome;
  }

  async function handleSendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const simulationContext = buildSimulationContext();
      const response = await aiChatService.sendMessage(
        userMessage.content,
        messages,
        simulationContext
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function buildSimulationContext(): string {
    if (!result || !rawBackendResults) {
      return 'No simulation results available yet.';
    }

    const lastYear = result.years[result.years.length - 1];
    const retirementYear = result.years.find(y => y.userAge === inputs.retirementAge);
    
    let context = `## Current Simulation Data\n\n`;
    
    // Basic demographics
    context += `**Personal Information:**\n`;
    context += `- Current Age: ${inputs.currentAge}\n`;
    context += `- Retirement Age: ${inputs.retirementAge}\n`;
    context += `- Life Expectancy: ${inputs.lifeExpectancy}\n`;
    context += `- Filing Status: ${inputs.taxFilingStatus}\n\n`;
    
    // Financial summary
    context += `**Financial Summary:**\n`;
    context += `- Current Salary: $${inputs.currentSalary.toLocaleString()}\n`;
    context += `- Annual Expenses: $${inputs.currentExpenses.toLocaleString()}\n`;
    context += `- Total Savings: $${(inputs.taxableSavings + inputs.taxDeferredSavings + inputs.taxFreeSavings).toLocaleString()}\n`;
    context += `  - Taxable: $${inputs.taxableSavings.toLocaleString()}\n`;
    context += `  - Tax-Deferred: $${inputs.taxDeferredSavings.toLocaleString()}\n`;
    context += `  - Roth: $${inputs.taxFreeSavings.toLocaleString()}\n\n`;
    
    // Results summary
    context += `**Simulation Results:**\n`;
    context += `- Success Probability: ${result.successProbability.toFixed(1)}%\n`;
    context += `- Financial Independence Age: ${result.financialIndependenceAge}\n`;
    context += `- Peak Portfolio Value: $${Math.max(...result.years.map(y => y.totalPortfolio)).toLocaleString()}\n`;
    context += `- Final Legacy Value: $${result.totalLegacy.toLocaleString()}\n`;
    
    if (result.shortfallYears.length > 0) {
      const bankruptcyYear = result.years.find(y => y.totalPortfolio <= 0);
      if (bankruptcyYear) {
        context += `- ⚠️ Funds depleted at age ${bankruptcyYear.userAge}\n`;
      }
    }
    
    if (retirementYear) {
      context += `- Portfolio at Retirement: $${retirementYear.totalPortfolio.toLocaleString()}\n`;
    }
    
    context += `\n**Key Assumptions:**\n`;
    context += `- Pre-Retirement Return: ${inputs.preRetirementReturn}%\n`;
    context += `- Post-Retirement Return: ${inputs.postRetirementReturn}%\n`;
    context += `- Inflation Rate: ${inputs.generalInflation}%\n`;
    context += `- Social Security at Age: ${inputs.ssStartAge} ($${inputs.ssEstimatedAmount.toLocaleString()}/month)\n`;
    
    return context;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              "fixed right-4 bottom-4 z-50",
              className
            )}
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 bg-background border-l shadow-2xl"
          >
            <Card className="h-full flex flex-col rounded-none border-0">
              {/* Header */}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">FinSpan AI</CardTitle>
                    <p className="text-xs text-muted-foreground">Ask about your retirement plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="h-8 w-8"
                    title="Clear chat"
                  >
                    <span className="sr-only">Clear chat</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-180px)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-3",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role === 'assistant' && (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                            message.role === 'user'
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          )}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content.split('**').map((part, i) => 
                              i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>
                            )}
                          </div>
                          <div className={cn(
                            "text-[10px] mt-1",
                            message.role === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input Area */}
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={result ? "Ask about your retirement plan..." : "Run a simulation first to get personalized insights"}
                    disabled={isLoading || !result}
                    className="min-h-[60px] resize-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading || !result}
                    size="icon"
                    className="h-[60px] w-[60px] flex-shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  AI responses are for informational purposes only. Consult a financial advisor for professional advice.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
