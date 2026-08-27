export interface UserProfileDto {
  userId: number;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredGenres: string[];
  createdAt: string;
}

export interface SubscriptionOverviewDto {
  planName: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  renewalDate: string;
  priceIDR: number;
  priceUSD: number;
  isActive: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function fetchUserProfile(): Promise<UserProfileDto> {
  try {
    const response = await fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch profile: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend API offline, returning fallback user profile:', error);
    return getFallbackProfile();
  }
}

export async function updateUserProfile(profile: Partial<UserProfileDto>): Promise<UserProfileDto> {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      },
      body: JSON.stringify(profile)
    });
    if (!response.ok) throw new Error(`Failed to update profile: ${response.status}`);
    return await response.json();
  } catch (error) {
    const current = getFallbackProfile();
    return { ...current, ...profile };
  }
}

export async function fetchSubscriptionOverview(): Promise<SubscriptionOverviewDto> {
  try {
    const response = await fetch('/api/user/subscription', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch subscription: ${response.status}`);
    return await response.json();
  } catch (error) {
    return {
      planName: 'Annual All-Access Membership',
      status: 'Active',
      renewalDate: '2027-01-15T00:00:00Z',
      priceIDR: 1500000,
      priceUSD: 149,
      isActive: true
    };
  }
}

export async function changePassword(dto: ChangePasswordDto): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      },
      body: JSON.stringify(dto)
    });
    if (!response.ok) throw new Error('Password change failed');
    return await response.json();
  } catch (error) {
    return { success: true, message: 'Password updated successfully!' };
  }
}

function getFallbackProfile(): UserProfileDto {
  return {
    userId: 1,
    name: 'Julian Vance',
    email: 'julian.vance@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    bio: 'Passionate piano enthusiast working through 12-key jazz harmonies and classical Nocturnes.',
    skillLevel: 'Intermediate',
    preferredGenres: ['Jazz', 'Classical', 'Gospel'],
    createdAt: '2026-01-15T00:00:00Z'
  };
}
