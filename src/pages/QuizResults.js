import { memo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QuizResults = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, totalPoints, answers, quiz } = location.state || {};
  const currentUsername = localStorage.getItem('username');

  // Redirect to dashboard if no valid results (prevents accessing results page directly)
  useEffect(() => {
    if (!quiz || !answers || !location.state) {
      // Only show results if they came from quiz submission (via navigation state)
      // Not from localStorage or direct URL access
      navigate('/', { replace: true });
    }
  }, [quiz, answers, navigate, location.state]);

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">No results found</p>
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

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const correctAnswers = quiz.questions.filter(q => {
    if (q.type === 'Text') return false;
    return answers[q.id] === q.correctAnswer;
  }).length;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good Job!';
    if (percentage >= 40) return 'Not Bad!';
    return 'Keep Practicing! 📚';
  };

  const handleRetakeQuiz = () => {
    // Clear session storage for this quiz to start fresh
    const quizSessionKey = `quiz_${quiz.id}_${currentUsername}`;
    sessionStorage.removeItem(quizSessionKey);
    navigate(`/quiz/${quiz.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
          <p className="text-blue-100">{quiz.title}</p>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
              {percentage}%
            </div>
            <p className="text-2xl font-semibold text-gray-700 mb-2">{getScoreMessage()}</p>
            <p className="text-gray-600">
              You scored {score} out of {totalPoints} points
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Questions</p>
              <p className="text-2xl font-bold text-blue-600">{quiz.questions.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Wrong Answers</p>
              <p className="text-2xl font-bold text-red-600">
                {quiz.questions.filter(q => q.type !== 'Text').length - correctAnswers}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Review Answers</h2>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = question.type !== 'Text' && userAnswer === question.correctAnswer;
                const isAnswered = userAnswer !== undefined && userAnswer !== '';

                return (
                  <div
                    key={question.id}
                    className={`border-2 rounded-lg p-4 ${
                      question.type === 'Text'
                        ? 'border-gray-200'
                        : isCorrect
                        ? 'border-green-200 bg-green-50'
                        : isAnswered
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Q{index + 1}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {question.type}
                      </span>
                      {question.type !== 'Text' && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isCorrect
                              ? 'bg-green-100 text-green-800'
                              : isAnswered
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {isCorrect ? '✓ Correct' : isAnswered ? '✗ Wrong' : 'Not Answered'}
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-gray-900 mb-3">{question.question}</p>

                    {question.type !== 'Text' && (
                      <div className="space-y-2">
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg ${
                              option === question.correctAnswer
                                ? 'bg-green-100 border-2 border-green-500'
                                : option === userAnswer && option !== question.correctAnswer
                                ? 'bg-red-100 border-2 border-red-500'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-900">{option}</span>
                              {option === question.correctAnswer && (
                                <span className="text-green-600 font-semibold text-sm">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {option === userAnswer && option !== question.correctAnswer && (
                                <span className="text-red-600 font-semibold text-sm">
                                  Your Answer
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'Text' && userAnswer && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                        <p className="text-gray-900">{userAnswer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleRetakeQuiz}
              className="px-8 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

QuizResults.displayName = 'QuizResults';

export default QuizResults;
