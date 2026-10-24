/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from '../types';

const USERS_STORAGE_KEY = 'rana_users';
const CURRENT_USER_STORAGE_KEY = 'rana_current_user';

// Seed demo user if storage is empty
const DEFAULT_DEMO_USER: User = {
  id: 'usr_demo_01',
  name: 'Arjun Sharma',
  email: 'arjun@example.com',
  password: 'Password123!',
  phone: '+91 98765 43210',
  createdAt: new Date().toISOString(),
};

/**
 * Retrieve all registered user accounts from Local Storage
 */
export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Initialize with demo user for easy testing
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
      return [DEFAULT_DEMO_USER];
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading users from local storage:', error);
    return [DEFAULT_DEMO_USER];
  }
}

/**
 * Get active logged-in user from Local Storage session
 */
export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error reading current user session:', error);
    return null;
  }
}

/**
 * Set active user session in Local Storage
 */
export function setCurrentUser(user: User | null): void {
  try {
    if (user) {
      // Omit password from active session object for security
      const safeUser = { ...user };
      delete safeUser.password;
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error saving current user session:', error);
  }
}

/**
 * Register a new user account and persist to Local Storage
 */
export function registerUser(
  name: string,
  email: string,
  password: string,
  phone?: string
): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please log in instead.',
    };
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: phone?.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    return { success: false, error: 'Failed to save account to local storage.' };
  }

  // Set active session
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

/**
 * Validate user login credentials against Local Storage
 */
export function validateLogin(
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: 'No account found with this email address. Please check or sign up.',
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please try again.',
    };
  }

  // Login successful - set active session
  setCurrentUser(user);

  return { success: true, user };
}

/**
 * Log out current active session
 */
export function logoutUser(): void {
  setCurrentUser(null);
}
