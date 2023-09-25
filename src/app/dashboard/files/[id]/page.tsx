"use client";
import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, DotsThree, PaperPlaneRight } from "@phosphor-icons/react";
import { Portal } from "@/components/Portal";
import { ToastContainer, toast } from "react-toastify";
import { GET_REPORT } from "@/graphql/queries";
import { ADD_COMMENT_TO_REPORT } from "@/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { truncateStr } from "@/utils";

interface PageProps {
  params: { id: string };
}

const Page: FC<PageProps> = ({ params: { id } }) => {
  //   console.log(id);
  const [report, setReport] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [text, setText] = useState<string>("");

  const router = useRouter();

  //   console.log(report);

  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem("userData") || "");

    setCurrentUser(parsedUser);
  }, []);

  const { loading, data, error } = useQuery(GET_REPORT, {
    variables: { input: { reportId: id } },
  });

  useEffect(() => {
    console.log(data);
    if (data?.getReport?.code) {
      console.log(data?.getReport?.code);
    } else if (data?.getReport?.data) {
      setReport(data?.getReport?.data);
    }
  }, [data]);

  const [addComment, result] = useMutation(ADD_COMMENT_TO_REPORT);

  useEffect(() => {
    console.log(result.data?.addCommentToReport);

    if (result.data?.addCommentToReport?.code) {
      // reset();
      toast.error(result.data?.addCommentToReport?.message);
    } else if (result.data?.addCommentToReport?.data?.id) {
      console.log(result.data?.addCommentToReport?.data);
      toast.success("comment sent");
      // router.push(`/passwordlink?email=${result.data?.register?.data?.email}`);
    }
  }, [result.data]);

  return (
    <div>
      <div
        onClick={() => {
          router.push("/dashboard/reports");
        }}
        className="flex items-center gap-x-2 text-[#414141] text-[16px] leading-[23.2px] cursor-pointer"
      >
        <ArrowLeft /> <span>Back to Files & Report</span>
      </div>
      <div className="mt-8 grid grid-cols-[1fr,432px]">
        <div className="shadow-[0_0_0_1px_#E7E7E7] p-4 bg-white h-[74px] flex items-center justify-between">
          <div className="flex gap-x-2 items-center">
            <span className="w-[40px] h-[40px] bg-[#FEE4E2] rounded-full flex justify-center items-center">
              <Image src="/filepdf.svg" alt="pdf" height={23} width={20} />
            </span>
            <span>
              {`${
                report?.name
                  ? `${report?.name}.pdf`
                  : "Income statement for 2022 financials.pdf"
              }`}
            </span>
          </div>
          <DotsThree size={32} />
        </div>
        <div className="shadow-[0_0_0_1px_#E7E7E7] bg-white h-[74px]"></div>
        <div className="shadow-[0_0_0_1px_#E7E7E7] px-6 pt-6 relative">
          <Image
            alt="calendar-icon"
            src="/filecover.svg"
            height={652}
            width={681}
            // fill
            // objectFit=""
            // layout="fill"
          />
          {/* <div className="w-full relative">
             
            </div> */}
        </div>
        <div className="shadow-[0_0_0_1px_#E7E7E7] flex flex-col">
          <div className="h-[594px] px-6 py-10 overflow-y-auto">
            <div className="flex flex-col gap-y-[25px]">
              {report?.comment?.map((comment: any, i: number) => {
                return (
                  <div key={i} className="flex gap-x-2 w-full">
                    <span>
                      <span className="font-migra text-[#060809] font-extrabold w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#FAEAD4] ">
                        {comment?.sender?.firstName
                          ? comment?.sender?.firstName
                              ?.slice(0, 1)
                              .toUpperCase()
                          : `C`}
                      </span>
                    </span>
                    <div className="flex flex-col bg-white rounded-[8px] w-full">
                      <div className="p-4 border-b-[1px] border-[#E1E2E6] flex justify-between text-[#9597A0] text-[12px] leading-[17px]">
                        <span>
                          {currentUser?.firstName == comment?.sender?.firstName
                            ? "You comment"
                            : `${comment?.sender?.firstName} commented`}
                        </span>
                        <span>
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }).format(new Date(comment?.date)) ||
                            `Jun 4, 11:45 pm`}
                        </span>
                      </div>
                      <span className="p-4">
                        {comment?.text ||
                          `Hi @Bimbo. Here's the file you asked for. Sorry I
                        sent it in late`}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* <div className="flex justify-between text-[#9597A0] text-[12px] leading-[17px]">
                <span>You uploaded this file to Accountable</span>
                <span>Jun 4, 11:45 pm</span>
              </div>
              <div className="flex gap-x-2">
                <span>
                  <span className="font-migra text-[#060809] font-extrabold w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#FAEAD4] ">
                    C
                  </span>
                </span>
                <div className="flex flex-col bg-white rounded-[8px]">
                  <div className="p-4 border-b-[1px] border-[#E1E2E6] flex justify-between text-[#9597A0] text-[12px] leading-[17px]">
                    <span>You commented</span>
                    <span>Jun 4, 11:45 pm</span>
                  </div>
                  <span className="p-4">
                    Hi @Bimbo. {`Here's`} the file you asked for. Sorry I sent
                    it in late
                  </span>
                </div>
              </div>
              <div className="flex gap-x-2">
                <span>
                  <span className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#FAEAD4] ">
                    C
                  </span>
                </span>
                <div className="flex flex-col bg-white rounded-[8px]">
                  <div className="p-4 border-b-[1px] border-[#E1E2E6] flex justify-between text-[#9597A0] text-[12px] leading-[17px]">
                    <span>You commented</span>
                    <span>Jun 4, 11:45 pm</span>
                  </div>
                  <span className="p-4">
                    Hi @Bimbo. {`Here's`} the file you asked for. Sorry I sent
                    it in late
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-[#9597A0] text-[12px] leading-[17px]">
                <span>Bimbo edited this file</span>
                <span>Jun 4, 11:45 pm</span>
              </div>
              <div className="flex justify-between text-[#9597A0] text-[12px] leading-[17px]">
                <span>You edited this file</span>
                <span>Jun 4, 11:45 pm</span>
              </div> */}
            </div>
          </div>
          <div className="h-[80px] bg-white p-3">
            <div className="cursor-pointer rounded-[100px] p-4 relative border-[1px] border-[#ABAEB4]">
              <span
                onClick={() => {
                  if (!text) return;

                  addComment({
                    variables: {
                      input: {
                        reportId: id,
                        comment: text,
                      },
                    },
                  });
                }}
                className="absolute right-2 top-2 w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#071A7E] "
              >
                <PaperPlaneRight size={23} color="white" />
              </span>

              <input
                className="bg-transparent outline-none placeholder:text-[#303030]"
                placeholder="Write a comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
