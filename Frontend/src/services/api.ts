// In ai_pills/frontend/client_nextjs/src/services/api.ts

// Base URL for the API.
// In a real application, this should come from an environment variable.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Gets the authentication token from localStorage.
 * @returns {string | null} The access token or null if not found.
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
    return localStorage.getItem('accessToken');
  }
  return null;
};

/**
 * Creates an Authorization header object if a token exists.
 * @returns {Record<string, string>} An object containing the Authorization header or an empty object.
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getAccessToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Generic fetch client
interface FetchClientOptions extends RequestInit {
  includeAuthHeader?: boolean;
  // queryParams?: Record<string, string>; // For future use if building URLs with query params
}

/**
 * A generic wrapper around fetch for making API calls.
 * Automatically includes Authorization header if a token is available (and includeAuthHeader is true).
 * Parses JSON response and throws an error if response is not ok, extracting FastAPI error detail.
 *
 * @template T The expected type of the JSON response.
 * @param {string} endpoint The API endpoint (e.g., "/users/me").
 * @param {FetchClientOptions} options Fetch options (method, body, custom headers, etc.).
 * @returns {Promise<T>} A promise that resolves with the JSON response data.
 * @throws {Error} Throws an error if the network request fails or if the API returns a non-ok status.
 */
export async function fetchClient<T>(
  endpoint: string,
  options: FetchClientOptions = {}
): Promise<T> {
  const { includeAuthHeader = true, body, headers: customHeaders, ...restOptions } = options;

  let headers: HeadersInit = { ...(customHeaders || {}) }; // Initialize with custom headers or empty object

  // Set Content-Type to application/json if body exists, is not FormData, and Content-Type isn't already set
  if (body && !(body instanceof FormData) && !headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
  }

  if (includeAuthHeader) {
    headers = { ...headers, ...getAuthHeader() };
  }

  // Prepare body: stringify if it's an object and not FormData
  let processedBody = body;
  if (body && typeof body === 'object' && !(body instanceof FormData) && headers['Content-Type'] === 'application/json') {
    processedBody = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers,
    body: processedBody,
  });

  // Try to parse JSON response for both ok and error cases, as FastAPI often returns JSON error details
  let responseData;
  try {
    responseData = await response.json();
  } catch (e) {
    // If response is not JSON (e.g., 204 No Content or plain text error)
    if (!response.ok) {
        // For non-JSON error responses, use the status text or a generic message
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText || '(No error detail)'}`);
    }
    // If response is ok but not JSON (e.g. 204), return as is (or handle as needed)
    // For a typed function, this might be an issue if T is not void/null.
    // For now, assuming successful non-JSON responses are handled by caller or T allows null/undefined.
    return null as T; // Or handle based on expected T for non-JSON success
  }


  if (!response.ok) {
    // Try to extract detail from FastAPI error response structure
    const errorDetail = responseData?.detail || `HTTP error! status: ${response.status}`;
    // FastAPI validation errors might have 'detail' as an array of objects
    if (Array.isArray(errorDetail) && errorDetail.length > 0 && errorDetail[0].msg) {
        throw new Error(errorDetail.map(err => `${err.loc.join(' -> ')}: ${err.msg}`).join('; '));
    }
    throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
  }

  return responseData as T;
}

console.log("AI Pills API service helper enhanced: Includes generic fetchClient.");
