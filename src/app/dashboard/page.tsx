"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { twMerge } from "tailwind-merge";
import moment from "moment";

import {
  CaretDown,
  PokerChip,
  DotsThreeVertical,
  Money,
  DownloadSimple,
  Info,
  Eye,
  ArrowRight,
  Coins,
  ArrowUp,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { GET_USER, DASHBOARD, GET_AUTH_URL } from "@/graphql/queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import Meeting from "@/components/Meeting";
import { useRouter } from "next/navigation";
import Meetings from "@/components/Meetings";

const FileReport = ({ item }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <tr className="border-b-[#E6E6E6] border-[1px]">
      <td className="px-6 py-4 text-left">
        <div className="flex gap-x-2">
          <span className="w-[40px] h-[40px] bg-[#FEE4E2] rounded-full flex justify-center items-center">
            <Image src="/filepdf.svg" alt="pdf" height={23} width={20} />
          </span>
          <div>
            <p className="text-[14px] leading-[17px] text-[#04050F]">
              {item?.name || `Income statement.pdf`}
            </p>
            <p className="text-[12px] leading-[14px]">102 KB</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="flex gap-x-2 items-center">
          <span className="w-[32px] h-[32px] rounded-full flex justify-center items-center">
            <Image
              alt="manager pic"
              src="/accountofficer.svg"
              height={40}
              width={40}
            />
          </span>
          <div>{item?.fullName || `Devon Lane`}</div>
        </div>
      </td>
      {/* <td className="px-6 py-4 text-left">{item?.type || `REPORT`}</td> */}
      <td className="px-6 py-4 text-left">
        {item?.createdAt.slice(0, 10) || `2023-05-01`}
      </td>
      <td className="px-6 py-4 text-left">
        <span className="relative">
          <DotsThreeVertical
            className="cursor-pointer"
            size={32}
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute p-3 z-50 bg-white border-[1px] border-[#E6E6E6] top-full w-[241px] h-auto rounded-[8px] overflow-hidden flex flex-col gap-y-3">
              <div
                onClick={() => {
                  router.push(`/dashboard/reports/${item?.id}`);
                }}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <Eye /> View
              </div>
              {/* <div className="cursor-pointer flex gap-x-3 items-center">
                <PencilSimpleLine /> Rename
              </div>
               <a
          href="/MoneyHQ-BankStatement1687553920409.xlsx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download sample (102kb)
        </a>
              
              */}
              <a
                href={item?.files[0]?.url}
                target="_blank"
                rel="noopener"
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <DownloadSimple /> Download
              </a>
              {/* <div className="cursor-pointer flex gap-x-3 items-center text-[#F04438]">
                <Trash /> Delete
              </div> */}
            </div>
          )}
        </span>
      </td>
    </tr>
  );
};

