import React, { useState } from 'react';
import VideoFeed from './components/VideoFeed';
import InterviewPanel from './components/InterviewPanel';
import Summary from './components/Summary';
import './App.css';

const QUESTIONS = [
  "Tell me about yourself.",
  "What is the biggest project you have worked on?",
  "What are your strengths?",
  "Why should we hire you?"
];

function App() {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswerCaptured = (question, answer) => {
    setAnswers(prev => [...prev, { question, answer }]);
  };

  const handleInterviewComplete = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsComplete(true);
    }, 3000);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Interview System</h1>
        <p>College Project Prototype</p>
      </header>

      <main className="main-layout">
        {!isComplete && !isAnalyzing ? (
          <>
            <div className="column-left">
              <VideoFeed />
            </div>
            <div className="column-right">
              <InterviewPanel 
                questions={QUESTIONS} 
                onAnswerCaptured={handleAnswerCaptured}
                onInterviewComplete={handleInterviewComplete}
              />
            </div>
          </>
        ) : isAnalyzing ? (
          <div className="analyzing-state">
            <div className="loader"></div>
            <h2>AI analyzing your responses...</h2>
            <p>Evaluating communication, confidence, and context.</p>
          </div>
        ) : (
          <Summary answers={answers} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 AI Interviewer Prototype</p>
      </footer>
    </div>
  );
}

export default App;
