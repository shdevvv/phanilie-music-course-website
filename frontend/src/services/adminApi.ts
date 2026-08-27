export interface PagedRequest {
  page?: number;
  pageSize?: number;
  query?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  activeSubscribers: number;
  totalSheetMusic: number;
  totalCourses: number;
  totalRevenueIDR: number;
  totalRevenueUSD: number;
  pendingInquiries: number;
}

export interface AdminSheetMusic {
  id: number;
  title: string;
  composer: string;
  instrument: string;
  difficulty: string;
  priceIDR: number;
  priceUSD: number;
  coverImageUrl: string;
  audioPreviewUrl: string;
  pdfFilePath: string;
  isArchived: boolean;
}

export interface AdminCourse {
  id: number;
  title: string;
  description: string;
  level: string;
  thumbnailUrl: string;
  displayOrder: number;
  isArchived: boolean;
  topicCount: number;
  lessonCount: number;
}

export interface AdminOrderAudit {
  id: number;
  orderNumber: string;
  userEmail: string;
  itemTitle: string;
  amount: number;
  currency: string;
  gateway: string;
  transactionId: string;
  status: string;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  countryCode: string;
  currency: string;
  isSubscribed: boolean;
}

export interface AdminInquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export const adminApi = {
  async getDashboardSummary(): Promise<AdminDashboardSummary | null> {
    try {
      const res = await fetch('/api/admin/dashboard/summary');
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Fetch admin summary error:', e);
    }
    return null;
  },

  async getSheetMusic(params?: PagedRequest): Promise<PagedResult<AdminSheetMusic>> {
    try {
      const queryStr = new URLSearchParams({
        page: (params?.page || 1).toString(),
        pageSize: (params?.pageSize || 10).toString(),
        query: params?.query || ''
      }).toString();
      const res = await fetch(`/api/admin/sheet-music?${queryStr}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Fetch admin sheet music error:', e);
    }
    return { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 };
  },

  async saveSheetMusic(item: Partial<AdminSheetMusic>): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/sheet-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async archiveSheetMusic(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/sheet-music/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getCourses(params?: PagedRequest): Promise<PagedResult<AdminCourse>> {
    try {
      const queryStr = new URLSearchParams({
        page: (params?.page || 1).toString(),
        pageSize: (params?.pageSize || 10).toString(),
        query: params?.query || ''
      }).toString();
      const res = await fetch(`/api/admin/courses?${queryStr}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Fetch admin courses error:', e);
    }
    return { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 };
  },

  async saveCourse(course: Partial<AdminCourse>): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async archiveCourse(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getOrders(params?: PagedRequest): Promise<PagedResult<AdminOrderAudit>> {
    try {
      const queryStr = new URLSearchParams({
        page: (params?.page || 1).toString(),
        pageSize: (params?.pageSize || 10).toString(),
        query: params?.query || ''
      }).toString();
      const res = await fetch(`/api/admin/orders?${queryStr}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Fetch admin orders error:', e);
    }
    return { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 };
  },

  async getUsers(params?: PagedRequest): Promise<PagedResult<AdminUser>> {
    try {
      const queryStr = new URLSearchParams({
        page: (params?.page || 1).toString(),
        pageSize: (params?.pageSize || 10).toString(),
        query: params?.query || ''
      }).toString();
      const res = await fetch(`/api/admin/users?${queryStr}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Fetch admin users error:', e);
    }
    return { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 };
  },

  async updateUserRole(userId: number, role: string, isSubscribed: boolean): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, isSubscribed })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getInquiries(params?: PagedRequest): Promise<PagedResult<AdminInquiry>> {
    try {
      const queryStr = new URLSearchParams({
        page: (params?.page || 1).toString(),
        pageSize: (params?.pageSize || 10).toString(),
        query: params?.query || ''
      }).toString();
      const res = await fetch(`/api/admin/inquiries?${queryStr}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Fetch admin inquiries error:', e);
    }
    return { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 };
  },

  async updateInquiryStatus(id: number, status: string, notes?: string): Promise<boolean> {
    try {
      const queryStr = new URLSearchParams({ status, notes: notes || '' }).toString();
      const res = await fetch(`/api/admin/inquiries/${id}?${queryStr}`, { method: 'PUT' });
      return res.ok;
    } catch {
      return false;
    }
  }
};
