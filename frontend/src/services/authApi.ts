export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  countryCode: string;
  currency: string;
  isSubscribed: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  countryCode?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
}

export interface GeoLocation {
  countryCode: string;
  countryName: string;
  currency: string;
}

export const authApi = {
  async signUp(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Network error during registration.' };
    }
  },

  async signIn(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Network error during login.' };
    }
  },

  async fetchGeoIp(): Promise<GeoLocation> {
    try {
      const res = await fetch('/api/auth/geoip');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('GeoIP fetch failed:', e);
    }
    return { countryCode: 'ID', countryName: 'Indonesia', currency: 'IDR' };
  },

  async refreshToken(): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' });
      return await res.json();
    } catch {
      return { success: false, message: 'Failed to refresh token.' };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Network error.' };
    }
  }
};
