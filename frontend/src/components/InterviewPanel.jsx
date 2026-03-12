import React, { useState, useEffect, useRef } from 'react';

/**
 * InterviewPanel Component
 * Displays questions, records audio via MediaRecorder, and gets transcript from backend.
 */
const InterviewPanel = ({ 
  questions, 
  onInterviewComplete, 
  onAnswerCaptured 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startInterview = () => {
    setCurrentQuestionIndex(0);
    startRecording();
  };

  const startRecording = async () => {
    setFinalTranscript('');
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all audio tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());

        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for the interview.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    // Append a filename, Whisper often relies on extension to guess format sometimes, though tempfile is used
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await fetch('http://localhost:8000/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        console.error("Backend transcription error:", data.error);
        setFinalTranscript("Error: Could not transcribe audio.");
      } else {
        setFinalTranscript(data.text || "(Inaudible)");
      }
    } catch (error) {
      console.error("Error sending audio to backend:", error);
      setFinalTranscript("Error: Connection to backend failed.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const nextQuestion = () => {
    onAnswerCaptured(questions[currentQuestionIndex], finalTranscript);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      startRecording();
    } else {
      onInterviewComplete();
    }
  };

  if (currentQuestionIndex === -1) {
    return (
      <div className="interview-panel start-screen">
        <h2>AI Interviewer</h2>
        <p>Welcome to your AI-powered interview. The system will record your voice and transcribe it using Whisper AI.</p>
        <button className="btn-primary" onClick={startInterview}>Start Interview</button>
      </div>
    );
  }

  return (
    <div className="interview-panel active-session">
      <h2>AI Interviewer</h2>
      <div className="question-box">
        <p className="question-label">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h3 className="question-text">{questions[currentQuestionIndex]}</h3>
      </div>

      <div className="transcript-box">
        <h4>Your Answer:</h4>
        <div className="transcript-content">
          <p className="final-text">{finalTranscript}</p>
        </div>
        
        {isRecording ? (
          <div className="listening-indicator">
            <span className="pulse-red"></span> Recording your answer...
          </div>
        ) : isTranscribing ? (
          <div className="listening-indicator" style={{color: '#818cf8'}}>
             <span className="loader-small"></span> AI is transcribing...
          </div>
        ) : (
          <p className="status-text">Audio processing complete.</p>
        )}
      </div>

      <div className="controls">
        {isRecording ? (
          <button className="btn-secondary" onClick={stopRecording}>
            Stop Recording
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={nextQuestion}
            disabled={isTranscribing || !finalTranscript}
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish Interview" : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewPanel;

