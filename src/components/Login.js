import { memo, useState, useCallback } from 'react';

const users = {
  admin: { username: 'admin', password: 'admin', role: 'ADMIN' },
  user: { username: 'user', password: 'user', role: 'PUBLIC' }
};

const Login = memo(({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const user = users[formData.username];
    
    if (user && user.password === formData.password) {
      onLogin(user.role, user.username);
    } else {
      setError('Invalid username or password');
    }
  }, [formData, onLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Management</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 font-medium">Demo Credentials:</p>
          <div className="space-y-2 text-xs">
            <div className="bg-gray-50 px-3 py-2 rounded-lg">
              <span className="font-semibold text-gray-700">Admin:</span>
              <span className="text-gray-600 ml-2">username: admin, password: admin</span>
            </div>
            <div className="bg-gray-50 px-3 py-2 rounded-lg">
              <span className="font-semibold text-gray-700">User:</span>
              <span className="text-gray-600 ml-2">username: user, password: user</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Login.displayName = 'Login';

export default Login;
