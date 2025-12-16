export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  choices: {
    message: ChatMessage;
    finish_reason: string;
  }[];
}
