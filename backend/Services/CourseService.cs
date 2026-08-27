using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CourseTreeDto>> GetPublicCourseTreeAsync()
        {
            var courses = await _context.Courses
                .AsNoTracking()
                .Include(c => c.Topics)
                    .ThenInclude(t => t.Lessons)
                .ToListAsync();

            if (!courses.Any())
            {
                return GetFallbackCourseTree();
            }

            return courses.Select(c => new CourseTreeDto
            {
                Id = c.Id,
                Title = c.Title,
                Level = c.Level,
                Description = c.Description,
                ThumbnailUrl = c.ThumbnailUrl,
                Topics = c.Topics.OrderBy(t => t.DisplayOrder).Select(t => new TopicDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    SequenceOrder = t.DisplayOrder,
                    Lessons = t.Lessons.OrderBy(l => l.DisplayOrder).Select(l => new LessonPublicDto
                    {
                        Id = l.Id,
                        Title = l.Title,
                        Summary = l.Description,
                        DurationMinutes = l.DurationMinutes,
                        SequenceOrder = l.DisplayOrder
                    }).ToList()
                }).ToList()
            }).ToList();
        }

        public async Task<LessonMediaResponseDto?> GetLessonMediaAccessAsync(int lessonId, int userId)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null || !user.IsSubscribed)
            {
                return null; // Paywall guard rejection
            }

            var lesson = await _context.Lessons.AsNoTracking().FirstOrDefaultAsync(l => l.Id == lessonId);
            if (lesson == null) return null;

            return new LessonMediaResponseDto
            {
                LessonId = lesson.Id,
                VideoStreamUrl = string.IsNullOrEmpty(lesson.VideoUrl) ? "/demo-video.mp4" : lesson.VideoUrl,
                PdfDownloadUrl = string.IsNullOrEmpty(lesson.PdfUrl) ? "/demo-sheet.pdf" : lesson.PdfUrl
            };
        }

        private List<CourseTreeDto> GetFallbackCourseTree()
        {
            return new List<CourseTreeDto>
            {
                new CourseTreeDto
                {
                    Id = 1,
                    Title = "Gospel Chords & Progressive Voicings",
                    Level = "Intermediate",
                    Description = "Master 7th, 9th, and 13th chord substitutions for modern Gospel piano.",
                    ThumbnailUrl = "/coversheets/sheet1.png",
                    Topics = new List<TopicDto>
                    {
                        new TopicDto
                        {
                            Id = 10,
                            Title = "Module 1: 7th Chord Substitutions",
                            SequenceOrder = 1,
                            Lessons = new List<LessonPublicDto>
                            {
                                new LessonPublicDto
                                {
                                    Id = 101,
                                    Title = "Major 7th & Minor 7th Smooth Voicings",
                                    Summary = "Mastering smooth 2-5-1 voicings in key of C and F.",
                                    DurationMinutes = 24,
                                    SequenceOrder = 1
                                },
                                new LessonPublicDto
                                {
                                    Id = 102,
                                    Title = "Dominant 9th Tritone Substitutions",
                                    Summary = "Advanced gospel passing chords for worship transitions.",
                                    DurationMinutes = 28,
                                    SequenceOrder = 2
                                }
                            }
                        }
                    }
                },
                new CourseTreeDto
                {
                    Id = 2,
                    Title = "Beginner Jazz Piano Essentials",
                    Level = "Beginner",
                    Description = "Step-by-step foundation in swing rhythms, shell voicings, and lead sheet reading.",
                    ThumbnailUrl = "/coversheets/sheet2.png",
                    Topics = new List<TopicDto>
                    {
                        new TopicDto
                        {
                            Id = 20,
                            Title = "Module 1: Left Hand Shell Voicings",
                            SequenceOrder = 1,
                            Lessons = new List<LessonPublicDto>
                            {
                                new LessonPublicDto
                                {
                                    Id = 201,
                                    Title = "Root-3rd-7th Shells in 12 Keys",
                                    Summary = "Building solid left-hand accompaniment patterns.",
                                    DurationMinutes = 18,
                                    SequenceOrder = 1
                                }
                            }
                        }
                    }
                },
                new CourseTreeDto
                {
                    Id = 3,
                    Title = "Classical Masterclass: Chopin & Beethoven",
                    Level = "Advanced",
                    Description = "Refine touch, rubato expression, and complex polyrhythms in romantic repertoire.",
                    ThumbnailUrl = "/coversheets/sheet3.png",
                    Topics = new List<TopicDto>
                    {
                        new TopicDto
                        {
                            Id = 30,
                            Title = "Module 1: Moonlight Sonata 3rd Movement",
                            SequenceOrder = 1,
                            Lessons = new List<LessonPublicDto>
                            {
                                new LessonPublicDto
                                {
                                    Id = 301,
                                    Title = "Arpeggios at Presto Agitato Tempo",
                                    Summary = "Technical dexterity and wrist relaxation techniques.",
                                    DurationMinutes = 35,
                                    SequenceOrder = 1
                                }
                            }
                        }
                    }
                }
            };
        }
    }
}
