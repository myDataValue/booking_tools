export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export async function partnerLogin(jwtToken: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/partner-login/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwtToken}` },
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`partner_login failed: ${res.status} ${JSON.stringify(body)}`);
  }
}

/** DEV-ONLY helper to mint a token from your dev endpoint */
export async function devIssueToken(opts: {
  accountId: number;
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<string> {
  const form = new URLSearchParams();
  form.set("account_id", String(opts.accountId));
  form.set("email", opts.email);
  form.set("first_name", opts.firstName ?? "Hostify First Name");
  form.set("last_name", opts.lastName ?? "Hostify Last Name");

  const res = await fetch(`${API_BASE}/api/auth/dev/issue-partner-token/`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`devIssueToken failed: ${res.status}`);
  const { token } = await res.json();
  return token;
}