const Page = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [filesreports, setFilesReports] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);

  const router = useRouter();

  const { loading, data, error } = useQuery(GET_USER);

  const response = useQuery(DASHBOARD, {
    variables: {
      input: { meeting: true, overview: true, report: true },
    },
  });

  useEffect(() => {
    // console.log(data);
    if (data?.user?.code) {
      console.log(data?.user?.code);
    } else if (data?.user?.data) {
      setUser(data?.user?.data);
    }
  }, [data]);

  // useEffect(() => {
  //   const storedUser = localStorage?.getItem("userData");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  useEffect(() => {
    // console.log(data);
    if (response?.data?.dashboard?.code) {
      console.log(data?.dashboard?.code);
    } else if (response?.data?.dashboard?.data) {
      setDashboard(response?.data?.dashboard?.data);
    }
  }, [response?.data]);

  const [getAuthUrl, res] = useLazyQuery(GET_AUTH_URL);

  useEffect(() => {
    // console.log(data);
    if (res?.data?.getAuthUrl?.code) {
      console.log(res?.data?.getAuthUrl?.code);
    } else if (res?.data?.getAuthUrl?.data) {
      // redirect to link
      console.log(res?.data?.getAuthUrl?.data);
      window.location.assign(res?.data?.getAuthUrl?.data);
    }
  }, [res?.data]);

  if (res?.loading)
    return (
      <div className="h-full flex items-center justify-center">
        <BeatLoader />
      </div>
    );

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h3 className="font-extrabold text-[28px] leading-[42px] text-[#060809]">
            Good morning, {user?.firstName || "Chris!"} 👋
          </h3>
          <p className="text-[#414141] text-[18px] leading-[28px]">
            Welcome back, Let’s get some work done!
          </p>
        </div>
        <div className="bg-white flex items-center gap-x-2 px-5 py-4 rounded-[16px]">
          <span className="w-[40px] h-[40px] flex items-center justify-center bg-[#FAEAD4] rounded-full">
            {user?.firstName?.slice(0, 1).toUpperCase()}
          </span>
          <div className="flex flex-col">
            <span>
              {user?.firstName}
              {` `}
              {user?.lastName}
            </span>
            <span>
              {user?.role === "admin" ? "Supervisor" : "Account manager"}
            </span>
          </div>
          <span className="w-[32px] h-[32px] flex items-center justify-center rounded-full border-[1px] border-[#EAEDEF]">
            <CaretDown size={16} />
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-[1fr,359px] gap-x-6">
        <div>
          <div className="bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
            <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
              <span>General Overview</span>
              <button
                onClick={() => {}}
                className="hidden text-[#555555] border-[1px] border-[#E7E7E7] py-2 px-4 rounded-[4px] font-medium text-[14px] leading-[20px] h-[36px] flex items-center gap-x-1"
              >
                28 Feb 23 – 10 Mar 23 <CaretDown />
              </button>
            </div>
            <div className="p-6 grid grid-cols-3 gap-x-6">
              <div className="border-[1px] border-[#E6E6E6] rounded-[16px] bg-[#E6E6E6]">
                <div className="py-8 px-6 rounded-t-[16px] flex flex-col gap-y-3 h-[93%] bg-white">
                  <span className="bg-[#F2F3F7] p-[6px] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]">
                    <PokerChip size={20} />
                  </span>
                  <span className="font-medium text-[14px] leading-[20px] text-[#4C5259] flex items-center gap-x-1">
                    Customers messages <Info />
                  </span>
                  <span className="font-semibold text-[24px] leading-[35px] text-[#021645]">
                    {dashboard?.overview?.customerMessages || 0}
                  </span>
                  <span
                    onClick={() => {
                      router.push("/dashboard/messages");
                    }}
                    className="cursor-pointer text-[12px] leading-[17px] text-[#00085A] flex items-center gap-x-1 py-3 border-t-[1px] border-[#E6E6E6]"
                  >
                    <span>Send a new message</span>
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
              <div className="border-[1px] border-[#E6E6E6] rounded-[16px] bg-[#E6E6E6]">
                <div className="py-8 px-6 rounded-t-[16px] flex flex-col gap-y-3 h-[93%] bg-white">
                  <span className="bg-[#F2F3F7] p-[6px] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]">
                    <Coins size={20} />
                  </span>
                  <span className="font-medium text-[14px] leading-[20px] text-[#4C5259] flex items-center gap-x-1">
                    Scheduled meetings <Info />
                  </span>
                  <span className="font-semibold text-[24px] leading-[35px] text-[#021645]">
                    {dashboard?.overview?.scheduledMeetings || 0}
                  </span>
                  <span
                    onClick={() => {
                      router.push("/dashboard/meeting");
                    }}
                    className="cursor-pointer text-[12px] leading-[17px] text-[#00085A] flex items-center gap-x-1 py-3 border-t-[1px] border-[#E6E6E6]"
                  >
                    <span>Schedule a new meeting</span>
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
              <div className="border-[1px] border-[#E6E6E6] rounded-[16px] bg-[#E6E6E6]">
                <div className="py-8 px-6 rounded-t-[16px] flex flex-col gap-y-3 h-[93%] bg-white">
                  <span className="bg-[#F2F3F7] p-[6px] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]">
                    <Money size={20} />
                  </span>
                  <span className="font-medium text-[14px] leading-[20px] text-[#4C5259] flex items-center gap-x-1">
                    Files requested <Info />
                  </span>
                  <span className="font-semibold text-[24px] leading-[35px] text-[#021645]">
                    {dashboard?.overview?.filesRequested || 0}
                  </span>
                  <span
                    onClick={() => {
                      // setMore("expenditure");
                    }}
                    className="cursor-pointer text-[12px] leading-[17px] text-[#00085A] flex items-center gap-x-1 py-3 border-t-[1px] border-[#E6E6E6]"
                  >
                    <span>Request a new file</span>
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* reports */}

        {dashboard?.report?.length ? (
          <div className="max-h-[384px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
            <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
              <span className="text-[18px] leading-[26px]">Reports</span>
              <span className="text-[#00085A] text-[14px] leading-[20px]">
                View all reports
              </span>
            </div>
            <div className="">
              <table className="w-full">
                <thead>
                  <tr className="font-semibold bg-[#F9F9F9] text-[#414141] text-[14px] leading-[20px]">
                    <th className="px-6 py-4 text-left">
                      <span className="flex items-center gap-x-1">
                        <span>FILE NAME</span>
                        <ArrowUp size={16} />
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="flex items-center gap-x-1">
                        <span>OWNER</span>
                        <ArrowUp size={16} />
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="flex items-center gap-x-1">
                        <span>DATE CREATED</span>
                        <ArrowUp size={16} />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard?.report?.map((item: any, i: number) => (
                    <FileReport item={item} key={i} />
                  ))}
                </tbody>
              </table>
              <div className="p-6 flex justify-between items-center">
                <div className="text-[#414141] text-[14px] leading-[20px]">
                  Showing {filesreports?.length} out of{" "}
                  <span className="font-semibold">{pages * 10} results</span>
                </div>
                <div className="flex justify-between items-center gap-x-3">
                  <span
                    // onClick={() => {
                    //   if (page > 1) {
                    //     setPage(page - 1);
                    //   }
                    // }}
                    className="cursor-pointer border-[1px] border-[#F2F4F7] p-[6px] w-[36px] h-[36px] flex items-center justify-center rounded-[6px]"
                  >
                    <CaretLeft size={20} />
                  </span>
                  {pages >= 1 &&
                    new Array(pages).fill(null).map((_, i: number) => {
                      return (
                        <span
                          key={i}
                          onClick={() => {
                            if (page === i + 1) return;

                            setPage(i + 1);
                          }}
                          className={twMerge(
                            `cursor-pointer text-[#A0A0A0]`,
                            page === i + 1 &&
                              "bg-[#666B9C] p-[6px] w-[36px] h-[36px] rounded-full flex items-center justify-center text-white"
                          )}
                        >
                          {i + 1}
                        </span>
                      );
                    })}
                  {/* <span className="text-[#A0A0A0]">1</span>
                   <span className="text-[#A0A0A0]">2</span>
                   <span className="text-[#A0A0A0]">3</span>
                   <span className="text-[#A0A0A0] bg-[#666B9C] p-[6px] w-[36px] h-[36px] rounded-full flex items-center justify-center text-white">
                     4
                   </span>
                   <span className="text-[#A0A0A0]">5</span>
                   <span className="text-[#A0A0A0]">6</span> */}
                  <span
                    // onClick={() => {
                    //   if (page < pages) {
                    //     setPage(page + 1);
                    //   }
                    // }}
                    className="cursor-pointer border-[1px] border-[#F2F4F7] p-[6px] w-[36px] h-[36px] flex items-center justify-center rounded-[6px]"
                  >
                    <CaretRight size={20} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-h-[384px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
            <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
              <span className="text-[18px] leading-[26px]">Reports</span>
              <span className="text-[#00085A] text-[14px] leading-[20px]">
                View all reports
              </span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 pt-[55px] gap-y-10">
              <Image
                alt="report-icon"
                src="/report.svg"
                height={72}
                width={72}
              />
              <div className="text-center">
                <p className="text-[14px] leading-[22px] max-w-[338px] pt-4">
                  You have not requested any files or created any report yet.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {" "}
        {/* meetings */}
        {Boolean(!user?.google) ? (
          <>
            {" "}
            <div className="h-[471px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl mt-8">
              <div className="h-[68px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
                Getting Started
              </div>
              <div className="flex flex-col items-center justify-center px-2 pt-12 gap-y-10">
                <Image
                  alt="calendar-icon"
                  src="/calendar-icon.svg"
                  height={72}
                  width={72}
                />
                <div className="text-center">
                  <h4 className="text-[#04050F] font-semibold text-[16px] leading-[26px]">
                    Set up your calendar
                  </h4>
                  <p className="text-[14px] leading-[22px] max-w-[338px] pt-4">
                    You are yet to set your availability. Click the button below
                    to connect to your Google calendar
                  </p>
                  <span className="mx-auto block w-[184px] pt-[40px]">
                    <Button
                      onClick={() => {
                        getAuthUrl();
                      }}
                    >
                      Setup calander
                    </Button>
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Meetings />
        )}
      </div>
    </div>
  );
};

