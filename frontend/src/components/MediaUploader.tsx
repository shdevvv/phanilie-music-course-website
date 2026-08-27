import React, { useState, useRef } from 'react';
import { mediaApi, type MediaFileResponse } from '../services/mediaApi';

interface MediaUploaderProps {
  onUploadSuccess?: (result: MediaFileResponse) => void;
  entityType?: string;
  entityId?: number;
  accept?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadSuccess,
  entityType,
  entityId,
  accept = '.pdf,.png,.jpg,.jpeg,.mp3,.mp4'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<MediaFileResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(30);
    setError(null);

    const result = await mediaApi.uploadMedia(file, entityType, entityId);
    setProgress(100);
    setIsUploading(false);

    if (result) {
      setUploadedFile(result);
      if (onUploadSuccess) onUploadSuccess(result);
    } else {
      setError('Upload failed. Please check file format and ensure size is under 100MB.');
    }
  };

  return (
    <div className="w-full p-6 border-2 border-dashed border-[#e6ded6] rounded-2xl bg-[#faf7f2] text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f4ebe1] flex items-center justify-center text-[#996350]">
        <span className="material-symbols-outlined text-2xl">cloud_upload</span>
      </div>

      <h4 className="text-sm font-semibold text-[#3d251c] mb-1 font-serif">Upload Media Files</h4>
      <p className="text-xs text-[#81756f] mb-4">PDF scores, MP3 previews, MP4 videos, images up to 100MB</p>

      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="px-5 py-2 bg-[#dfa38f] text-white text-xs font-medium rounded-full hover:bg-[#b88673] transition-colors disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Choose File'}
      </button>

      {isUploading && (
        <div className="w-full bg-[#e6ded6] h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-[#dfa38f] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

      {uploadedFile && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left text-xs text-emerald-800">
          <p className="font-semibold mb-0.5">✓ Upload Complete</p>

          <p className="truncate">{uploadedFile.originalFileName} ({(uploadedFile.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)</p>
        </div>
      )}
    </div>
  );
};
