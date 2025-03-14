import React from 'react';
import { QuizQuestion } from '../types/quiz';
import '../styles/Question.css';

interface QuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  showAnswer: boolean;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer, showAnswer }) => {
  if (!question) {
    return <div>Cargando pregunta...</div>;
  }

  return (
    <div className="question-container">
      <h2 className="question-text">{question.question}</h2>
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showAnswer && onAnswer(String.fromCharCode(65 + index))}
            className={`option-button ${
              showAnswer
                ? String.fromCharCode(65 + index) === question.correctAnswer
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
            disabled={showAnswer}
          >
            {String.fromCharCode(65 + index)}. {option}
          </button>
        ))}
      </div>
      {showAnswer && (
        <div className="answer-feedback">
          <p>Respuesta correcta: {question.correctAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default Question;