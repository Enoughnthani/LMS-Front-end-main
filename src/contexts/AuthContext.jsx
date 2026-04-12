// context/AuthContext.jsx - UPDATED to use apiFetch correctly
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useTopLoader } from './TopLoaderContext';
import {
  CHECK_AUTH,
  LOGIN,
  LOGOUT,
  ME,
  CREATE_ACCOUNT
} from '@/utils/apiEndpoint'


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { start, complete } = useTopLoader();

  const checkAuth = useCallback(async () => {
    try {
      const data = await apiFetch(CHECK_AUTH, {
        redirectErrors: false
      });

      if (data?.success) {
        const userData = await apiFetch(ME, {
          redirectErrors: false
        });
        setUser(userData?.payload);
        return { success: true, payload: userData?.payload };
      } else {
        setUser(null);
        return { success: false };
      }
    } catch (error) {
      setUser(null);
      return { success: false, message: error.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const data = await apiFetch(CHECK_AUTH, {
          redirectErrors: false
        });

        if (!data?.success) {
          setUser(null);
          navigate('/session_expired', { replace: true });
        }
      } catch {
        setUser(null);
        navigate('/session_expired', { replace: true });
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  
  const login = async ({ form }) => {
    start();

    try {
      const data = await apiFetch(LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
        redirectErrors: false
      });

      if (data?.success || data?.payload) {
        setUser(data?.payload || data);
      }

      return data;
    } catch (error) {
      return error.data || {
        success: false,
        message: "An error has occurred."
      };
    } finally {
      complete();
    }
  };

  const register = async ({ form }) => {
    start();

    try {
      const data = await apiFetch(CREATE_ACCOUNT, {
        method: "POST",
        body: form,
        redirectErrors: false
      });

      return data;
    } catch (error) {
      return error.data || {
        success: false,
        message: "An error has occurred."
      };
    } finally {
      complete();
    }
  };

  const logout = async () => {
    start();

    try {
      const resp = await apiFetch(LOGOUT, {
        method: 'POST',
        redirectErrors: false
      });

      document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "remember-me=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate('/', { replace: true });
    } catch (error) {
    } finally {
      setUser(null);
      navigate('/', { replace: true });
      complete();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      checkAuth,
      setUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};