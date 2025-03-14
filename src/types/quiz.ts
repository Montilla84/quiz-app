export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  showAnswer: boolean;
  score: number;
}