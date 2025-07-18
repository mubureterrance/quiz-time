import { db } from "../services/firebase";
import { doc, setDoc, addDoc, deleteDoc, collection } from "firebase/firestore";
import type { QuizForm } from "../components/quiz/types";

export const createQuiz = async (data: QuizForm) => {
  return await addDoc(collection(db, "quizzes"), data);
};

export const updateQuiz = async (id: string, data: QuizForm) => {
  return await setDoc(doc(db, "quizzes", id), data);
};

export const deleteQuiz = async (id: string) => {
  return await deleteDoc(doc(db, "quizzes", id));
};
