import Layout from "@/components/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterGarageValidator = z
  .object({
    name: z.string().min(1),
    username: z.string().email(),
    password: z.string().min(5),
  })
  .strict();

type RegisterGarage = z.infer<typeof RegisterGarageValidator>;

const RegisterGaragePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterGarage>({
    resolver: zodResolver(RegisterGarageValidator),
  });

  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage !== null) {
      router.push("/garage");
    }
  }, [router]);

  const handleRegisterFormSubmit = async (data: RegisterGarage) => {
    const response = await fetch(`http://localhost:3001/registergarage`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/loginGarage");
    } else {
      console.log("Something went wrong!");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit(handleRegisterFormSubmit)}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Sign Up as Garage
          </h2>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Garage Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                Name must be at least 1 character long
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              id="username"
              type="username"
              {...register("username")}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">Invalid email address</p>
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
            Register
          </button>
          <p className="mt-4">
            Already have an account? Log in{" "}
            <Link className="text-blue-400 underline" href="/logingarage">
              here
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};
export default RegisterGaragePage;
