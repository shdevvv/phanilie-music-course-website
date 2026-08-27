import { useState, useEffect } from 'react';
import { ForumThreadCard } from './components/ForumThreadCard';
import { CreateThreadModal } from './components/CreateThreadModal';
import { ReportThreadModal } from './components/ReportThreadModal';
import { fetchForumThreads, createForumThread, upvoteThread, reportThread, type ForumThreadDto, type CreateThreadDto } from './services/forumApi';

interface ForumsProps {
  onNavigate?: (view: 'home' | 'dashboard' | 'library' | 'courses' | 'sessions' | 'forums') => void;
}

export default function Forums({ onNavigate: _onNavigate }: ForumsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [threads, setThreads] = useState<ForumThreadDto[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reportingThread, setReportingThread] = useState<ForumThreadDto | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const categories = ['All', 'Technique', 'Repertoire', 'Equipment', 'General'];

  useEffect(() => {
    fetchForumThreads(selectedCategory).then(data => setThreads(data));
  }, [selectedCategory]);

  const handleCreateThread = async (dto: CreateThreadDto) => {
    const newThread = await createForumThread(dto);
    setThreads([newThread, ...threads]);
    showAlert('Your discussion topic has been published!');
  };

  const handleUpvote = (threadId: number) => {
    upvoteThread(threadId);
    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          const nextIsUpvoted = !t.isUpvoted;
          return {
            ...t,
            isUpvoted: nextIsUpvoted,
            upvotes: nextIsUpvoted ? t.upvotes + 1 : t.upvotes - 1
          };
        }
        return t;
      })
    );
  };

  const handleReportSubmit = (reason: string) => {
    if (!reportingThread) return;
    reportThread(reportingThread.id, reason);
    showAlert(`Thank you for flagging "${reportingThread.title}". Our team will review it.`);
    setReportingThread(null);
  };

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 5000);
  };

  return (
    <main className="pt-16 pb-24 flex-grow relative overflow-hidden bg-[#eedcd5]">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#dfa38f]/15 text-[#854d38] text-[10px] font-extrabold uppercase tracking-wider border border-[#dfa38f]/30">
              Community Forum
            </span>
            <h1 className="font-display-lg text-2xl font-bold text-[#4a372e] mt-1">Piano Discussion Channels</h1>
            <p className="text-xs text-[#8b7368]">Ask questions, exchange repertoire tips, and connect with fellow piano learners.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ backgroundImage: 'linear-gradient(135deg, #dfa38f 0%, #ab7e66 100%)' }}
            className="px-6 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_comment</span>
            Start Discussion
          </button>
        </div>

        {/* Global Alert Notification */}
        {alertMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            {alertMessage}
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#dfa38f]/20">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#dfa38f] text-white shadow-md'
                  : 'bg-white/70 text-[#6a564d] hover:bg-[#ffe5db]/40 border border-[#dfa38f]/20'
              }`}
            >
              {cat} Channels
            </button>
          ))}
        </div>

        {/* Thread Feed Grid */}
        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed border-[#dfa38f]/40">
              <span className="material-symbols-outlined text-4xl text-[#dfa38f]">forum</span>
              <p className="text-sm font-semibold text-[#6e5a51] mt-2">No discussion threads found in this channel.</p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-3 px-4 py-2 text-xs font-bold text-[#dfa38f] hover:underline"
              >
                Be the first to post a question!
              </button>
            </div>
          ) : (
            threads.map((t) => (
              <ForumThreadCard
                key={t.id}
                thread={t}
                onUpvote={handleUpvote}
                onReport={(thread) => setReportingThread(thread)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateThread}
      />

      <ReportThreadModal
        isOpen={!!reportingThread}
        onClose={() => setReportingThread(null)}
        onSubmit={handleReportSubmit}
      />
    </main>
  );
}
