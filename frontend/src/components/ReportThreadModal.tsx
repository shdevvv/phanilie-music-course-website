import React, { useState } from 'react';

interface ReportThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export const ReportThreadModal: React.FC<ReportThreadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('Spam');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-rose-200">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-rose-800 text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600">flag</span>
            Report Discussion Post
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Reason for Reporting</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-white text-gray-800"
            >
              <option value="Spam">Spam or Unsolicited Promotion</option>
              <option value="Harassment">Harassment or Offensive Language</option>
              <option value="Inappropriate">Inappropriate Content</option>
              <option value="Off-topic">Off-topic Discussion</option>
            </select>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            Our moderation team will review this post against community guidelines. Thank you for keeping our forum safe and encouraging.
          </p>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
          >
            Submit Flag Report
          </button>
        </form>
      </div>
    </div>
  );
};
