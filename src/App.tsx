import React, { useState, useEffect } from 'react';
import './App.css';
import Question from './components/Question';
import { QuizQuestion, QuizState } from './types/quiz';

function App() {
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([]);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    showAnswer: false,
    score: 0
  });

  useEffect(() => {
    fetch('/documents/Json preguntas .json')
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo de preguntas');
        }
        return response.json();
      })
      .then(data => {
        console.log('Preguntas cargadas:', data); // Para depuración
        setAllQuestions(data);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setError('Error al cargar las preguntas. Por favor, intenta de nuevo.');
      });
  }, []);

  const startQuiz = () => {
    if (allQuestions.length === 0) {
      setError('No hay preguntas disponibles');
      return;
    }

    if (numQuestions > allQuestions.length) {
      setNumQuestions(allQuestions.length);
    }

    // Randomly select questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numQuestions);
    console.log('Preguntas seleccionadas:', selected); // Para depuración
    
    setSelectedQuestions(selected);
    setQuizStarted(true);
    setError('');
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = selectedQuestions[quizState.currentQuestionIndex];
    
    if (answer === currentQuestion.correctAnswer) {
      setQuizState(prev => ({
        ...prev,
        score: prev.score + 1,
        showAnswer: true
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        showAnswer: true
      }));
    }
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < selectedQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showAnswer: false
      }));
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setQuizState({
      currentQuestionIndex: 0,
      showAnswer: false,
      score: 0
    });
  };

  const isQuizFinished = quizState.currentQuestionIndex === selectedQuestions.length - 1 && quizState.showAnswer;

  if (!quizStarted) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Quiz App</h1>
          <div className="quiz-setup">
            <h2>Configuración del Quiz</h2>
            {error && <p className="error-message">{error}</p>}
            <p>Total de preguntas disponibles: {allQuestions.length}</p>
            <div className="questions-input">
              <label htmlFor="numQuestions">Número de preguntas:</label>
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.min(Math.max(1, parseInt(e.target.value) || 1), allQuestions.length))}
                min="1"
                max={allQuestions.length}
              />
            </div>
            <button 
              className="start-button" 
              onClick={startQuiz}
              disabled={allQuestions.length === 0}
            >
              Comenzar Quiz
            </button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quiz App</h1>
        <p>Puntuación: {quizState.score} / {selectedQuestions.length}</p>
      </header>
      
      {selectedQuestions.length > 0 ? (
        <Question
          question={selectedQuestions[quizState.currentQuestionIndex]}
          onAnswer={handleAnswer}
          showAnswer={quizState.showAnswer}
        />
      ) : (
        <p>No hay preguntas disponibles</p>
      )}

      {quizState.showAnswer && !isQuizFinished && (
        <button className="next-button" onClick={handleNext}>
          Siguiente pregunta
        </button>
      )}

      {isQuizFinished && (
        <div className="quiz-finished">
          <h2>¡Quiz completado!</h2>
          <p>Puntuación final: {quizState.score} de {selectedQuestions.length}</p>
          <button className="restart-button" onClick={handleRestart}>
            Reiniciar Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
