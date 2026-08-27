import { useState, useEffect } from "react";
import { levels } from "./courseData";
import { PracticeTimerWidget } from "./components/PracticeTimerWidget";
import { PracticeStreakWidget } from "./components/PracticeStreakWidget";
import { fetchPracticeStreak, createPracticeLog, type PracticeStreakDto } from "./services/practiceLogApi";

interface PracticeLogItem {
  id: string;
  studentName: string;
  avatar: string;
  date: string;
  levelNumber: number;
  levelTitle: string;
  topicTitle: string;
  lessonTitle: string;
  notes: string;
}

interface PracticeLogProps {
  onNavigate?: (
    view: "home" | "dashboard" | "library" | "courses" | "sessions",
  ) => void;
}

function PracticeLog({ onNavigate: _onNavigate }: PracticeLogProps) {
  const [streakData, setStreakData] = useState<PracticeStreakDto>({
    currentStreakDays: 5,
    longestStreakDays: 14,
    totalPracticeMinutes: 640,
    weeklyDays: [true, true, true, true, true, false, false],
  });

  useEffect(() => {
    fetchPracticeStreak().then((data) => setStreakData(data));
  }, []);

  const [practiceLogs, setPracticeLogs] = useState<PracticeLogItem[]>([
    {
      id: "1",
      studentName: "Marcus Sterling",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      date: "2026-07-14",
      levelNumber: 1,
      levelTitle: "Level 1: Piano Foundations",
      topicTitle: "Beginner Songs",
      lessonTitle: "Ode to Joy (Jazz Style)",
      notes: "Practiced swing feel and pedal timing.",
    },
    {
      id: "2",
      studentName: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      date: "2026-07-12",
      levelNumber: 2,
      levelTitle: "Level 2: The Complete 12-Key System",
      topicTitle: "Chord Inversions",
      lessonTitle: "Triad Inversions",
      notes: "Worked on smooth voice leading in C Major.",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevelNumber, setSelectedLevelNumber] = useState(1);
  const [selectedTopicTitle, setSelectedTopicTitle] = useState("Piano Basics");
  const [selectedLessonTitle, setSelectedLessonTitle] = useState("Introduction to the Piano");
  const [practiceDate, _setPracticeDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [practiceNotes, setPracticeNotes] = useState("");
  const [systemAlert, setSystemAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [currentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(practiceLogs.length / itemsPerPage);
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedLogs = practiceLogs.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage);

  const selectedLevel = levels.find((l) => l.number === selectedLevelNumber);
  const availableTopics = selectedLevel ? selectedLevel.topics : [];
  const selectedTopic = availableTopics.find((t) => t.title === selectedTopicTitle);
  const availableLessons = selectedTopic ? selectedTopic.lessons : [];

  const handleLevelChange = (levelNum: number) => {
    setSelectedLevelNumber(levelNum);
    const lvl = levels.find((l) => l.number === levelNum);
    if (lvl && lvl.topics.length > 0) {
      setSelectedTopicTitle(lvl.topics[0].title);
      setSelectedLessonTitle(lvl.topics[0].lessons[0]?.title || "");
    }
  };

  const handleTopicChange = (title: string) => {
    setSelectedTopicTitle(title);
    const topic = availableTopics.find((t) => t.title === title);
    if (topic && topic.lessons.length > 0) {
      setSelectedLessonTitle(topic.lessons[0].title);
    }
  };

  const handleTimerSave = (mins: number) => {
    createPracticeLog({
      durationMinutes: mins,
      focusTitle: selectedLessonTitle || "Piano Practice Session",
      category: "Repertoire",
      notes: "Logged via Live Stopwatch Timer",
    });
    setStreakData((prev) => ({
      ...prev,
      currentStreakDays: prev.currentStreakDays + 1,
      totalPracticeMinutes: prev.totalPracticeMinutes + mins,
    }));
  };

  const handleLogPracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!practiceNotes.trim()) return;

    const lvlObj = levels.find((l) => l.number === selectedLevelNumber);
    const newLog: PracticeLogItem = {
      id: Date.now().toString(),
      studentName: "You (Student)",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      date: practiceDate,
      levelNumber: selectedLevelNumber,
      levelTitle: lvlObj ? `${lvlObj.title}: ${lvlObj.subtitle}` : `Level ${selectedLevelNumber}`,
      topicTitle: selectedTopicTitle,
      lessonTitle: selectedLessonTitle,
      notes: practiceNotes,
    };

    setPracticeLogs([newLog, ...practiceLogs]);
    setPracticeNotes("");
    setIsModalOpen(false);
    setSystemAlert({ type: "success", message: "Your practice session has been logged successfully!" });
    setTimeout(() => setSystemAlert(null), 5000);
  };

  return (
    <main className="pt-16 pb-24 flex-grow relative overflow-hidden bg-[#eedcd5]">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 space-y-8">
        {systemAlert && (
          <div className="p-4 rounded-[6px] border bg-[#faf6f4] border-[#dfa38f]/40 text-[#6e5a51] flex items-start gap-3 shadow-sm">
            <span className="material-symbols-outlined shrink-0 text-base text-[#dfa38f]">check_circle</span>
            <div className="text-xs font-semibold">{systemAlert.message}</div>
          </div>
        )}

        <div className="space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PracticeStreakWidget streak={streakData} />
            <PracticeTimerWidget onSaveSession={handleTimerSave} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#dfa38f] text-2xl">music_note</span>
                <h2 className="font-display-lg text-lg font-extrabold text-[#4a372e] tracking-wide uppercase">
                  Practice Logs Board
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-[#fbece7] hover:bg-[#f6dad0] text-[#785b4f] border border-[#dfa38f]/30 rounded-[4px] font-bold uppercase tracking-wider text-[10px] shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Log a Practice Session
              </button>
            </div>

            <div className="bg-[#fffcfb]/80 backdrop-blur-xl border-2 border-[#dfa38f]/40 p-6 rounded-2xl space-y-4 shadow-lg">
              {paginatedLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between gap-4 py-3.5 border-b border-[#dfa38f]/20">
                  <div className="flex items-center gap-3 w-44 shrink-0">
                    <img className="w-9 h-9 rounded-full object-cover" alt={log.studentName} src={log.avatar} />
                    <div>
                      <div className="font-bold text-[#4a372e] text-xs">{log.studentName}</div>
                      <div className="text-[9px] text-[#8a6858]">{log.date}</div>
                    </div>
                  </div>
                  <div className="flex-grow space-y-1">
                    <span className="bg-[#dfa38f]/10 border border-[#dfa38f]/20 text-[#854d38] px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">
                      Level {log.levelNumber}
                    </span>
                    <span className="text-[10px] text-[#8a6858] font-bold ml-2">
                      {log.topicTitle} &bull; {log.lessonTitle}
                    </span>
                    <p className="text-xs text-[#4a372e]">{log.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-[#dfa38f]/30">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[#4a372e]">Log Manual Practice Session</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleLogPracticeSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#6a564d]">Level</label>
                <select
                  value={selectedLevelNumber}
                  onChange={(e) => handleLevelChange(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded text-xs bg-white text-[#4a372e]"
                >
                  {levels.map((lvl) => (
                    <option key={lvl.number} value={lvl.number}>
                      Level {lvl.number}: {lvl.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6a564d]">Topic</label>
                <select
                  value={selectedTopicTitle}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  className="w-full mt-1 p-2 border rounded text-xs bg-white text-[#4a372e]"
                >
                  {availableTopics.map((t) => (
                    <option key={t.title} value={t.title}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6a564d]">Lesson</label>
                <select
                  value={selectedLessonTitle}
                  onChange={(e) => setSelectedLessonTitle(e.target.value)}
                  className="w-full mt-1 p-2 border rounded text-xs bg-white text-[#4a372e]"
                >
                  {availableLessons.map((l) => (
                    <option key={l.title} value={l.title}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6a564d]">Practice Notes</label>
                <textarea
                  value={practiceNotes}
                  onChange={(e) => setPracticeNotes(e.target.value)}
                  placeholder="What did you work on today?"
                  className="w-full mt-1 p-2 border rounded text-xs text-[#4a372e]"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#dfa38f] hover:bg-[#ab7e66] text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
              >
                Submit Practice Log
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default PracticeLog;
