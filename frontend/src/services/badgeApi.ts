export interface UserBadgeDto {
  badgeId: number;
  name: string;
  description: string;
  iconUrl: string;
  isUnlocked: boolean;
  unlockedAt?: string | null;
  currentValue: number;
  targetValue: number;
  progressPercentage: number;
}

export async function fetchUserBadges(): Promise<UserBadgeDto[]> {
  try {
    const response = await fetch('/api/badges/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch badges: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend API offline, returning fallback achievement badges:', error);
    return getFallbackBadges();
  }
}

export async function evaluateBadges(): Promise<UserBadgeDto[]> {
  try {
    const response = await fetch('/api/badges/evaluate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.newlyUnlockedBadges || [];
  } catch (error) {
    return [];
  }
}

function getFallbackBadges(): UserBadgeDto[] {
  return [
    {
      badgeId: 1,
      name: 'First Song Mastered',
      description: 'Completed your 1st piano lesson',
      iconUrl: '🎵',
      isUnlocked: true,
      unlockedAt: '2026-08-01T10:00:00Z',
      currentValue: 1,
      targetValue: 1,
      progressPercentage: 100
    },
    {
      badgeId: 2,
      name: 'Dedicated Learner',
      description: 'Complete 5 piano lessons',
      iconUrl: '🎓',
      isUnlocked: true,
      unlockedAt: '2026-08-04T15:30:00Z',
      currentValue: 5,
      targetValue: 5,
      progressPercentage: 100
    },
    {
      badgeId: 3,
      name: 'Practice Enthusiast',
      description: 'Log 300+ total practice minutes',
      iconUrl: '🎹',
      isUnlocked: true,
      unlockedAt: '2026-08-06T12:00:00Z',
      currentValue: 640,
      targetValue: 300,
      progressPercentage: 100
    },
    {
      badgeId: 4,
      name: 'Weekly Warrior',
      description: 'Maintain a 7-day practice streak',
      iconUrl: '🔥',
      isUnlocked: false,
      unlockedAt: null,
      currentValue: 5,
      targetValue: 7,
      progressPercentage: 71
    }
  ];
}
