import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="flex justify-between items-center h-16 px-4 md:px-[148px] border-b-[1px] border-[#EAEDEF]">
      <div>
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={150} height={20} />
        </Link>
      </div>
      <div className="text-[#555555] font-semibold text-sm">
        Have an account?{" "}
        <Link href="/login" className="text-[#DF5753] font-medium">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Header;