export default Page;

{
  /* <div>
          <div className="h-[355px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
            <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
              <span className="font-medium text-[18px] leading-[26px]">
                Upcoming Meetings
              </span>
              <span className="text-[#00085A] text-[14px] leading-[20px]">
                View Calendar
              </span>
            </div>
            {dashboard?.meeting?.length ? (
              <div className="p-4 overflow-x-auto">
                <div className="flex gap-x-2">
                  {dashboard?.meeting?.map((item: any, i: number) => (
                    <Meeting
                      details={
                        dashboard?.meeting?.filter((event: any) => {
                          return (
                            // moment(event?.start?.dateTime).isSame(date, "day") &&
                            event?.summary?.includes("Meet")
                          );
                        })[0]
                      }
                      hasDropDown={false}
                      key={i}
                    />
                  ))}
                  {/* <Meeting hasDropDown={false} />
                  <Meeting hasDropDown={false} />
                  <Meeting hasDropDown={false} />
                  <Meeting hasDropDown={false} /> */
}
//     </div>
//   </div>
// ) : (
//   <div className="flex flex-col items-center justify-center px-2 pt-6 gap-y-10">
//     <Image
//       alt="calendar-icon"
//       src="/calendar-icon.svg"
//       height={72}
//       width={72}
//     />
//     <div className="text-center">
//       <p className="text-[18px] fonr-semibold leading-[28px] max-w-[338px] pt-4">
//         No booked meetings
//       </p>
//       <p className="text-[14px] leading-[22px] max-w-[338px] pt-4">
//         All your scheduled meetings will show up here
//       </p>
//     </div>
//   </div>
// )}
{
  /* <div className="p-4 overflow-x-auto">
              <div className="flex gap-x-2">
                <Meeting hasDropDown={false} />
                <Meeting hasDropDown={false} />
                <Meeting hasDropDown={false} />
                <Meeting hasDropDown={false} />
              </div>
            </div> */
}
{
  /* <div className="flex flex-col items-center justify-center px-2 pt-6 gap-y-10">
              <Image
                alt="calendar-icon"
                src="/calendar-icon.svg"
                height={72}
                width={72}
              />
              <div className="text-center">
                <p className="text-[18px] fonr-semibold leading-[28px] max-w-[338px] pt-4">
                  No booked meetings
                </p>
                <p className="text-[14px] leading-[22px] max-w-[338px] pt-4">
                  All your scheduled meetings will show up here
                </p>
              </div>
            </div> */
}
//   </div>
// </div> */}
