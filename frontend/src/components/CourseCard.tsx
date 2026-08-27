import React from 'react';
import type { CourseTreeDto } from '../services/courseApi';

interface CourseCardProps {
  course: CourseTreeDto;
  isSelected: boolean;
  onSelectCourse: (course: CourseTreeDto) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isSelected, onSelectCourse }) => {
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Advanced':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalLessons = course.topics.reduce((acc, t) => acc + t.lessons.length, 0);

  return (
    <div
      onClick={() => onSelectCourse(course)}
      className={`relative group bg-white/80 backdrop-blur-md border rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'border-[#dfa38f] ring-2 ring-[#dfa38f]/30 scale-[1.01]'
          : 'border-[#dfa38f]/30 hover:border-[#dfa38f]/60'
      }`}
    >
      <div className="space-y-3">
        <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-br from-[#ffe5db] to-[#dfa38f]/20">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/pianogrand.jpg';
            }}
          />
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getBadgeColor(
              course.level
            )}`}
          >
            {course.level}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-display-sm text-lg font-bold text-[#4a372e] leading-snug group-hover:text-[#ab7e66] transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-[#8b7368] line-clamp-2 leading-relaxed">{course.description}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-[#dfa38f]/20 flex items-center justify-between text-xs text-[#6a564d] mt-4">
        <span className="flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-sm text-[#ab7e66]">menu_book</span>
          {course.topics.length} Modules • {totalLessons} Lessons
        </span>
        <span className="font-bold text-[#ab7e66] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
          View Curriculum <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </span>
      </div>
    </div>
  );
};
