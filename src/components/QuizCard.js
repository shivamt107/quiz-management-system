import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const EditIcon = () => (
  <svg className="inline w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="inline w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const QuizCard = memo(({ quiz, onDelete, canDelete, canEdit, canStart }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      onDelete(quiz.id);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${quiz.id}`);
  };

  const handleStartQuiz = () => {
    // Clear any existing session for this quiz before starting fresh
    const currentUsername = localStorage.getItem('username');
    const quizSessionKey = `quiz_${quiz.id}_${currentUsername}`;
    sessionStorage.removeItem(quizSessionKey);
    navigate(`/quiz/${quiz.id}`);
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">{quiz.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${difficultyColors[quiz.difficulty]}`}>
          {quiz.difficulty}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2 flex-grow">
        {quiz.description}
      </p>
      
      <div className="space-y-2 mb-3 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <span className="truncate">{quiz.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{quiz.questionsCount} questions</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{quiz.duration} min</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        {canStart && (
        <button onClick={handleStartQuiz} className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Start Quiz
        </button>
        )}
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={handleEdit}
              className="p-2 flex justify-center items-center bg-amber-300 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <EditIcon />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="p-2 flex justify-center items-center bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <DeleteIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.quiz.id === nextProps.quiz.id &&
    prevProps.canDelete === nextProps.canDelete &&
    prevProps.canEdit === nextProps.canEdit
  );
});

QuizCard.displayName = 'QuizCard';

export default QuizCard;
