import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcryptjs";

export const GET = async ({ params }) => {
  try {
    await connectToDB();
    const user = await User.findById(params.id);
    return new Response(JSON.stringify(user), { status: 200 });
  }
  catch (error) {
    console.error(error);
    return new Response({ message: "Failed to fetch user"}, { status: 500 });
  }
}

export const PATCH = async (req, { params }) => {
  const { name, email, password } = await req.json()
  try {
    await connectToDB()
    const filteredFields = Object.fromEntries(
      Object.entries({ name, email }).filter(([_, value]) => value !== undefined && value !== null)
    )
    if(password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt)
      filteredFields.password = hashedPassword;
    }
    if(Object.keys(filteredFields).length === 0) return new Response("No fields to update", { status: 400 });
    const user = await User.findByIdAndUpdate(
      params.id, {
        $set: filteredFields
      }, {
        new: true
      }
    )
    if(!user) return new Response({ message: "User not found..!"}, { status: 404 })
    return new Response(JSON.stringify({ message: "User updated successfully...", user }), { status: 200 })
  }
  catch (error) {
    console.log(error)
    return new Response({message: "Failed to update details"}, { status: 500 });
  }
}

export const DELETE = async ({ params }) => {
  try {
    await connectToDB()
    await User.findByIdAndDelete(params.id)
    return new Response(JSON.stringify({ message: "User deleted successfully..." }), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response({ message: "Failed to delete user"}, { status: 500 })
  }
}