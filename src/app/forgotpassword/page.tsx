"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import EmailInput from "@/components/inputs/EmailInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import Header from "@/components/layouts/Header";
import Button from "@/components/buttons/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@apollo/client";
import { RECOVER_PASSWORD } from "@/graphql/mutations";
import { useRouter } from "next/navigation";

const schema = yup.object({
  email: yup.string().required(),
});

export default function ForgotPassword() {
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
  });

  const [error, setError] = useState<any>();

  const [recover, result] = useMutation(RECOVER_PASSWORD, {
    onError: (error) => {
      console.log(error.message);
      setError(error.message);
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (result.data) {
      console.log(result.data);
      router.push(`/passwordlink?email=${getValues("email")}&type=reset`);
    }
  }, [result.data, router, getValues]);

  const onSubmit = async (data: any) => {
    console.log(data);
    recover({
      variables: {
        input: {
          ...data,
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto px-2 w-[365px] mt-[32px] flex flex-col gap-y-2 mb-6">
        <h1 className="text-[#060809] font-medium text-[28px] leading-[39.2px]">
          Forgot your password?
        </h1>
        <div className="text-[#555555] pb-[19px] font-normal">
          We’ll send you a link to recover your password
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
                />
              </div>
              <div className="mt-4">
                <Button
                  disabled={!isValid || isSubmitting || result.loading}
                  isLoading={isSubmitting || result.loading}
                  type="submit"
                >
                  Reset Password
                </Button>
              </div>
            </form>
            <div className="mt-4 text-[#555555] text-center font-normal text-[12px] leading-[18px]">
              <Link href="/" className="underline text-[#DF5753]">
                Return to Login
              </Link>
            </div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </div>
    </main>
  );
}
