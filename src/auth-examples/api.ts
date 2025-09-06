export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

/** DEV-ONLY helper to mint a token from your dev endpoint */
export async function devIssueToken(opts: {
  accountId: number;
}): Promise<string> {
  const form = new URLSearchParams();
  form.set("account_id", String(opts.accountId));

  const res = await fetch(`${API_BASE}/api/auth/dev/issue-partner-token/`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`devIssueToken failed: ${res.status}`);
  const { token } = await res.json();
  return token;
}
