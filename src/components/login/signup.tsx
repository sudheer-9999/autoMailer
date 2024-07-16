import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { api } from "~/utils/api";
import InputField from "./common/InputField";
import Loader from "./common/Loader";

interface Props {
  setlogin: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define the Zod schema
const signupSchema = z
  .object({
    fullname: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof signupSchema>;

const Signup: React.FC<Props> = ({ setlogin }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
  });

  const { mutateAsync, isPending } = api.user.register.useMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync({
      email: data.email,
      name: data.fullname,
      password: data.confirmPassword,
    }).catch((e: Error) => toast.error(e.message));
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
          Create Your account Here
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            id="fullname"
            label="FullName"
            name="fullname"
            type="text"
            register={register}
            errors={errors.fullname}
          />

          <InputField
            id="loginEmail"
            label="Email Address"
            name="email"
            type="email"
            register={register}
            errors={errors.email}
          />

          <InputField
            id="signupPassword"
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors.password}
          />

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            errors={errors.confirmPassword}
          />

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isPending ? <Loader /> : "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?
          <button
            onClick={() => setlogin(true)}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
