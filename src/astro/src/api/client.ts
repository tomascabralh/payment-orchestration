export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: RequestCache;
}

export interface ApiErrorData {
  message?: string;
  code?: string;
  [key: string]: unknown;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  data?: ApiErrorData;
}

export class ApiClient {
  private baseUrl: string;
  private defaultConfig: RequestConfig;
  private requestInterceptors: ((config: RequestConfig) => RequestConfig)[];
  private responseInterceptors: ((response: Response) => Promise<Response>)[];

  constructor(baseUrl: string = "", defaultConfig: RequestConfig = {}) {
    this.baseUrl = baseUrl;
    this.defaultConfig = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      cache: "no-store",
      ...defaultConfig,
    };
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(
    interceptor: (response: Response) => Promise<Response>
  ) {
    this.responseInterceptors.push(interceptor);
  }

  private async applyRequestInterceptors(
    config: RequestConfig
  ): Promise<RequestConfig> {
    let finalConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      finalConfig = interceptor(finalConfig);
    }
    return finalConfig;
  }

  private async applyResponseInterceptors(
    response: Response
  ): Promise<Response> {
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }
    return finalResponse;
  }

  private createError(
    message: string,
    status?: number,
    code?: string,
    data?: unknown
  ): ApiError {
    const error = new Error(message) as ApiError;
    error.status = status;
    error.code = code;
    error.data = data as ApiErrorData;
    return error;
  }

  private async handleResponse(response: Response): Promise<unknown> {
    const interceptedResponse = await this.applyResponseInterceptors(response);

    if (!interceptedResponse.ok) {
      let errorData;
      try {
        errorData = await interceptedResponse.json();
      } catch {
        errorData = { message: interceptedResponse.statusText };
      }

      throw this.createError(
        errorData.message || "Request failed",
        interceptedResponse.status,
        errorData.code,
        errorData
      );
    }

    try {
      const contentType = interceptedResponse.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return interceptedResponse.json();
      }
      return interceptedResponse.text();
    } catch (error) {
      throw this.createError(
        "Failed to parse response",
        response.status,
        "PARSE_ERROR",
        error
      );
    }
  }

  private async retryRequest(
    url: string,
    config: RequestConfig,
    attempt: number = 1
  ): Promise<Response> {
    try {
      const response = await fetch(url, config);
      if (response.ok || attempt >= (config.retries || 0)) {
        return response;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, (config.retryDelay || 1000) * attempt)
      );

      return this.retryRequest(url, config, attempt + 1);
    } catch (error) {
      if (attempt >= (config.retries || 0)) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, (config.retryDelay || 1000) * attempt)
      );

      return this.retryRequest(url, config, attempt + 1);
    }
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const finalConfig = await this.applyRequestInterceptors({
      ...this.defaultConfig,
      ...config,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout);

    try {
      const response = await this.retryRequest(url, {
        ...finalConfig,
        signal: controller.signal,
      });
      return this.handleResponse(response) as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw this.createError("Request timeout", 408, "TIMEOUT");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  post<T, D = unknown>(
    endpoint: string,
    data?: D,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });
  }

  put<T, D = unknown>(
    endpoint: string,
    data?: D,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });
  }

  delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}
