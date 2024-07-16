import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./common/InputField";
import { api } from "~/utils/api";
import Loader from "./common/Loader";
import toast from "react-hot-toast";

interface Props {
  setlogin: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define the Zod schema
const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type FormValues = z.infer<typeof signinSchema>;

const Signin: React.FC<Props> = ({ setlogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signinSchema),
  });

  const { mutateAsync, isPending } = api.auth.login.useMutation({
    onSuccess: () => window.location.reload(),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync({ email: data.email, password: data.password }).catch(
      (e: Error) => toast.error(e.message),
    );
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            id="loginEmail"
            label="Email Address"
            name="email"
            type="email"
            register={register}
            errors={errors.email}
          />

          <div>
            <InputField
              id="loginPassword"
              label="Password"
              name="password"
              type="password"
              register={register}
              errors={errors.password}
            />

            <div className="mt-2 flex justify-end text-sm">
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isPending ? <Loader /> : " Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <button
            onClick={() => setlogin(false)}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signin;
