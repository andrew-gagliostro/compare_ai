import React, {
  useState,
  createContext,
  PropsWithChildren,
  useMemo,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Session } from "next-auth";

export const AuthCtx = createContext<any>({
  authRequired: (required: boolean) => {},
  getSession: () => null as Session | null,
});

const AuthProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const session = useSession();
  const router = useRouter();

  const [authRequired, setAuthRequired] = useState<boolean>(false);

  useEffect(() => {
    if (authRequired && session.status === "unauthenticated") {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authRequired, router.isReady, session]);

  const ctx = useMemo(
    () => ({
      authRequired: (required: boolean) => setAuthRequired(required),
      getSession: () => session.data,
    }),
    [session]
  );

  return <AuthCtx.Provider value={ctx}>{children}</AuthCtx.Provider>;
};

export default AuthProvider;
