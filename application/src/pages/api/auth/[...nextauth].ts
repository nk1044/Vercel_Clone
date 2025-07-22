import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/config/db";
import { loginUser } from "@/lib/controllers/auth.controller";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      await connectDB();

      if (!profile?.email || !profile?.name) {
        console.error("Email and name are required for login");
        return false;
      }

      const googleProfile = profile as {
        email: string;
        name: string;
        picture?: string;
      };

      const avatar =
        googleProfile.picture ||
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

      const user = await loginUser(googleProfile.email, googleProfile.name, avatar);
      if (!user) {
        console.error("User login failed");
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth",      // 👈 Your custom login page
    signOut: "/",          // where to go after logout
    newUser: "/",          // after first sign-in
  },
};

const handler = NextAuth(authOptions);
export default handler;
