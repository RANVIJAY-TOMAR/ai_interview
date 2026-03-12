import React from 'react';

/**
 * Summary Component
 * Displays the final results and a dummy AI analysis.
 */
const Summary = ({ answers }) => {
  return (
    <div className="summary-container">
      <h2>Interview Summary</h2>
      
      <div className="summary-stats">
        <div className="stat-card">
          <h4>Total Questions</h4>
          <p>{answers.length}</p>
        </div>
      </div>

      <div className="answers-list">
        <h3>Your Responses</h3>
        {answers.map((item, index) => (
          <div key={index} className="answer-item">
            <p className="summary-question"><strong>Q:</strong> {item.question}</p>
            <p className="summary-answer"><strong>A:</strong> {item.answer}</p>
          </div>
        ))}
      </div>

      <div className="analysis-section">
        <h3>AI Evaluation</h3>
        <div className="evaluation-grid">
          <div className="eval-item">
            <span className="label">Communication:</span>
            <span className="value high">Good</span>
          </div>
          <div className="eval-item">
            <span className="label">Confidence:</span>
            <span className="value medium">Moderate</span>
          </div>
          <div className="eval-item">
            <span className="label">Technical Depth:</span>
            <span className="value low">Beginner</span>
          </div>
        </div>
        <p className="ai-note">Note: This is an AI-generated prototype summary for demonstration purposes.</p>
      </div>

      <button className="btn-secondary" onClick={() => window.location.reload()}>
        Restart Interview
      </button>
    </div>
  );
};

export default Summary;
