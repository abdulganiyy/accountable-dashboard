"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { twMerge } from "tailwind-merge";
import moment from "moment";

const Page = () => {
  return (
    <div>
      <div
        className={twMerge(
          true
            ? "grid grid-cols-[1fr,40px] gap-x-2 mb-4"
            : `grid grid-cols-[40px,1fr] gap-x-2 mb-4`
        )}
      >
        {true ? (
          <span className="font-migra text-[#060809] font-extrabold w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#FAEAD4] ">
            A
          </span>
        ) : (
          <span className="font-migra text-[#060809] font-extrabold w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#FAEAD4] ">
            A
          </span>
          // <span>
          //   <Image
          //     alt="manager pic"
          //     src="/accountofficer.svg"
          //     height={40}
          //     width={40}
          //   />
          // </span>
        )}
        <div className={twMerge("order-first")}>
          <div className="flex flex-col rounded-[8px]">
            <div className={twMerge("text-right")}>
              {true ? (
                <span>{`You`}</span>
              ) : (
                <div>
                  <span className="text-[#555555B2] text-[12px] leading-[20px]">
                    - Account Officer
                  </span>
                </div>
              )}
            </div>
            <span
              className={twMerge(
                true
                  ? "text-right text-[#555555CC] text-[12px] leading-[17px]"
                  : `text-[#555555CC] text-[12px] leading-[17px]`
              )}
            >
              5 minutes ago
            </span>
          </div>
          <div className="flex flex-col rounded-[8px]">
            <span className="p-4 bg-[#FAFBFC] text-[#060809] rounded-[32px]">
              hello
            </span>
            <span className="relative h-[400px]">
              <Image alt="manager pic" src="/logomain.svg" fill />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
