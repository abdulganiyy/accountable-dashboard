"use client";
import { useState, useEffect } from "react";
import Header from "@/components/layouts/Header";
import { useSearchParams } from "next/navigation";
import Button from "@/components/buttons/Button";
import { REQUEST_VERIFICATION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
// import { useRouter } from "next/navigation";

export default function RequestEmailVerification() {
  const searchParams = useSearchParams();

  const email = searchParams?.get("email");

  //   const router = useRouter();

  const [resend, result] = useMutation(REQUEST_VERIFICATION);

  useEffect(() => {
    if (result.data?.requestEmailVerification.message) {
      //   console.log(result.data);
      toast.success("verification request sent");
    } else if (result.data?.requestEmailVerification.status) {
      toast.error("cannot send request");
    }
  }, [result.data]);

  return (
    <div className="bg-white h-screen overflow-hidden">
      <Header />
      <div className="flex flex-col pt-[80px] items-center h-full">
        <div className="mt-[32px] text-[#060809] font-medium text-[28px] leading-[39px]">
          Oops! This link has expired
        </div>
        <div className="max-w-[514px] mb-4 text-center text-[#555555] font-normal text-[16px] leading-[24px]">
          Your request to verify your email has expired or the link has already
          been used.
        </div>
        <div className="w-[370px]">
          <Button
            onClick={async () => {
              resend({
                variables: {
                  input: {
                    email,
                  },
                },
              });
            }}
          >
            Request new verification link
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
