import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  const { name, email, password } = await req.json();
  try {
    await connectToDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return new Response(JSON.stringify(userResponse), { status: 201 });
  }
  catch (error) {
    console.error("Error registering user:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
};
