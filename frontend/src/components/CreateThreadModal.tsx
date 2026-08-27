import React, { useState } from 'react';
import type { CreateThreadDto } from '../services/forumApi';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateThreadDto) => void;
}

export const CreateThreadModal: React.FC<CreateThreadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technique');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, category, content });
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-[#dfa38f]/30">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-[#4a372e] text-lg">Start New Discussion</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#6a564d]">Discussion Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to maintain relaxation during fast octave runs?"
              className="w-full mt-1 p-2.5 border rounded-xl text-xs text-[#4a372e]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#6a564d]">Channel Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-white text-[#4a372e]"
            >
              <option value="Technique">Technique</option>
              <option value="Repertoire">Repertoire</option>
              <option value="Equipment">Equipment</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#6a564d]">Discussion Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide details about your question or topic..."
              className="w-full mt-1 p-2.5 border rounded-xl text-xs text-[#4a372e]"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            style={{ backgroundImage: 'linear-gradient(135deg, #dfa38f 0%, #ab7e66 100%)' }}
            className="w-full py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            Publish Discussion
          </button>
        </form>
      </div>
    </div>
  );
};
