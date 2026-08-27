import React from 'react';
import type { ForumThreadDto } from '../services/forumApi';

interface ForumThreadCardProps {
  thread: ForumThreadDto;
  onUpvote: (id: number) => void;
  onReport: (thread: ForumThreadDto) => void;
}

export const ForumThreadCard: React.FC<ForumThreadCardProps> = ({ thread, onUpvote, onReport }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={thread.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={thread.authorName}
            className="w-10 h-10 rounded-full object-cover border border-[#dfa38f]/30 shadow-xs"
          />
          <div>
            <h4 className="font-bold text-xs text-[#4a372e]">{thread.authorName}</h4>
            <span className="text-[10px] text-[#8b7368]">{new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#dfa38f]/15 text-[#854d38] border border-[#dfa38f]/30 text-[10px] font-extrabold uppercase tracking-wider">
            {thread.category}
          </span>
          <button
            type="button"
            onClick={() => onReport(thread)}
            className="text-gray-400 hover:text-rose-600 transition-colors p-1"
            title="Report Post"
          >
            <span className="material-symbols-outlined text-base">flag</span>
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-display-sm text-base font-bold text-[#4a372e] hover:text-[#dfa38f] transition-colors cursor-pointer">
          {thread.title}
        </h3>
        <p className="text-xs text-[#6e5a51] leading-relaxed line-clamp-3">{thread.content}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#dfa38f]/20 text-xs">
        <button
          type="button"
          onClick={() => onUpvote(thread.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-semibold ${
            thread.isUpvoted
              ? 'bg-[#dfa38f] text-white border-[#dfa38f] shadow-xs'
              : 'bg-white text-[#6a564d] border-[#dfa38f]/30 hover:bg-[#ffe5db]/40'
          }`}
        >
          <span className="material-symbols-outlined text-base">thumb_up</span>
          <span>{thread.upvotes}</span>
        </button>

        <div className="flex items-center gap-1.5 text-[#8b7368] font-medium text-[11px]">
          <span className="material-symbols-outlined text-base">chat_bubble_outline</span>
          <span>{thread.repliesCount} Replies</span>
        </div>
      </div>
    </div>
  );
};
