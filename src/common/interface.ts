export interface QredResponse {
  status: string;
  message: string;
  data: Record<string, any> | Record<string, any>[] | null;
}

export interface PageDtoConfig {
  search: string;
  page: number;
  limit: number;
}
