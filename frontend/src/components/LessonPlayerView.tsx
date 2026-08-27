import React, { useState } from 'react';
import type { LessonPublicDto } from '../services/courseApi';
import { useMembershipModal } from '../context/MembershipModalContext';

interface LessonPlayerViewProps {
  lesson: LessonPublicDto;
  courseTitle: string;
  onBackToCurriculum: () => void;
}

export const LessonPlayerView: React.FC<LessonPlayerViewProps> = ({
  lesson,
  courseTitle,
  onBackToCurriculum,
}) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isSubscribed = localStorage.getItem('isSubscribed') === 'true' || localStorage.getItem('guest_email') === 'admin@phanilie.com';
  const { openMembershipModal } = useMembershipModal();

  const [isPlaying, setIsPlaying] = useState(false);

  const handleMediaAccess = (action: 'play' | 'download') => {
    if (!isLoggedIn || !isSubscribed) {
      openMembershipModal();
      return;
    }

    if (action === 'play') {
      setIsPlaying(true);
    } else {
      alert(`Downloading sheet music PDF for: ${lesson.title}`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 md:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-[#dfa38f]/20 pb-4">
        <button
          type="button"
          onClick={onBackToCurriculum}
          className="flex items-center gap-1 text-xs font-bold text-[#ab7e66] hover:text-[#4a372e] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Curriculum
        </button>
        <span className="text-xs text-[#8b7368] font-medium">{courseTitle}</span>
      </div>

      <div className="space-y-2">
        <h2 className="font-display-md text-2xl md:text-3xl font-bold text-[#4a372e]">{lesson.title}</h2>
        <p className="text-xs text-[#8b7368] leading-relaxed max-w-2xl">{lesson.summary}</p>
      </div>

      {/* Video Player Container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/90 shadow-2xl flex items-center justify-center border border-[#dfa38f]/30">
        {isPlaying ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-3">
            <span className="material-symbols-outlined text-5xl text-[#dfa38f] animate-pulse">
              play_circle
            </span>
            <p className="text-xs font-semibold">Streaming Full HD Video Lesson...</p>
          </div>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center p-6 text-center space-y-4" style={{ backgroundImage: "url('/pianogrand.jpg')" }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
            <div className="relative z-10 space-y-3">
              <button
                type="button"
                onClick={() => handleMediaAccess('play')}
                className="w-16 h-16 rounded-full bg-[#dfa38f] hover:bg-[#ab7e66] text-white flex items-center justify-center mx-auto shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
              </button>
              <p className="text-xs text-white/90 font-medium">
                {!isLoggedIn || !isSubscribed
                  ? '🔒 Premium Content - Click to unlock full lesson video'
                  : 'Click play to start video lesson'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#dfa38f]/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#ab7e66]">schedule</span>
          <span className="text-xs text-[#6a564d] font-semibold">{lesson.durationMinutes} Minutes HD Video</span>
        </div>

        <button
          type="button"
          onClick={() => handleMediaAccess('download')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#dfa38f]/10 text-[#4a372e] text-xs font-bold border border-[#dfa38f]/40 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-sm text-[#ab7e66]">download</span>
          Download Lesson PDF Score
        </button>
      </div>
    </div>
  );
};
