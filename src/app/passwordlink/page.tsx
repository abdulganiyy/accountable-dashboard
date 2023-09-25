"use client";
import Header from "@/components/layouts/Header";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function PasswordLink() {
  const searchParams = useSearchParams();

  const email = searchParams?.get("email");
  const type = searchParams?.get("type");

  if (!email) return <div>Loading...</div>;

  return (
    <div className="bg-white h-screen overflow-hidden">
      <Header />
      <div className="flex flex-col pt-[80px] items-center h-full">
        <Image src="/email-icon.svg" alt="Logo" width={160} height={160} />
        <div className="mt-[32px] text-[#060809] font-medium text-[28px] leading-[39px]">
          {type ? "Reset Link Sent" : "Verify your email"}
        </div>
        <div className="max-w-[514px] text-center text-[#555555] font-normal text-[16px] leading-[24px]">
          A link has been sent to your email{" "}
          <span className="text-[#071A7E] font-bold">
            {/* product@companydomain.com . */}
            {email}
          </span>{" "}
          You can also check your Spam folder for the email
        </div>
      </div>
    </div>
  );
}
