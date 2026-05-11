"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Signup() {

  const router =
    useRouter();


  const [name, setName] =
    useState("");


  const [email, setEmail] =
    useState("");


  const [password, setPassword] =
    useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");




  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;




  const handleSignup =
    async () => {

      if (

        !name ||
        !email ||
        !password ||
        !confirmPassword

      ) {

        alert(
          "Please fill all fields"
        );

        return;

      }




      if (

        !passwordRegex.test(
          password
        )

      ) {

        alert(

          "Password must be 8+ chars, include uppercase, lowercase, number & special character"

        );

        return;

      }




      if (

        password !==
        confirmPassword

      ) {

        alert(
          "Passwords do not match"
        );

        return;

      }




      const res =
        await fetch(

          "/api/signup",

          {

            method:
              "POST",

            body:
              JSON.stringify({

                name,
                email,
                password,

              }),

          }

        );




      const data =
        await res.json();


      console.log(
        data
      );




      if (
        res.ok
      ) {

        alert(
          "Account created successfully. Welcome to SecureOps!"
        );


        router.push(
          "/"
        );

      } else {

        alert(

          data.error ||
          "Signup failed"

        );

      }

    };




  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">


      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">


        <h1 className="text-2xl font-bold text-center mb-6 text-cyan-200">

          Create Account

        </h1>




        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="w-full px-4 py-2 mb-3 rounded-lg bg-black/30 border border-white/10"
        />




        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full px-4 py-2 mb-3 rounded-lg bg-black/30 border border-white/10"
        />




        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full px-4 py-2 mb-2 rounded-lg bg-black/30 border border-white/10"
        />




        <p className="text-xs text-gray-400 mb-3">

          Password must contain at least 8 characters

        </p>




        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full px-4 py-2 mb-4 rounded-lg bg-black/30 border border-white/10"
        />




        <button
          onClick={handleSignup}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500"
        >

          Create Account

        </button>




        <p className="text-center text-sm mt-4 text-gray-400">

          Already have an account?{" "}

          <span
            onClick={() =>
              router.push(
                "/"
              )
            }
            className="text-cyan-400 cursor-pointer"
          >

            Login

          </span>

        </p>


      </div>


    </div>

  );

}