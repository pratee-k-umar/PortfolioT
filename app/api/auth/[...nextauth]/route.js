import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectToDB } from "@/utils/database"
import User from "@/models/user"

const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          await connectToDB()
          const user = await User.findOne({
            $or: [
              { email: credentials.email }
            ]
          })
          if (!user) {
            throw new Error("No user found with this email/username")
          }
          const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)
          if (!isCorrectPassword) {
            throw new Error("Incorrect password")
          }
          return user
        }
        catch (error) {
          throw new Error(error.message)
        }
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        const sessionUser = await User.findOne({
          email: token.email
        });
        session.user = {
          id: sessionUser._id.toString(),
          name: sessionUser.name,
          email: sessionUser.email,
        };
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },

}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
