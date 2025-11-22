export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
