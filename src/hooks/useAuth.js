import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('userRole');
    return stored || null;
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const login = useCallback((role, user) => {
    setCurrentUser(role);
    setUsername(user);
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUsername('');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    // Clear all quiz-related session storage on logout
    sessionStorage.clear();
  }, []);

  return { currentUser, username, login, logout };
};
