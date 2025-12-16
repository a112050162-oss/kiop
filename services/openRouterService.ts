import { ChatMessage, OpenRouterResponse } from '../types';

// Hardcoded API Key as per requirements
const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_ID = "google/gemma-3n-e2b-it:free";

// The "Soul" of the product - System Prompt defined in spec
const SYSTEM_PROMPT = `You are a mystical, cute, but weird Book of Answers. You answer user questions with short, surreal, abstract, or funny metaphorical sentences. NEVER give logical advice. NEVER explain your answer. Keep it under 20 words. Tone: Whimsical, slightly nonsensical but profound. Examples: \"The pudding agrees.\", \"Ask the nearest cat.\", \"The stars remain silent.\"`;

export const getBookAnswer = async (userQuestion: string): Promise<string> => {
  // Handle empty input or "silent" ritual as per spec
  const finalContent = userQuestion.trim() === "" ? "[USER_FOCUSED_SILENCE]" : userQuestion;

  // Combine system instructions with user content as the model/API does not support system role
  const combinedContent = `${SYSTEM_PROMPT}\n\nUser Question: ${finalContent}`;

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: combinedContent
    }
  ];

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": window.location.origin, // Required by OpenRouter for some integrations
        "X-Title": "The Book of Answers AI"
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: messages,
        temperature: 1.2, // High randomness for "Weirdness"
        max_tokens: 50,   // Strict length control
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      return "The pages are stuck together. Try again.";
    }
  } catch (error) {
    console.error("Failed to fetch answer:", error);
    return "A cosmic dusting prevented the answer. Please ask again.";
  }
};