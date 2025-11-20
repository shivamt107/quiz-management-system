import { memo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TakeQuiz = memo(({ quizzes }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const quiz = quizzes.find(q => q.id === parseInt(id));
  const currentUsername = localStorage.getItem('username');

  // Create a unique key for this quiz attempt (user-specific)
  const quizSessionKey = `quiz_${id}_${currentUsername}`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Reset quiz state when component mounts or quiz changes
  useEffect(() => {
    if (quiz) {
      // Always start fresh - session storage is only for auto-save during quiz
      // Session is cleared when clicking "Start Quiz" button
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeRemaining(quiz.duration * 60);
    }
  }, [quiz, id, quizSessionKey]);

  // Save quiz progress to sessionStorage whenever state changes
  useEffect(() => {
    if (quiz && timeRemaining > 0) {
      const session = {
        currentQuestionIndex,
        answers,
        timeRemaining,
        quizId: id,
        username: currentUsername
      };
      sessionStorage.setItem(quizSessionKey, JSON.stringify(session));
    }
  }, [currentQuestionIndex, answers, timeRemaining, quiz, id, currentUsername, quizSessionKey]);

  const handleSubmit = useCallback(() => {
    const score = quiz.questions.reduce((acc, question) => {
      if (question.type === 'Text') {
        return acc;
      }
      if (answers[question.id] === question.correctAnswer) {
        return acc + question.points;
      }
      return acc;
    }, 0);

    const totalPoints = quiz.questions.reduce((acc, q) => {
      if (q.type === 'Text') return acc;
      return acc + q.points;
    }, 0);

    // Clear the quiz session after submission
    sessionStorage.removeItem(quizSessionKey);

    navigate(`/quiz/${id}/results`, {
      state: {
        score,
        totalPoints,
        answers,
        quiz
      }
    });
  }, [answers, quiz, navigate, id, quizSessionKey]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmit, quiz]);

  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, quiz]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">Quiz not found or has no questions</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm">Time: </span>
                <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-2 opacity-90">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQuestion.type}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === 'MCQ' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'True/False' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'Text' && (
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows="5"
                placeholder="Type your answer here..."
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers[quiz.questions[index].id]
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TakeQuiz.displayName = 'TakeQuiz';

export default TakeQuiz;
