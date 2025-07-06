export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `API Error: ${response.status} ${response.statusText}`;
      throw new ApiError(errorMessage, response.status);
    }
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as unknown as T;
    }
    
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to the server. Please check your connection.', 0);
    }
    
    throw new ApiError('An unexpected error occurred', 500);
  }
}