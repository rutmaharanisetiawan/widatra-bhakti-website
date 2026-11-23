// Central HTTP client for the real Laravel backend.
// Every store in `src/lib/*-store.ts` goes through this file — no mock
// data, no localStorage-as-database, no fake services.
//
// Auth: Laravel Sanctum personal access tokens (Bearer). The token is
// persisted in localStorage under TOKEN_KEY and attached to every request.

export const API_BASE_URL: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ||
  (typeof window !== "undefined" ? "/api" : "http://localhost:8001/api");

const TOKEN_KEY = "widatra_auth_token_v1";
const EVENT_NAME = "widatra-auth-store-changed";

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

export function onAuthStoreChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
  emitAuthChange();
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }

  /** First field-level validation message, falling back to the top-level message. */
  get firstError(): string {
    if (this.errors) {
      const first = Object.values(this.errors)[0]?.[0];
      if (first) return first;
    }
    return this.message;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  isForm?: boolean;
  auth?: boolean; // when true and no token exists, request is still sent (public+opportunistic auth)
  signal?: AbortSignal;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, isForm = false } = opts;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body !== undefined) {
    if (isForm && body instanceof FormData) {
      payload = body;
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  let res: Response;
  try {
    const cleanBase = API_BASE_URL.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const requestUrl = cleanBase ? `${cleanBase}${cleanPath}` : cleanPath;
    res = await fetch(requestUrl, {
      method,
      headers,
      body: payload,
      signal: opts.signal,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Please check your connection.", 0);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let json: unknown = undefined;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = undefined;
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      setToken(null);
    }
    const j = (json ?? {}) as { message?: string; errors?: Record<string, string[]> };
    throw new ApiError(j.message || `Request failed (${res.status})`, res.status, j.errors);
  }

  // Laravel API Resources wrap output as { data: ... }. Unwrap transparently.
  if (json && typeof json === "object" && "data" in (json as Record<string, unknown>)) {
    return (json as { data: T }).data;
  }
  return json as T;
}

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "DELETE" }),
  upload: <T>(path: string, formData: FormData, method: "POST" | "PUT" | "PATCH" = "POST") =>
    request<T>(path, { method, body: formData, isForm: true }),
};

/** Builds a browser-safe URL for backend paths and storage files. */
export function absoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) {
    if (typeof window !== "undefined" && /(localhost|127\.0\.0\.1):(8000|8001)/i.test(pathOrUrl)) {
      return pathOrUrl.replace(/^https?:\/\/[^/]+/i, "");
    }
    return pathOrUrl;
  }
  const origin = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
