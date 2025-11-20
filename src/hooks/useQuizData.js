import { useState, useCallback, useMemo } from 'react';

export const useQuizData = () => {
  const [quizzes, setQuizzes] = useState(() => {
    const stored = localStorage.getItem('quizzes');
    return JSON.parse(stored)
  });

  const saveQuiz = useCallback((quiz, isEdit) => {
    setQuizzes(prev => {
        if (!prev) prev = [];
      const updated = isEdit 
        ? prev.map(q => q.id === quiz.id ? quiz : q)
        : [quiz, ...prev];
      localStorage.setItem('quizzes', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteQuiz = useCallback((id) => {
    setQuizzes(prev => {
      const updated = prev.filter(q => q.id !== id);
      localStorage.setItem('quizzes', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const sortedQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return [...quizzes].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [quizzes]);

  return { quizzes: sortedQuizzes, saveQuiz, deleteQuiz };
};
