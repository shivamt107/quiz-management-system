import { memo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QUIZ_DIFFICULTY, QUIZ_CATEGORY } from '../constants/index';

const CreateEditQuiz = memo(({ quizzes, onSave }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const existingQuiz = isEdit ? quizzes.find(q => q.id === parseInt(id)) : null;

  const [formData, setFormData] = useState(existingQuiz || {
    title: '',
    description: '',
    category: 'General Knowledge',
    difficulty: 'Easy',
    duration: 30,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'MCQ',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  }, []);

  const handleQuestionChange = useCallback((e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleOptionChange = useCallback((index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  }, []);

  const handleQuestionTypeChange = useCallback((type) => {
    if (type === 'MCQ') {
      setCurrentQuestion(prev => ({
        ...prev,
        type,
        options: ['', '', '', ''],
        correctAnswer: ''
      }));
    } else if (type === 'True/False') {
      setCurrentQuestion(prev => ({
        ...prev,
        type,
        options: ['True', 'False'],
        correctAnswer: ''
      }));
    } else {
      setCurrentQuestion(prev => ({
        ...prev,
        type,
        options: [],
        correctAnswer: ''
      }));
    }
  }, []);

  const addQuestion = useCallback(() => {
    if (!currentQuestion.question) return;
    if (currentQuestion.type !== 'Text' && !currentQuestion.correctAnswer) return;

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion, id: Date.now() }]
    }));

    setCurrentQuestion({
      type: 'MCQ',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
  }, [currentQuestion]);

  const removeQuestion = useCallback((questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const quizData = {
      ...formData,
      questionsCount: formData.questions.length,
      id: isEdit ? parseInt(id) : Date.now(),
      createdAt: existingQuiz?.createdAt || new Date().toISOString()
    };
    onSave(quizData, isEdit);
    navigate('/');
  }, [formData, onSave, navigate, isEdit, id, existingQuiz]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Quizzes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Quiz' : 'Create New Quiz'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(QUIZ_CATEGORY).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(QUIZ_DIFFICULTY).map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="180"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Questions ({formData.questions.length})</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex gap-4 mb-4">
                {['MCQ', 'True/False', 'Text'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleQuestionTypeChange(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentQuestion.type === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <input
                    type="text"
                    name="question"
                    value={currentQuestion.question}
                    onChange={handleQuestionChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your question"
                  />
                </div>

                {currentQuestion.type === 'MCQ' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    {currentQuestion.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {currentQuestion.type !== 'Text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                    <select
                      name="correctAnswer"
                      value={currentQuestion.correctAnswer}
                      onChange={handleQuestionChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select correct answer</option>
                      {currentQuestion.options.map((option, index) => (
                        option && <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                    <input
                      type="number"
                      name="points"
                      value={currentQuestion.points}
                      onChange={handleQuestionChange}
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {formData.questions.length > 0 && (
              <div className="space-y-3">
                {formData.questions.map((q, index) => (
                  <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                            {q.type}
                          </span>
                          <span className="text-sm text-gray-600">{q.points} point{q.points > 1 ? 's' : ''}</span>
                        </div>
                        <p className="font-medium text-gray-900 mb-2">Q{index + 1}. {q.question}</p>
                        {q.type !== 'Text' && (
                          <div className="text-sm">
                            <p className="text-gray-600 mb-1">Options:</p>
                            <ul className="list-disc list-inside text-gray-700 mb-2">
                              {q.options.map((opt, i) => (
                                <li key={i} className={opt === q.correctAnswer ? 'text-green-600 font-medium' : ''}>
                                  {opt} {opt === q.correctAnswer && '✓'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end border-t pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.questions.length === 0}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isEdit ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

CreateEditQuiz.displayName = 'CreateEditQuiz';

export default CreateEditQuiz;
