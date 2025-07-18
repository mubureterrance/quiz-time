export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface Quiz {
  id: string;
  title: string;
  badge: string;
  questions: Question[];
}

export interface QuizForm {
  title: string;
  badge: string;
  questions: Question[];
}
