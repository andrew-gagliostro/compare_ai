/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
/* eslint-disable quotes */
import NextAuth, { Awaitable, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import User from "@/models/User";
import connect from "@/backend/connect";

function Log(name: string, callback: Awaitable<any>) {
  return async function (this: any, ...args: any[]) {
    console.log(
      `Calling ${name} with Following Arguments:\n ${JSON.stringify(
        args,
        null,
        4
      )}`
    );
    const result = await callback.apply(this, args);
    console.log(`${name} RETURNED:\n`, JSON.stringify(result, null, 4));
    return result;
  };
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
      authorization: { params: { scope: "openid email profile" } },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          given_name: profile.given_name,
          family_name: profile.family_name,
        };
      },
      style: { logo: "/google.svg", bg: "#fff", text: "#000" },
    }),
    GitHubProvider({
      // Add the GitHub provider
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // Optionally, specify scopes requested from GitHub
      authorization: {
        params: { scope: "read:user user:email" },
      },
      style: { logo: "/github.svg", bg: "#fff", text: "#000" },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, profile }) {
      await connect();
      const newToken = { ...token };
      if (profile) {
        console.log("TOKEN: " + JSON.stringify(token, null, 4));
        console.log("PROFILE: " + JSON.stringify(profile, null, 4));
        // Forward profile to session
        const tempProfile = profile as any;
        const user = await User.findOne({
          email: tempProfile.email,
        });
        console.log("FETCHED USER: " + JSON.stringify(user, null, 4));
        if (user) {
          newToken.profile = {
            name: user.name,
            picture: user.picture,
            email: user?.email,
          };
        } else {
          const tempProfile = profile as any;
          const user = await User.create({
            name: tempProfile?.name ? tempProfile.name : undefined,
            email: tempProfile?.email ? tempProfile.email : undefined,
            picture: tempProfile?.picture ? tempProfile.picture : undefined,
            roles: [],
            settings: new Map<string, string>(),
          });
          const fetchedUser = await User.findOne({
            email: tempProfile.email,
          });

          console.log("FETCHED USER: " + JSON.stringify(fetchedUser, null, 4));
          newToken.profile = {
            name: user.name,
            picture: user.picture,
            email: user?.email,
          };
        }
      }
      return newToken;
    },
    async session({ session, token }) {
      const profile = token.profile as any;
      // console.log('PROFILE KEYS: ' + JSON.stringify(profile, null, 4));
      const newSession = { ...session };
      if (profile) {
        newSession.user = token.profile;
      }
      return newSession;
    },
  },
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "#857D9E", // Hex color code
    logo: "", // Absolute URL to image
    buttonText: "", // Hex color code
  },
};

export default NextAuth(authOptions);
