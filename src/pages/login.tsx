import Layout from "@/components/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginUserValidator = z
  .object({
    username: z.string().min(4),
    password: z.string().min(5),
  })
  .strict();

type LoginUser = z.infer<typeof loginUserValidator>;

const UserLoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(loginUserValidator),
  });

  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage !== null) {
      router.push("/");
    }
  }, [router]);

  const handleLoginFormSubmit = async (data: LoginUser) => {
    const result = await fetch("http://localhost:3001/login", {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await result.json();
    console.log(json);
    if (json.token) {
      localStorage.setItem("token", json.token);
      localStorage.setItem("type", json.type);
      router.push("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit(handleLoginFormSubmit)}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="username"
              {...register("username")}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                Invalid Username address
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 5 characters long
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default UserLoginPage;
