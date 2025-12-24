
import { User } from '../types';

const SESSION_KEY = 'fit_session';
const USERS_KEY = 'fit_users';

export const getSession = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

export const login = (email: string, pass: string): User | null => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find((u: any) => u.email === email && u.password === pass);
  if (user) {
    const { password, ...safeUser } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return safeUser;
  }
  return null;
};

export const register = (userData: any): User => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9) };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  const { password, ...safeUser } = newUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};
