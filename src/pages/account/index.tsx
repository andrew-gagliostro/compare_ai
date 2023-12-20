import { useEffect, useState } from "react";
import { NavBar } from "@/components/navigation/NavBar";
import { Footer } from "@/components/layout/Footer";
import { API } from "aws-amplify";
import { useRouter } from "next/router";
import { Authenticator } from "@aws-amplify/ui-react";
import User, { UserModel } from "@/models/User";
import { useContext } from "react";
import { AuthCtx } from "@/context/AuthContext";

export default function Home() {
  const { getSession, authRequired } = useContext(AuthCtx);
  const [user, setUser] = useState< UserModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getSession()?.user as UserModel);
  }, []);

  return (
      <main className="flex min-h-screen flex-col justify-between items-center">
        <NavBar />
        <div className="flex flex-row text-center text-3xl font-bold">
          {user && user.username && (
            <div>Hello {" " + JSON.stringify(user)}</div>
          )}
        </div>
        <Footer></Footer>
      </main>
  );
}
