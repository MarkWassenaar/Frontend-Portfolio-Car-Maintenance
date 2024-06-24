import Layout from "@/components/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterUserValidator = z
  .object({
    username: z.string().min(5),
    password: z.string().min(10),
  })
  .strict();

type RegisterUser = z.infer<typeof RegisterUserValidator>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(RegisterUserValidator),
  });

  const router = useRouter();

  const handleRegisterFormSubmit = async (data: RegisterUser) => {
    const response = await fetch(`http://localhost:3001/register`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/login");
    } else {
      console.log("Something went wrong!");
    }
  };

  return (
    <Layout>
      <div className="login-form">
        <form
          onSubmit={handleSubmit(handleRegisterFormSubmit)}
          className="form__login"
        >
          <label htmlFor="username">Username</label>
          <input id="username" type="text" {...register("username")}></input>
          {errors.username && (
            <p>Username must be at least 5 characters long</p>
          )}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password")}
          ></input>
          {errors.password && (
            <p>Password must be at least 10 characters long</p>
          )}

          <button type="submit" className="login_button">
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default RegisterPage;
