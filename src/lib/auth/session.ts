// src/lib/auth/session.ts
// This file is a placeholder for the future backend integration.
// In production, your backend sets `rohobot_session` as an HttpOnly cookie.
// The frontend should NEVER store JWT tokens or passwords in localStorage.

export type UserRole = "candidate" | "employer" | "admin";

export interface AuthSession {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  mfaEnabled: boolean;
}

export const sessionService = {
  // Called after successful backend login
  // The backend handles the actual cookie setting (HttpOnly, Secure, SameSite=Strict)
  login: async (email: string, password: string, role: UserRole): Promise<{ success: boolean, requiresMFA?: boolean }> => {
    // Simulation: In reality this is a POST to /api/auth/login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ADMIN requires MFA
    if (role === "admin") {
      return { success: true, requiresMFA: true };
    }
    return { success: true };
  },

  // Verify MFA code (for privileged accounts)
  verifyMFA: async (code: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulation: code "123456" is accepted
    return { success: code === "123456" };
  },

  // Logout clears the HttpOnly cookie server-side
  logout: async (): Promise<void> => {
    // This is a POST to /api/auth/logout which clears the cookie
    console.log("Session terminated by backend.");
  },

  // Read current session (in real life, the backend returns this via /api/auth/me)
  getSession: async (): Promise<AuthSession | null> => {
    return null; // Placeholder
  }
};