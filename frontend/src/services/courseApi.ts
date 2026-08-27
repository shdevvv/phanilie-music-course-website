export interface LessonPublicDto {
  id: number;
  title: string;
  summary: string;
  durationMinutes: number;
  sequenceOrder: number;
}

export interface TopicDto {
  id: number;
  title: string;
  sequenceOrder: number;
  lessons: LessonPublicDto[];
}

export interface CourseTreeDto {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  thumbnailUrl: string;
  topics: TopicDto[];
}

export interface LessonMediaResponse {
  lessonId: number;
  videoStreamUrl: string;
  pdfDownloadUrl: string;
}

export async function fetchCourseTree(): Promise<CourseTreeDto[]> {
  try {
    const response = await fetch('/api/courses');
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API unavailable, using client fallback course data:', error);
    return getFallbackCourses();
  }
}

export async function fetchLessonMediaAccess(lessonId: number): Promise<LessonMediaResponse> {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    throw { status: 403, error: 'MembershipRequired', message: 'User must sign in and hold active subscription.' };
  }

  try {
    const response = await fetch(`/api/lessons/${lessonId}/media`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || 'demo-token'}`
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw { status: response.status, ...errData };
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

function getFallbackCourses(): CourseTreeDto[] {
  return [
    {
      id: 1,
      title: 'Gospel Chords & Progressive Voicings',
      level: 'Intermediate',
      description: 'Master 7th, 9th, and 13th chord substitutions for modern Gospel piano.',
      thumbnailUrl: '/coversheets/sheet1.png',
      topics: [
        {
          id: 10,
          title: 'Module 1: 7th Chord Substitutions',
          sequenceOrder: 1,
          lessons: [
            {
              id: 101,
              title: 'Major 7th & Minor 7th Smooth Voicings',
              summary: 'Learn smooth 2-5-1 voicings in key of C and F.',
              durationMinutes: 24,
              sequenceOrder: 1
            },
            {
              id: 102,
              title: 'Dominant 9th Tritone Substitutions',
              summary: 'Advanced gospel passing chords for worship transitions.',
              durationMinutes: 28,
              sequenceOrder: 2
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Beginner Jazz Piano Essentials',
      level: 'Beginner',
      description: 'Step-by-step foundation in swing rhythms, shell voicings, and lead sheet reading.',
      thumbnailUrl: '/coversheets/sheet2.png',
      topics: [
        {
          id: 20,
          title: 'Module 1: Left Hand Shell Voicings',
          sequenceOrder: 1,
          lessons: [
            {
              id: 201,
              title: 'Root-3rd-7th Shells in 12 Keys',
              summary: 'Building solid left-hand accompaniment patterns.',
              durationMinutes: 18,
              sequenceOrder: 1
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Classical Masterclass: Chopin & Beethoven',
      level: 'Advanced',
      description: 'Refine touch, rubato expression, and complex polyrhythms in romantic repertoire.',
      thumbnailUrl: '/coversheets/sheet3.png',
      topics: [
        {
          id: 30,
          title: 'Module 1: Moonlight Sonata 3rd Movement',
          sequenceOrder: 1,
          lessons: [
            {
              id: 301,
              title: 'Arpeggios at Presto Agitato Tempo',
              summary: 'Technical dexterity and wrist relaxation techniques.',
              durationMinutes: 35,
              sequenceOrder: 1
            }
          ]
        }
      ]
    }
  ];
}
