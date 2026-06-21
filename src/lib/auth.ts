export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function isSessionExpired(): boolean {
  if (typeof window === "undefined") return true;

  const token = localStorage.getItem("auth_token");
  const issuedAt = localStorage.getItem("auth_issued_at");

  if (!token || !issuedAt) {
    return true;
  }

  const age = Date.now() - parseInt(issuedAt, 10);
  return age > SESSION_TIMEOUT_MS;
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_issued_at");
    localStorage.removeItem("session_expired");
  }
}
