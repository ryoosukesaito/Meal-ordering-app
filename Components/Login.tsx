"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push("/admin/dashboard");
        console.log("user>>>", user);
      })
      .catch((err) => {
        if (err)
          console.log("There is something wrong with Email or Password.");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-10 min-w-fit">
        <div className="text-4xl flex justify-center items-center mb-24 font-semibold">
          <h1>Order Meal Services</h1>
        </div>
        <form
          onSubmit={handleLogin}
          id="login"
          className="rounded-xl shadow-md bg-white p-10"
        >
          <div className="text-2xl flex justify-center items-center mb-12">
            <h1>Admin</h1>
          </div>

          <div className=" p-5">
            <input
              className="border w-full py-3 px-3 mb-7 rounded-xl"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="border w-full py-3 px-3 mb-7 rounded-xl"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-center">
            <button
              className="rounded px-8 py-2 mb-12 cursor-pointer bg-[#FF7474] hover:bg-[#FFB9B9] text-white hover:text-[#8D8D8D]"
              type="submit"
            >
              Login
            </button>
          </div>
          <div className="text-center underline  hover:opacity-50">
            <a href="/">Forget the password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

// admin@admin.com - email
// admin123456789 - password
