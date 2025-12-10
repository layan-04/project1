import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://project1-3-ow0y.onrender.com/api/user/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        setError(json.error);
        setIsLoading(false);
        return false; // signup failed
      } else {
        // Save user in localStorage & update AuthContext
        localStorage.setItem('user', JSON.stringify(json));
        dispatch({ type: 'LOGIN', payload: json });
        setIsLoading(false);
        return true; // signup succeeded
      }
    } catch (err) {
      console.error('Signup request error:', err);
      setError('Failed to sign up. Try again.');
      setIsLoading(false);
      return false;
    }
  };

  return { signup, isLoading, error };
};
