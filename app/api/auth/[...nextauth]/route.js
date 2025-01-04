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
        await connectToDB()
        try {
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
        token.id = user._id
        token.name = user.name
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email
        }
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
