export interface MediaFileResponse {
  fileId: string;
  originalFileName: string;
  publicUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  storageProvider: string;
  createdAt: string;
}

export interface SignedTokenResponse {
  fileId: string;
  token: string;
  expiresAt: string;
  streamUrl: string;
}

export const mediaApi = {
  async uploadMedia(file: File, entityType?: string, entityId?: number): Promise<MediaFileResponse | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (entityType) formData.append('entityType', entityType);
      if (entityId) formData.append('entityId', entityId.toString());

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('Upload media error:', e);
    }
    return null;
  },

  async getSignedToken(fileId: string): Promise<SignedTokenResponse | null> {
    try {
      const res = await fetch(`/api/media/token/${fileId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Fetch signed token error:', e);
    }
    return null;
  },

  async attachMedia(fileId: string, entityType: string, entityId: number): Promise<boolean> {
    try {
      const res = await fetch('/api/media/attach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, entityType, entityId })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
