import { PaginationResponse } from "../request/pagination-request";

export class StandardResponse<T = any> {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly data: T | null = null,
    public readonly statusCode: number = 200,
    public readonly pagination?: PaginationResponse,
    public readonly timestamp: string = new Date().toISOString(),
    public readonly path?: string,
  ) {}


  toJSON() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
      statusCode: this.statusCode,
      pagination: this.pagination,
      timestamp: this.timestamp,
      path: this.path,
    };
  }
  static ok<T>(message: string, data: T | null = null, path?: string): StandardResponse<T> {
    return new StandardResponse<T>(true, message, data, 200, undefined, new Date().toISOString(), path);
  }

  static fail(message: string, path?: string, data: any = null): StandardResponse {
    return new StandardResponse(false, message, data, 400, undefined, new Date().toISOString(), path);
  }

  static withPagination<T>(
    message: string,
    data: T[],
    paginationRequest: { page: number; size: number },
    total: number,
    path?: string,
  ): StandardResponse<T[]> {
    const pagination = new PaginationResponse(
      paginationRequest.page,
      Array.isArray(data) ? data.length : 0,
      total,
      Math.ceil(total / paginationRequest.size) || 1,
    );
    return new StandardResponse<T[]>(true, message, data, 200, pagination, new Date().toISOString(), path);
  }
}
