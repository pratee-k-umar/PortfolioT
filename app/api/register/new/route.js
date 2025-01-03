import User from "@/models/user"
import { connectToDB } from "@/utils/database"

export const POST = async (req) => {
  const { name, email, password } = await req.json()
  try {
    await connectToDB()
    const user = new User({
      name,
      email,
      password
    })
    await user.save()
    return new Response(JSON.stringify(user), { status: 201 })
  }
  catch (error) {
    console.log(error)
    return new Response("Error registering user", { status: 500 })
  }
}