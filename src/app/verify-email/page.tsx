"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layouts/Header";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { VERIFY_EMAIL } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";

export default function VerifyEmail() {
  const searchParams = useSearchParams();

  const token = searchParams?.get("token");

  const email = searchParams?.get("email");

  //   const [error, setError] = useState<any>();
  const router = useRouter();

  const [verify, result] = useMutation(VERIFY_EMAIL, {
    onError: (error) => {
      console.log(error.message);
      //   setError(error.message);
      toast.error(error.message);
      router.push(`/requestemailverification?email=${email}`);
    },
  });

  useEffect(() => {
    if (result.data?.verifyEmail.status) {
      console.log(result.data);
      router.push(`/requestemailverification?email=${email}`);
    }
  }, [result.data, router, email]);

  console.log(result.data);

  useEffect(() => {
    if (token) {
      verify({
        variables: {
          input: {
            token,
          },
        },
      });
    }
  }, [token, verify]);

  if (result.loading) return <div className="h-screen">Loading...</div>;

  if (result.data?.verifyEmail.status)
    return <div className="h-screen">error</div>;

  if (result.data?.verifyEmail.message)
    return (
      <div className="bg-white h-screen overflow-hidden">
        <Header />
        <div className="flex flex-col pt-[80px] items-center h-full">
          <Image src="/verify-icon.svg" alt="Logo" width={160} height={160} />
          <div className="mt-[32px] text-[#060809] font-medium text-[28px] leading-[39px]">
            Verification successful
          </div>
          <div className="max-w-[514px] mb-4 text-center text-[#555555] font-normal text-[16px] leading-[24px]">
            Your email has been confirmed. Click Continue to access your account
          </div>
          <Link
            href="/login"
            className="h-[48px] w-[370px] rounded-md flex items-center justify-center bg-[#071A7E] text-white"
          >
            Continue
          </Link>
        </div>
      </div>
    );
}
