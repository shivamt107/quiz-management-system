import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useQuizData } from './hooks/useQuizData';
import Login from './components/Login';
import './App.css';

const QuizList = lazy(() => import('./components/QuizList'));
const CreateEditQuiz = lazy(() => import('./pages/CreateEditQuiz'));

function App() {
  const { currentUser, username, login, logout } = useAuth();
  const { quizzes, saveQuiz } = useQuizData();

  if (!currentUser) {
    return <Login onLogin={login} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quiz Management System</h1>
              <p className="text-sm text-gray-600">Welcome, {username} ({currentUser})</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-lg text-gray-600">Loading...</div>}>
          <Routes>
            <Route path="/" element={<QuizList userRole={currentUser} />} />
            <Route path="/create" element={<CreateEditQuiz quizzes={quizzes} onSave={saveQuiz} />} />
            <Route path="/edit/:id" element={<CreateEditQuiz quizzes={quizzes} onSave={saveQuiz} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
