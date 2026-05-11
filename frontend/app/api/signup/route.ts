import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db";
import User from "@/models/User";


export async function POST(
  req: Request
) {

  try {

    await connectDB();


    const {

      name,
      email,
      password,

    } =
      await req.json();




    /* =========================
       VALIDATION
    ========================= */

    if (
      !name ||
      !email ||
      !password
    ) {

      return NextResponse.json(

        {
          error:
            "All fields are required",
        },

        {
          status: 400,
        }

      );

    }




    /* =========================
       CHECK EXISTING USER
    ========================= */

    const existingUser =
      await User.findOne({
        email,
      });


    if (
      existingUser
    ) {

      return NextResponse.json(

        {
          error:
            "User already exists",
        },

        {
          status: 409,
        }

      );

    }




    /* =========================
       HASH PASSWORD
    ========================= */

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );




    /* =========================
       CREATE USER
    ========================= */

    await User.create({

      name,

      email:
        email
          .toLowerCase()
          .trim(),

      password:
        hashedPassword,

      provider:
        "credentials",


      role:
        "user",

    });




    return NextResponse.json({

      success: true,

      message:
        "User created successfully",

    });

  } catch (error: any) {

    console.log(
      "SIGNUP ERROR:",
      error
    );


    return NextResponse.json(

      {
        success: false,

        error:
          "Signup failed",
      },

      {
        status: 500,
      }

    );

  }

}