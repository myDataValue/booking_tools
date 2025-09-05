import { useEffect, useState } from "react";
import { devIssueToken, partnerLogin } from "./api";

interface UseAuthExampleOptions {
  accountId: number;
  email: string;
  firstName: string;
  lastName: string;
}

export function useAuthExample(opts: UseAuthExampleOptions) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // In production: replace this with a call to the partner's backend
        const token = await devIssueToken({
          accountId: opts.accountId,
          email: opts.email,
          firstName: opts.firstName,
          lastName: opts.lastName,
        });

        await partnerLogin(token); // sets session cookie
        setReady(true);
      } catch (e: any) {
        setError(e.message ?? "Auth failed");
      }
    })();
  }, [opts.accountId, opts.email, opts.firstName, opts.lastName]);

  return { ready, error };
}
