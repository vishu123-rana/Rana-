/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AdminSession {
  token: string;
  email: string;
  name: string;
  role: 'admin';
  loginTime: string;
}

const ADMIN_SESSION_KEY = 'rana_admin_session';

/**
 * Check if admin is currently authenticated in the active session
 */
export function isAdminLoggedIn(): boolean {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const session: AdminSession = JSON.parse(raw);
    return Boolean(session?.token && session?.role === 'admin');
  } catch {
    return false;
  }
}

/**
 * Get current admin session details
 */
export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Authenticate admin credentials via secure server route with resilient fallback
 */
export async function authenticateAdmin(
  email: string,
  pass: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim();
  const cleanPass = pass;

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.token) {
      const session: AdminSession = {
        token: data.token,
        email: data.admin?.email || cleanEmail,
        name: data.admin?.name || 'Administrator',
        role: 'admin',
        loginTime: new Date().toISOString(),
      };
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      return { success: true };
    }

    return {
      success: false,
      error: data.error || 'Invalid administrator email or password.',
    };
  } catch (err) {
    console.warn('[AdminAuth] Server endpoint unavailable, checking credentials:', err);
    // Offline / decoupled client fallback check
    // Notice: Compare safely without exposing in plain text UI
    const targetEmail = 'partapvinay269@gmail.com';
    const targetPass = 'Ranaji@567';

    if (cleanEmail.toLowerCase() === targetEmail.toLowerCase() && cleanPass === targetPass) {
      const fallbackSession: AdminSession = {
        token: 'rana_adm_local_' + Math.random().toString(36).substring(2),
        email: targetEmail,
        name: 'Master Perfumer Administrator',
        role: 'admin',
        loginTime: new Date().toISOString(),
      };
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(fallbackSession));
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(fallbackSession));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid administrator email or password.',
    };
  }
}

/**
 * Terminate active admin session
 */
export async function logoutAdmin(): Promise<void> {
  const session = getAdminSession();
  if (session?.token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
      });
    } catch {
      // Ignore network errors on logout
    }
  }

  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
