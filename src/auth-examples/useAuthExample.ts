import { useEffect, useState } from "react";
import { devIssueToken } from "./api";

interface UseAuthExampleOptions {
  accountId: number;
}

export function useAuthExample(opts: UseAuthExampleOptions) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // In production: replace this with a call to the partner's backend
        const token = await devIssueToken({
          accountId: opts.accountId,
        });

        setJwtToken(token); // sets session cookie
        setReady(true);
      } catch (e: any) {
        setError(e.message ?? "Auth failed");
      }
    })();
  }, [opts.accountId]);

  return { token, ready, error };
}
