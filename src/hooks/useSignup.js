import { useContext, useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from '../api/api';
import { AuthContext } from '../context/AuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const { user, dispatch } = useAuthContext();
  const { isLoading, setIsLoading } = useContext(AuthContext)


  const signup = async (userlogin, password) => {
    setIsLoading(true);
    setError(null);
    if (user.role === "root") {
      try {
        const response = await axios.post('/user/register', {
          userlogin,
          password
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status !== 200) {
          setIsLoading(false);
          setError(response.data.error);
        } else {
          const json = response.data;

          // Save the user to local storage
          localStorage.setItem('user', JSON.stringify(json));

          // Update the auth context
          dispatch({ type: 'LOGIN', payload: json });

          // Update loading state
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setError('An error occurred during signup.');
      }
    } else {
      console.log("user root admin bolishi kerak")
    }

  };

  return { signup, isLoading, error };
};
