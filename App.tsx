import React, { useState, useEffect, useRef } from 'react';
import StarLogo from './components/StarLogo';
import { getBookAnswer } from './services/openRouterService';

const App: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Ref for the result container to scroll/focus if needed, though centered layout usually avoids this.
  const resultRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setAnswer(null);
    setShowResult(false);
    setQuestion('');
  };

  const handleFindAnswer = async () => {
    if (isLoading) return;

    // Start the "Ritual"
    setIsLoading(true);
    setAnswer(null);
    setShowResult(false);

    try {
      // Parallel execution: Minimum wait time for animation + API call
      // The spec mentions "Waiting or Animation" (儀式感等待)
      const minWaitTime = new Promise(resolve => setTimeout(resolve, 2000));
      const apiCall = getBookAnswer(question);

      const [_, result] = await Promise.all([minWaitTime, apiCall]);

      setAnswer(result);
      setShowResult(true);
    } catch (e) {
      setAnswer("The spirits are quiet today.");
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFindAnswer();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-book-bg font-hand text-black">
      
      {/* The Book Container */}
      <div className="relative w-full max-w-[600px] aspect-[4/5] bg-book-pink shadow-2xl border border-gray-300 flex flex-col items-center justify-between p-8 md:p-12 transition-all duration-500">
        
        {/* Inner Border (The distinct line in the wireframe) */}
        <div className="absolute inset-4 md:inset-6 border border-black pointer-events-none"></div>

        {/* Content Layer */}
        <div className="z-10 w-full h-full flex flex-col items-center justify-between py-8">
          
          {/* Top: Logo */}
          <div className="flex-none transition-transform duration-700">
            <StarLogo />
          </div>

          {/* Middle: The Interaction Area */}
          <div className="flex-grow flex flex-col items-center justify-center w-full max-w-sm">
            
            {isLoading ? (
              /* Loading State: Cosmic signals */
              <div className="text-center animate-pulse">
                <p className="text-xl md:text-2xl mb-4">Listening to the universe...</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : showResult ? (
              /* Result State */
              <div 
                ref={resultRef}
                className="text-center animate-in fade-in zoom-in duration-700"
              >
                 <p className="text-2xl md:text-4xl font-bold leading-relaxed px-4 break-words">
                  "{answer}"
                </p>
                <button 
                  onClick={handleReset}
                  className="mt-8 text-sm opacity-60 hover:opacity-100 underline decoration-dotted"
                >
                  Ask another question
                </button>
              </div>
            ) : (
              /* Initial/Input State */
              <div className="w-full space-y-8 animate-in fade-in duration-500">
                <div className="w-full text-center">
                  <label htmlFor="question" className="block text-sm uppercase tracking-widest mb-2 font-bold">
                    Type Question
                  </label>
                  <input
                    id="question"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-b border-black text-center text-xl md:text-2xl focus:outline-none placeholder-gray-600/50 py-2"
                    placeholder="(Meditate on it...)"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom: Action Button */}
          <div className={`flex-none w-full flex justify-center transition-opacity duration-500 ${showResult || isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button
              onClick={handleFindAnswer}
              className="bg-[#F5F5F5] hover:bg-white text-black px-12 py-6 rounded-[50%] shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-300 font-bold tracking-wider text-sm md:text-base uppercase min-w-[200px]"
            >
              Find Answer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
