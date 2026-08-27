import { useState, useEffect } from "react";
import { levels as localLevels } from "./courseData";
import type { Level } from "./courseData";
import { initialCompletedSeed } from "./accomplishmentHelper";
import { fetchCourseTree } from "./services/courseApi";

function Courses() {
  const [dbLevels, setDbLevels] = useState<Level[]>(localLevels);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ title: string; topicTitle: string; levelNumber: number } | null>(null);

  useEffect(() => {
    fetchCourseTree().then(courses => {
      if (courses && courses.length > 0) {
        const mappedLevels: Level[] = courses.map(c => ({
          number: c.id,
          title: c.title,
          subtitle: c.description,
          topics: c.topics.map(t => ({
            title: t.title,
            lessons: t.lessons.map(l => ({
              title: l.title
            }))
          }))
        }));
        setDbLevels(mappedLevels);
      }
    }).catch(err => console.error("Error loading DB courses:", err));
  }, []);

  // Saved for Later state
  const [savedItems, setSavedItems] = useState<{ id: string; type: 'pdf' | 'video'; title: string; meta: string }[]>(() => {
    try {
      const saved = localStorage.getItem('saved_later_items')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('saved_later_items', JSON.stringify(savedItems))
    window.dispatchEvent(new Event('storage'))
  }, [savedItems])

  // Sync state from other tabs/views
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('saved_later_items')
        if (saved) {
          setSavedItems(prev => {
            if (JSON.stringify(prev) === saved) return prev
            return JSON.parse(saved)
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
    window.addEventListener('storage', handleSync)
    return () => window.removeEventListener('storage', handleSync)
  }, [])

  const toggleSaveLater = (type: 'pdf' | 'video', item: { id: string; title: string; meta: string }, e: React.MouseEvent) => {
    e.stopPropagation()
    const exists = savedItems.some(s => s.id === item.id)
    if (exists) {
      setSavedItems(savedItems.filter(s => s.id !== item.id))
    } else {
      setSavedItems([...savedItems, { ...item, type }])
    }
  }

  const isSavedLater = (id: string) => savedItems.some(s => s.id === id)

  const [completedLessons, setCompletedLessons] = useState<{ title: string; day: string }[]>(() => {
    try {
      const saved = localStorage.getItem('completed_lessons')
      return saved ? JSON.parse(saved) : initialCompletedSeed
    } catch {
      return initialCompletedSeed
    }
  })

  useEffect(() => {
    localStorage.setItem('completed_lessons', JSON.stringify(completedLessons))
    window.dispatchEvent(new Event('storage'))
  }, [completedLessons])

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('completed_lessons')
        if (saved) {
          setCompletedLessons(prev => {
            if (JSON.stringify(prev) === saved) return prev
            return JSON.parse(saved)
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
    window.addEventListener('storage', handleSync)
    return () => window.removeEventListener('storage', handleSync)
  }, [])

  const toggleLessonCompleted = (title: string) => {
    const exists = completedLessons.some(c => c.title === title)
    if (exists) {
      setCompletedLessons(completedLessons.filter(c => c.title !== title))
    } else {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
      const currentDay = days[new Date().getDay()]
      setCompletedLessons([...completedLessons, { title, day: currentDay }])
    }
  }

  const isLessonCompleted = (title: string) => {
    return completedLessons.some(c => c.title === title)
  }

  useEffect(() => {
    const targetLevel = localStorage.getItem('redirect_level');
    const targetTopic = localStorage.getItem('redirect_topic');
    const targetLesson = localStorage.getItem('redirect_lesson');
    const targetPdf = localStorage.getItem('redirect_course_pdf');
    
    if (targetLevel) {
      const lvlNum = Number(targetLevel);
      setSelectedLevel(lvlNum);
      localStorage.removeItem('redirect_level');
      
      const targetLvl = dbLevels.find(l => l.number === lvlNum);
      if (targetLvl && targetTopic) {
        const topicIdx = targetLvl.topics.findIndex(t => t.title === targetTopic);
        if (topicIdx !== -1) {
          setExpandedTopic(`${lvlNum}-${topicIdx}`);
        }
        localStorage.removeItem('redirect_topic');
      }
      
      if (targetLesson && targetTopic) {
        setActiveVideo({
          title: targetLesson,
          topicTitle: targetTopic,
          levelNumber: lvlNum
        });
        localStorage.removeItem('redirect_lesson');
      }
    } else if (targetPdf) {
      const cleanTopicTitle = targetPdf.replace(' — Complete PDF', '');
      for (const lvl of dbLevels) {
        const topicIdx = lvl.topics.findIndex(t => t.title === cleanTopicTitle);
        if (topicIdx !== -1) {
          setSelectedLevel(lvl.number);
          setExpandedTopic(`${lvl.number}-${topicIdx}`);
          break;
        }
      }
      localStorage.removeItem('redirect_course_pdf');
    } else if (targetLesson) {
      let found = false;
      for (const lvl of dbLevels) {
        for (let topicIdx = 0; topicIdx < lvl.topics.length; topicIdx++) {
          const topic = lvl.topics[topicIdx];
          const lessonMatch = topic.lessons.find(l => l.title === targetLesson);
          if (lessonMatch) {
            setSelectedLevel(lvl.number);
            setExpandedTopic(`${lvl.number}-${topicIdx}`);
            setActiveVideo({
              title: lessonMatch.title,
              topicTitle: topic.title,
              levelNumber: lvl.number
            });
            found = true;
            break;
          }
        }
        if (found) break;
      }
      localStorage.removeItem('redirect_lesson');
    }
  }, []);

  const activeLevel = dbLevels.find((l) => l.number === selectedLevel);

  const getTotalLessons = (level: Level) =>
    level.topics.reduce((sum, t) => sum + t.lessons.length, 0);

  const handleSelectLevel = (num: number) => {
    setSelectedLevel(num);
    setExpandedTopic(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const levelIcons: Record<number, string> = {
    1: "piano",
    2: "keyboard",
    3: "queue_music",
    4: "edit_document",
    5: "layers",
    6: "album",
    7: "keyboard",
    8: "grid_view",
    9: "groups",
    10: "piano",
    11: "theater_comedy",
    12: "school",
  };

  return (
    <main
      className="pt-8 flex-grow flex flex-col"
      style={{
        backgroundImage: `url('/elegant-pastel.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* ── Level Grid ── */}
      {!selectedLevel && (
        <section className="px-6 max-w-[1200px] mx-auto w-full mb-8">
          {/* Header area matching mockup */}
          <div className="relative w-full pt-16 pb-10">
            <h1
              className="text-[#7c5a4d] leading-none mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 600,
              }}
            >
              All 12 Levels
            </h1>

            <p
              className="text-[#6b544b] text-base max-w-xl leading-relaxed"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              New lessons and topics are added regularly.
            </p>
          </div>

          {/* Level cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 pt-4">
            {dbLevels.map((level) => {
              const totalLessons = getTotalLessons(level);
              return (
                <div
                  key={level.number}
                  onClick={() => handleSelectLevel(level.number)}
                  className="relative group flex flex-col items-center p-4 pb-5 rounded-[20px] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(94,74,65,0.1)] transition-all duration-300 cursor-pointer text-center"
                  style={{
                    border: '2px solid transparent',
                    background: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) padding-box, linear-gradient(135deg, #8b7368 0%, #dfa38f 30%, #ffd0ab 60%, #f5b8c9 100%) border-box`,
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.7), 0 8px 20px rgba(61, 37, 28, 0.04)',
                    minHeight: '190px'
                  }}
                >
                  {/* Level number */}
                  <span
                    className="text-[17px] font-bold text-[#c89482] mb-0.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {String(level.number).padStart(2, "0")}
                  </span>

                  {/* Diamond separator */}
                  <span className="text-[#c89482]/50 text-[9px] mb-2.5">✦</span>

                  {/* Circular icon */}
                  <div className="w-[50px] h-[50px] rounded-full border border-[#e8cdc1]/40 flex items-center justify-center bg-white/40 mb-3 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[#8a6858] text-[22px]">
                      {levelIcons[level.number] || "music_note"}
                    </span>
                  </div>

                  {/* Subtitle */}
                  <h3
                    className="text-[12.5px] font-bold text-[#3d251c] mb-2.5 min-h-[36px] flex items-center justify-center leading-snug px-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {level.subtitle}
                  </h3>

                  {/* Bottom info section */}
                  <div className="w-full border-t border-[#e8cdc1]/20 my-1.5"></div>
                  <div className="flex flex-col gap-0.5 text-[10.5px] text-[#81756f] mt-auto">
                    <span>{level.topics.length} Topics</span>
                    <span className="font-semibold text-[#6e5a51]">{totalLessons} Lessons</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Selected Level Detail ── */}
      {selectedLevel && activeLevel && (
        <section className="px-6 max-w-[1200px] mx-auto w-full mb-16 pt-8">
          {/* Level Header & Stats Box */}
          <div className="bg-white/85 backdrop-blur-md border border-white/50 rounded-[24px] p-6 md:p-8 mb-8 shadow-sm max-w-[860px] mx-auto">
            {/* Top Row: Title & Subtitle + Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2
                  className="text-[#3d251c] mb-1"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.55rem",
                    fontWeight: 700,
                  }}
                >
                  Level {selectedLevel}
                </h2>
                <p
                  className="text-[#6b544b] text-base"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                >
                  {activeLevel.subtitle}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedLevel(null);
                  setExpandedTopic(null);
                }}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold text-[#3d251c] bg-white/80 backdrop-blur-md border border-[#8a6858]/40 hover:bg-[#fcf8f6] transition-all cursor-pointer shadow-sm w-fit"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
                All 12 Levels
              </button>
            </div>

            {/* Divider Line */}
            <div className="h-[1px] bg-[#8a6858]/20 my-5 w-full"></div>

            {/* Bottom Row: Stats Bar */}
            <div
              className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#3d251c] font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[#8a6858]"
                  style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
                >
                  topic
                </span>
                <span className="font-bold">{activeLevel.topics.length}</span> Topics
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[#8a6858]"
                  style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
                >
                  play_circle
                </span>
                <span className="font-bold">
                  {getTotalLessons(activeLevel)}
                </span>{" "}
                Video Lessons
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[#8a6858]"
                  style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
                >
                  picture_as_pdf
                </span>
                <span className="font-bold">{activeLevel.topics.length}</span> PDF Downloads
              </div>
            </div>
          </div>

          {/* Topics list */}
          <div className="space-y-3 max-w-[860px] mx-auto">
            {activeLevel.topics.map((topic, topicIdx) => {
              const topicKey = `${activeLevel.number}-${topicIdx}`;
              const isExpanded = expandedTopic === topicKey;

              return (
                <div
                  key={topicKey}
                  className="bg-white/85 backdrop-blur-md border border-[#e8cdc1]/30 rounded-[18px] overflow-hidden transition-all duration-300"
                >
                  {/* Topic header */}
                  <button
                    onClick={() =>
                      setExpandedTopic(isExpanded ? null : topicKey)
                    }
                    className="w-full flex items-center gap-4 p-5 text-left bg-transparent border-none cursor-pointer hover:bg-[#f9f2f0]/50 transition-colors"
                  >
                    <span
                      className="text-base font-bold text-[#8a6858] shrink-0 w-7"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {String(topicIdx + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-grow min-w-0">
                      <h3
                        className="text-[#3d251c] truncate"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.05rem",
                          fontWeight: 700,
                        }}
                      >
                        {topic.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {/* Lesson count */}
                      <span className="flex items-center gap-1 bg-[#8a6858]/15 text-[#3d251c] text-xs font-bold px-2.5 py-1 rounded-full">
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "13px",
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          play_circle
                        </span>
                        {topic.lessons.length}
                      </span>

                      {/* PDF badge */}
                      <span className="flex items-center gap-1 bg-[#8a6858]/10 text-[#3d251c] text-xs font-bold px-2.5 py-1 rounded-full">
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "13px",
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          picture_as_pdf
                        </span>
                        PDF
                      </span>

                      {/* Expand arrow */}
                      <span
                        className="material-symbols-outlined text-[#4e3629] transition-transform duration-300"
                        style={{
                          fontSize: "20px",
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        expand_more
                      </span>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-[#e8cdc1]/20 bg-[#faf6f4]/50">
                      {/* PDF download bar */}
                      <div className="flex items-center justify-between px-5 py-2.5 bg-[#6e5a51]/5 border-b border-[#e8cdc1]/15">
                        <div className="flex items-center gap-2">
                          <span
                            className="material-symbols-outlined text-[#6e5a51]"
                            style={{
                              fontSize: "18px",
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            picture_as_pdf
                          </span>
                          <span
                            className="text-xs font-semibold text-[#6e5a51]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {topic.title} — Complete PDF
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => toggleSaveLater('pdf', { id: `pdf-${topic.title}`, title: `${topic.title} — Complete PDF`, meta: 'PDF Material • 1.5MB' }, e)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[#e8cdc1]/30 hover:border-[#ab7e66] hover:bg-[#faf6f4] text-[#6e5a51] cursor-pointer transition-all border-none"
                            title="Save for Later"
                          >
                            <span 
                              className="material-symbols-outlined text-base" 
                              style={isSavedLater(`pdf-${topic.title}`) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                              bookmark
                            </span>
                          </button>
                          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-br from-[#e8cdc1] to-[#f9ddd1] text-[#6a564d] text-xs font-bold rounded-lg hover:shadow-md active:scale-95 transition-all border-none cursor-pointer">
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "14px" }}
                            >
                              download
                            </span>
                            Download
                          </button>
                        </div>
                      </div>

                      <div className="px-5 py-2">
                        {topic.lessons.map((lesson, lessonIdx) => (
                          <div
                            key={lessonIdx}
                            className="py-2.5 border-b border-[#e8cdc1]/10 last:border-b-0 hover:bg-[#8a6858]/5 rounded-lg px-2 transition-all group"
                          >
                            <div className="flex items-center justify-between w-full">
                              {(!lesson.subItems || lesson.subItems.length === 0) && activeLevel ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleLessonCompleted(`${activeLevel.number}-${topic.title}-${lesson.title}`)
                                  }}
                                  className="w-6 h-6 rounded-full border border-[#8a6858]/40 hover:border-[#8a6858] flex items-center justify-center transition-colors cursor-pointer bg-transparent mr-2 shrink-0"
                                  title="Toggle Completion"
                                >
                                  {isLessonCompleted(`${activeLevel.number}-${topic.title}-${lesson.title}`) ? (
                                    <div 
                                      className="w-5 h-5 rounded-full flex items-center justify-center shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),0_2.5px_6px_rgba(133,91,76,0.35)] transition-transform duration-200"
                                      style={{
                                        backgroundImage: "linear-gradient(135deg, #e4a794 0%, #b88673 50%, #7a5446 100%)",
                                        border: "1px solid rgba(255, 255, 255, 0.4)"
                                      }}
                                    >
                                      <span className="material-symbols-outlined text-white text-[12px] font-black select-none pointer-events-none">
                                        check
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-[#ab7e66]/40 hover:border-[#ab7e66] bg-white/30 shadow-inner transition-all"></div>
                                  )}
                                </button>
                              ) : null}
                              <div 
                                className="flex items-center gap-3 flex-grow min-w-0 cursor-pointer" 
                                onClick={() => activeLevel && setActiveVideo({ title: lesson.title, topicTitle: topic.title, levelNumber: activeLevel.number })}
                              >
                                <span className="text-xs font-mono font-bold text-[#d2c3bd] w-5 text-right shrink-0">
                                  {String(lessonIdx + 1).padStart(2, "0")}
                                </span>
                                <span
                                  className="material-symbols-outlined text-[#8a6858] group-hover:scale-110 transition-transform shrink-0"
                                  style={{
                                    fontSize: "18px",
                                    fontVariationSettings: "'FILL' 1",
                                  }}
                                >
                                  play_circle
                                </span>
                                <span
                                  className="flex-grow text-sm text-[#4f4540] group-hover:text-[#3d251c] transition-colors truncate"
                                  style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                  {lesson.title}
                                </span>
                              </div>
                              <button
                                onClick={(e) => activeLevel && toggleSaveLater('video', { id: `video-${lesson.title}`, title: lesson.title, meta: `Video Lesson • Level ${activeLevel.number}` }, e)}
                                className="w-8 h-8 rounded-lg bg-transparent hover:bg-[#e8cdc1]/20 text-[#6e5a51] hover:text-[#3d251c] flex items-center justify-center transition-colors border-none cursor-pointer shrink-0 ml-2"
                                title="Save for Later"
                              >
                                <span 
                                  className="material-symbols-outlined text-base animate-in fade-in" 
                                  style={isSavedLater(`video-${lesson.title}`) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                >
                                  bookmark
                                </span>
                              </button>
                            </div>

                            {/* Sub-items (for Level 2 style lessons) */}
                            {lesson.subItems && lesson.subItems.length > 0 && (
                              <div className="ml-10 mt-2 space-y-1">
                                {lesson.subItems.map((item, i) => {
                                  const itemKey = activeLevel ? `${activeLevel.number}-${topic.title}-${lesson.title}-${item}` : ''
                                  return (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2 group/sub py-0.5"
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          if (itemKey) toggleLessonCompleted(itemKey)
                                        }}
                                        className="w-5 h-5 rounded-full border border-[#8a6858]/30 hover:border-[#8a6858] flex items-center justify-center transition-colors cursor-pointer bg-transparent shrink-0"
                                        title="Toggle Completion"
                                      >
                                        {isLessonCompleted(itemKey) ? (
                                          <div 
                                            className="w-4 h-4 rounded-full flex items-center justify-center shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.7),0_2px_5px_rgba(133,91,76,0.35)]"
                                            style={{
                                              backgroundImage: "linear-gradient(135deg, #e4a794 0%, #b88673 50%, #7a5446 100%)",
                                              border: "1px solid rgba(255, 255, 255, 0.4)"
                                            }}
                                          >
                                            <span className="material-symbols-outlined text-white text-[10px] font-black select-none pointer-events-none">
                                              check
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="w-3.5 h-3.5 rounded-full border border-[#ab7e66]/40 hover:border-[#ab7e66] bg-white/30 transition-all"></div>
                                        )}
                                      </button>
                                      <span
                                        className="text-xs text-[#81756f] group-hover/sub:text-[#3d251c] transition-colors"
                                        style={{
                                          fontFamily: "'Inter', sans-serif",
                                        }}
                                      >
                                        {item}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#fffcf9] rounded-[24px] border border-[#e8cdc1]/40 overflow-hidden w-full max-w-[720px] shadow-2xl animate-fade-in relative z-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8cdc1]/20">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8a6858]">
                  Level {activeVideo.levelNumber} • {activeVideo.topicTitle}
                </span>
                <h4 className="text-[#3d251c] font-bold text-sm md:text-base leading-tight mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {activeVideo.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1] text-[#6e5a51] border-none cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
              </button>
            </div>

            {/* Video Area (Simulated Premium Player) */}
            <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
              {/* Poster Image */}
              <img
                src="/glowing-3d-piano-keys.png"
                alt="Video Poster"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient overlay for controls contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30"></div>

              {/* Large Floating Play Button */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white/35 transition-all duration-300 cursor-pointer">
                <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </div>

              {/* Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 bg-gradient-to-t from-black/90 to-transparent">
                {/* Progress bar */}
                <div className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer group/progress">
                  <div className="absolute top-0 left-0 w-1/4 h-full bg-[#e8cdc1] rounded-full"></div>
                  <div className="absolute top-1/2 left-1/4 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md scale-0 group-hover/progress:scale-100 transition-transform"></div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between text-white text-[11px] font-sans">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#e8cdc1]" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#e8cdc1]" style={{ fontSize: "18px" }}>volume_up</span>
                    <span>03:14 / 12:45</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#e8cdc1]" style={{ fontSize: "18px" }}>settings</span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#e8cdc1]" style={{ fontSize: "18px" }}>fullscreen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Info */}
            <div className="p-5 bg-[#fcf8f6] text-[11px] text-[#81756f] flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#8a6858]" style={{ fontSize: "18px" }}>info</span>
              <span>Ini adalah simulasi pemutar video pembelajaran Phanilie Music Course.</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Courses;
