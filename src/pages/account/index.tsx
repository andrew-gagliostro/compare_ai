import UserUpdateForm from "../../ui-components/UserUpdateForm";
import { useEffect, useState } from "react";
import { NavBar } from "@/components/navigation/NavBar";
import { Footer } from "@/components/layout/Footer";
import { API } from "aws-amplify";
import { useRouter } from "next/router";
import { Authenticator } from "@aws-amplify/ui-react";
import { useUser } from "@/context/AuthContext";
import { getUser } from "@/graphql/queries";
import { User, GetUserQuery } from "@/models";

export default function Home() {
  const { user, setUser } = useUser();
  const [graphqlUser, setGraphqlUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log(JSON.stringify(user));
    const fetchUser = async () => {
      if (user.attributes && user.attributes.sub) {
        const userRes = (await API.graphql({
          query: getUser,
          variables: { id: user.attributes.sub },
        })) as { data: GetUserQuery };
        setGraphqlUser(userRes.data.getUser as User);
      } else {
        console.log("No user found");
        return;
      }
    };
    fetchUser();
  }, []);

  return (
    <Authenticator>
      <main className="flex min-h-screen flex-col justify-between items-center">
        <NavBar />
        <div className="flex flex-row text-center text-3xl font-bold">
          {user && user.username && (
            <div>Hello {" " + JSON.stringify(graphqlUser)}</div>
          )}
        </div>
        <UserUpdateForm />
        <Footer></Footer>
      </main>
    </Authenticator>
  );
}
