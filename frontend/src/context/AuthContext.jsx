import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, signupApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an existing user session on mount
    const storedUser = localStorage.getItem('chatAppUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      // Assuming response contains user details. Adjust based on your actual backend response schema.
      // If your backend returns a token, you should store it here too (e.g., localStorage.setItem('token', response.access_token))
      const userData = response.user || { email }; // Fallback if backend just returns success
      setUser(userData);
      localStorage.setItem('chatAppUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await signupApi(name, email, password);
      // Automatically log in after signup (adjust based on what the API returns)
      const userData = response.user || { name, email }; 
      setUser(userData);
      localStorage.setItem('chatAppUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatAppUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

