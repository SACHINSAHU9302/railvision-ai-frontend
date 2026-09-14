export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export type StatusType = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

export interface SearchFilterParams {
  query?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
