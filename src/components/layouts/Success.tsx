import React, { FC } from "react";
import Image from "next/image";
import Button from "../buttons/Button";

interface SuccessProps {
  clickHandler?: () => void;
  headerText?: string;
  bodyText?: string;
  footerText?: string;
}

const Success: FC<SuccessProps> = ({
  clickHandler,
  headerText,
  bodyText,
  footerText,
}) => {
  return (
    <div className="bg-white h-[388px] w-[517px] rounded-[16px]">
      <div className="flex flex-col pt-[80px] items-center h-full">
        <Image src="/verify-icon.svg" alt="Logo" width={72} height={72} />
        <div className="mt-[32px] text-[#060809] font-medium text-[20px] leading-[28px]">
          {headerText || "Card Added Successfully"}
        </div>
        <div className="max-w-[278px] mb-4 text-center text-[#555555] font-normal text-[16px] leading-[24px]">
          {bodyText || "Your card has been successfully saved to your account"}
        </div>
        <Button
          onClick={clickHandler}
          className="h-[48px] w-[175px] rounded-md flex items-center justify-center bg-[#071A7E] text-white"
        >
          {footerText || "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Success;
