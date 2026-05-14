import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { API_URL } from '../constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  isDemo: boolean;
  activateDemo: () => void;
  loginWithGoogle: (userData: any, token: string) => User;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const demoUser: User = { id: 'demo', username: 'Demo User', email: 'demo@trackify.com', role: 'user' };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('trackify_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Stop silently defaulting to 'user' if role is missing
      return parsed as User;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('trackify_token');
    } catch {
      return null;
    }
  });

  const [isDemo, setIsDemo] = useState(false);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user) {
      localStorage.setItem('trackify_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trackify_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('trackify_token', token);
    } else {
      localStorage.removeItem('trackify_token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log("RAW BACKEND RESPONSE:", data);

    if (res.status === 423) {
      // Account locked — throw a typed error the UI can distinguish
      const err = new Error(data.message || 'Account temporarily locked.');
      (err as any).isLocked = true;
      throw err;
    }
    if (!res.ok) throw new Error(data.message || 'Login failed');

    const username = data.user?.username || data.user?.name || email.split('@')[0];
    
    const newUser: User = {
      id: String(data.user.id),
      username: username,
      email: data.user.email,
      role: data.user.role 
    };

    setUser(newUser);
    setToken(data.token);
    setIsDemo(false);
    return newUser;
  };

  const loginWithGoogle = (userData: any, googleToken: string) => {
    const username = userData?.username || userData?.name || 'User';
    const newUser: User = {
      id: String(userData.id),
      username: username,
      email: userData.email,
      role: userData.role
    };
    setUser(newUser);
    setToken(googleToken);
    setIsDemo(false);
    return newUser;
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Register failed');

    return await login(email, password);
  };

  const logout = async () => {
    // End session on backend
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.log('Logout endpoint error (non-critical):', e);
      }
    }
    setUser(null);
    setToken(null);
    setIsDemo(false);
    localStorage.removeItem('trackify_user');
    localStorage.removeItem('trackify_token');
  };

  const activateDemo = () => {
    setIsDemo(true);
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isDemo, activateDemo, loginWithGoogle, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
