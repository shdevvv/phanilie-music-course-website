import React, { useState } from 'react';
import type { CourseTreeDto, LessonPublicDto } from '../services/courseApi';

interface CurriculumTreeProps {
  course: CourseTreeDto;
  onSelectLesson: (lesson: LessonPublicDto) => void;
}

export const CurriculumTree: React.FC<CurriculumTreeProps> = ({ course, onSelectLesson }) => {
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(course.topics[0]?.id || null);

  const toggleTopic = (id: number) => {
    setExpandedTopicId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="space-y-2 border-b border-[#dfa38f]/20 pb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-[#dfa38f]/15 text-[#8a6858] text-[10px] font-bold uppercase tracking-wider border border-[#dfa38f]/20">
          Curriculum Outline
        </span>
        <h2 className="font-display-md text-2xl font-bold text-[#4a372e]">{course.title}</h2>
        <p className="text-xs text-[#8b7368] leading-relaxed">{course.description}</p>
      </div>

      <div className="space-y-3">
        {course.topics.map((topic) => {
          const isExpanded = expandedTopicId === topic.id;

          return (
            <div key={topic.id} className="border border-[#dfa38f]/30 rounded-xl overflow-hidden bg-white/50">
              <button
                type="button"
                onClick={() => toggleTopic(topic.id)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#dfa38f]/10 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#dfa38f]/20 text-[#6a564d] text-xs font-bold flex items-center justify-center">
                    {topic.sequenceOrder}
                  </span>
                  <h3 className="font-bold text-sm text-[#4a372e]">{topic.title}</h3>
                </div>
                <span className="material-symbols-outlined text-base text-[#ab7e66] transition-transform duration-300">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isExpanded && (
                <div className="p-4 pt-1 border-t border-[#dfa38f]/20 bg-white/30 space-y-2">
                  {topic.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className="p-3 rounded-xl hover:bg-[#dfa38f]/15 transition-all flex items-center justify-between border border-transparent hover:border-[#dfa38f]/30 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg text-[#ab7e66] group-hover:scale-110 transition-transform">
                          play_circle
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-[#4a372e] group-hover:text-[#ab7e66] transition-colors">
                            {lesson.title}
                          </h4>
                          <p className="text-[10px] text-[#8b7368]">{lesson.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] font-semibold text-[#8b7368]">
                          {lesson.durationMinutes} mins
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-rose-100/80 text-rose-800 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-rose-200">
                          <span className="material-symbols-outlined text-xs">lock</span>
                          Premium
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
