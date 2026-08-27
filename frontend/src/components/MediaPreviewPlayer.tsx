import React from 'react';

interface MediaPreviewPlayerProps {
  src: string;
  mimeType: string;
  title?: string;
}

export const MediaPreviewPlayer: React.FC<MediaPreviewPlayerProps> = ({ src, mimeType, title }) => {
  if (mimeType.startsWith('image/')) {
    return (
      <div className="rounded-xl overflow-hidden border border-[#e6ded6] bg-[#faf7f2] p-2">
        <img src={src} alt={title || 'Media Preview'} className="w-full max-h-64 object-contain rounded-lg" />
      </div>
    );
  }

  if (mimeType.startsWith('audio/') || mimeType === 'audio/mpeg') {
    return (
      <div className="p-4 rounded-xl border border-[#e6ded6] bg-[#faf7f2]">
        {title && <p className="text-xs font-semibold text-[#3d251c] mb-2">{title}</p>}
        <audio controls src={src} className="w-full h-8" />
      </div>
    );
  }

  if (mimeType.startsWith('video/') || mimeType === 'video/mp4') {
    return (
      <div className="rounded-xl overflow-hidden border border-[#e6ded6] bg-black max-h-80">
        <video controls src={src} className="w-full h-full object-contain" />
      </div>
    );
  }

  if (mimeType === 'application/pdf') {
    return (
      <div className="p-4 rounded-xl border border-[#e6ded6] bg-[#faf7f2] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>
          <div>
            <p className="text-xs font-semibold text-[#3d251c]">{title || 'PDF Document'}</p>
            <p className="text-[10px] text-[#81756f]">Protected PDF Score</p>
          </div>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 bg-[#dfa38f] text-white text-xs font-medium rounded-full hover:bg-[#b88673] transition-colors"
        >
          View PDF
        </a>
      </div>
    );
  }

  return (
    <div className="p-3 bg-[#faf7f2] border border-[#e6ded6] rounded-xl text-xs text-[#81756f]">
      File Preview: {title || src}
    </div>
  );
};
