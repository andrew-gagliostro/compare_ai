import { useState } from "react";
import { useRouter } from "next/router";
import { Authenticator } from "@aws-amplify/ui-react";
import { useUser } from "@/context/AuthContext";
import { User } from "@/models";

export default function Home() {
  const { user, setUser } = useUser();

  const router = useRouter();
}
