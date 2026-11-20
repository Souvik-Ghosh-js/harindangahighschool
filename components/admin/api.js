"use client";

/* Small fetch wrapper: JSON in/out, friendly errors, and a jump back to
   the login screen when the session has expired. */
export async function api(path, { method = "GET", body, form } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      headers: form ? undefined : { "Content-Type": "application/json" },
      body: form || (body !== undefined ? JSON.stringify(body) : undefined),
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new Error("No internet connection. Please check and try again.");
  }
  if (res.status === 401) {
    window.location.href = `/admin/login?next=${encodeURIComponent(location.pathname)}`;
    throw new Error("Please sign in again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
