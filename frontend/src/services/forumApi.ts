export interface ForumThreadDto {
  id: number;
  authorName: string;
  avatarUrl: string;
  title: string;
  category: string;
  content: string;
  upvotes: number;
  repliesCount: number;
  createdAt: string;
  isUpvoted: boolean;
}

export interface ForumReplyDto {
  id: number;
  threadId: number;
  authorName: string;
  avatarUrl: string;
  content: string;
  upvotes: number;
  createdAt: string;
}

export interface CreateThreadDto {
  title: string;
  category: string;
  content: string;
}

export interface CreateReplyDto {
  content: string;
}

export async function fetchForumThreads(category?: string): Promise<ForumThreadDto[]> {
  try {
    const url = category && category !== 'All' ? `/api/forum/threads?category=${encodeURIComponent(category)}` : '/api/forum/threads';
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch threads: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend API offline, returning fallback forum threads:', error);
    return getFallbackThreads(category);
  }
}

export async function createForumThread(dto: CreateThreadDto): Promise<ForumThreadDto> {
  try {
    const response = await fetch('/api/forum/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      },
      body: JSON.stringify(dto)
    });
    if (!response.ok) throw new Error(`Failed to create thread: ${response.status}`);
    return await response.json();
  } catch (error) {
    return {
      id: Date.now(),
      authorName: 'You (Student)',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      title: dto.title,
      category: dto.category,
      content: dto.content,
      upvotes: 1,
      repliesCount: 0,
      createdAt: new Date().toISOString(),
      isUpvoted: true
    };
  }
}

export async function upvoteThread(threadId: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/forum/threads/${threadId}/upvote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });
    return response.ok;
  } catch (error) {
    return true;
  }
}

export async function reportThread(threadId: number, reason: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/forum/threads/${threadId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      },
      body: JSON.stringify({ reason })
    });
    return response.ok;
  } catch (error) {
    return true;
  }
}

function getFallbackThreads(category?: string): ForumThreadDto[] {
  const threads: ForumThreadDto[] = [
    {
      id: 1,
      authorName: 'Marcus Sterling',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      title: 'Best exercises for 4th and 5th finger independence?',
      category: 'Technique',
      content: 'I am struggling with weak 4th finger movement when playing Hanon Ex. 1 at faster tempos. Any recommended stretching or slow practice drills?',
      upvotes: 14,
      repliesCount: 5,
      createdAt: '2026-08-05T14:20:00Z',
      isUpvoted: false
    },
    {
      id: 2,
      authorName: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      title: 'Chopin Nocturne Op. 9 No. 2 - Rubato Advice',
      category: 'Repertoire',
      content: 'How do you balance steady left-hand accompaniment rhythm with expressive right-hand rubato phrasing?',
      upvotes: 22,
      repliesCount: 8,
      createdAt: '2026-08-04T09:15:00Z',
      isUpvoted: true
    },
    {
      id: 3,
      authorName: 'David Miller',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      title: 'Yamaha P-125 vs Roland FP-30X for home practice?',
      category: 'Equipment',
      content: 'Looking to upgrade from a synth-action keyboard to a weighted 88-key digital piano under $800.',
      upvotes: 9,
      repliesCount: 3,
      createdAt: '2026-08-03T18:45:00Z',
      isUpvoted: false
    }
  ];

  if (category && category !== 'All') {
    return threads.filter(t => t.category === category);
  }
  return threads;
}
