"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import EmailInput from "@/components/inputs/EmailInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import Header from "@/components/layouts/Header";
import Button from "@/components/buttons/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@apollo/client";
import { LOGIN } from "@/graphql/mutations";
import { GET_USER } from "@/graphql/queries";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const schema = yup.object({
  email: yup.string().required(),
  password: yup
    .string()
    .required()
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number"),
  // .matches(/[^\w]/, "Password requires a symbol"),
});

export default function Login() {
  const {
    watch,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const [error, setError] = useState<any>();
  const router = useRouter();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message);
    },
  });

  useEffect(() => {
    // console.log(result.data?.login?.data?.user?.emailVerified);

    if (result.data?.login.code) {
      toast.error(result.data?.login.message, { pauseOnHover: false });
      reset();
    } else if (result.data?.login?.data?.user?.emailVerified === false) {
      reset();
      router.push(
        `/requestemailverification?email=${result.data?.login?.data?.user?.email}`
      );
    } else if (result.data?.login?.data?.token) {
      localStorage.setItem("userToken", result.data?.login?.data?.token);
      localStorage.setItem(
        "userData",
        JSON.stringify(result.data?.login?.data?.user)
      );
      router.push(`/dashboard`);
    }
  }, [result.data?.login, router, getValues, reset]);

  const onSubmit = async (data: any) => {
    login({
      variables: { input: { email: data?.email, password: data?.password } },
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto px-2 w-[365px] mt-[32px] flex flex-col gap-y-2 mb-6">
        <h1 className="text-[#060809] font-medium text-[28px] leading-[39.2px]">
          Welcome Back!
        </h1>
        <div className="text-[#555555] pb-[19px] font-normal">
          Let’s continue from where we stopped.
        </div>
        <div className="">
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={`flex flex-col gap-y-2`}>
                <EmailInput
                  label="Email address"
                  name="email"
                  placeholder="e.g yourname@gmail.com"
                  register={register}
                  errorMessage={errors?.email?.message}
                />
                <PasswordInput
                  name="password"
                  label="Password"
                  placeholder="**********"
                  register={register}
                  errorMessage={errors?.password?.message}
                />
              </div>
              <div className="mt-4">
                <Button
                  disabled={!isValid || isSubmitting || result.loading}
                  isLoading={isSubmitting || result.loading}
                  type="submit"
                >
                  Sign in
                </Button>
              </div>
            </form>
            <div className="mt-4 text-[#555555] text-center font-normal text-[12px] leading-[18px]">
              <Link href="/forgotpassword" className="underline text-[#DF5753]">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </div>
      <ToastContainer />
    </main>
  );
}

// else if (result.data?.login?.data?.user?.onboarded === false) {
//   localStorage.setItem("userToken", result.data?.login?.data?.token);
//   localStorage.setItem(
//     "userData",
//     JSON.stringify(result.data?.login?.data?.user)
//   );

//   router.push(`/completeonboarding`);
// }

// else if (result.data?.login?.data?.user?.phoneVerified === false) {
//   localStorage.setItem("userToken", result.data?.login?.data?.token);
//   localStorage.setItem(
//     "userData",
//     JSON.stringify(result.data?.login?.data?.user)
//   );

//   router.push(`/otp`);
// }
