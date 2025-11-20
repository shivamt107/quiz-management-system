import { memo, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { useQuizData } from '../hooks/useQuizData';
import { Permission } from '../constants/permissions';
import QuizCard from './QuizCard';

const ITEMS_PER_PAGE = 10;

const QuizList = memo(({ userRole }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { hasPermission } = usePermissions(userRole);
  const { quizzes, deleteQuiz } = useQuizData();

  const canCreate = useMemo(() => hasPermission(Permission.CREATE_QUIZ), [hasPermission]);
  const canDelete = useMemo(() => hasPermission(Permission.DELETE_QUIZ), [hasPermission]);
  const canEdit = useMemo(() => hasPermission(Permission.EDIT_QUIZ), [hasPermission]);
  const canStart = useMemo(() => hasPermission(Permission.START_QUIZ), [hasPermission]);

  const totalPages = Math.ceil(quizzes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentQuizzes = quizzes.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCreateQuiz = useCallback(() => {
    navigate('/create');
  }, [navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
          <p className="text-gray-600 mt-1">{quizzes.length} quizzes available</p>
        </div>
        {canCreate && (
          <button
            onClick={handleCreateQuiz}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Add New Quiz
          </button>
        )}
      </div>

      {currentQuizzes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            {currentQuizzes.map(quiz => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onDelete={deleteQuiz}
                canDelete={canDelete}
                canEdit={canEdit}
                canStart={canStart}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-600 mb-5">No quizzes available</p>
          {canCreate && (
            <button
              onClick={handleCreateQuiz}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
});

QuizList.displayName = 'QuizList';

export default QuizList;
