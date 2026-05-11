import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password " }, { status: 400 });
    }

    // ✅ SEND USER DATA BACK
    return NextResponse.json({
      message: "Login success",
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}