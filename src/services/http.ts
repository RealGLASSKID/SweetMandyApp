/**
 * Thin API layer.
 *
 * Every function in `src/services/*` returns a promise, exactly as a real HTTP
 * client would. Today they resolve from mock data; the backend developer only
 * has to swap the body of each service function for a `request()` call.
 *
 * Example:
 *   export const fetchVendors = () => request<Vendor[]>("/vendors");
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Real HTTP request helper — ready for when live endpoints exist. */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed`, res.status);
  }
  return (await res.json()) as T;
}

/** Simulates network latency so loading states are exercised in the UI. */
export function mockResponse<T>(data: T, delay = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delay));
}
