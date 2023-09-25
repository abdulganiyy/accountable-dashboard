"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { twMerge } from "tailwind-merge";
import { currenciesDetails } from "@/utils";
import {
  ArrowUp,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Faders,
  CaretDown,
  DotsThreeVertical,
  Eye,
  DownloadSimple,
  ChartPieSlice,
  Star,
  Receipt,
  CalendarCheck,
  ChatCircleText,
  FileText,
  ArrowLeft,
  Warning,
  User,
  SuitcaseSimple,
  Money,
  PokerChip,
  Scales,
  Bank,
  Rocket,
  Target,
} from "@phosphor-icons/react";
import { GET_USER, SERVICE, SUBSCRIPTIONS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const Subscriber = ({ item }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <tr className="border-b-[#E6E6E6] border-[1px] bg-white">
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        <div className="flex gap-x-2 items-center">
          <span className="text-[14px] leading-[17px] w-[40px] h-[40px] flex items-center justify-center bg-[#FAEAD4] rounded-full">
            {`${item?.initiator?.firstName?.slice(
              0,
              1
            )}${item?.initiator?.lastName?.slice(0, 1)}` || "Jacob Jones"}
          </span>{" "}
          {`${item?.initiator?.firstName} ${item?.initiator?.lastName}` ||
            "Jacob Jones"}
        </div>
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.initiator?.email || `jacobjones@example.com`}
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.purchasedOn || `20 Oct 2023 11:00 pm`}
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.nextDue || `20 Oct 2023 11:00 pm`}
      </td>
      <td className="px-6 py-4 text-left">
        <span className="relative">
          <DotsThreeVertical
            className="cursor-pointer"
            size={32}
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute p-3 z-50 bg-white border-[1px] border-[#E6E6E6] right-0 top-full w-[241px] h-auto rounded-[8px] overflow-hidden flex flex-col gap-y-3">
              <div
                onClick={() => {
                  // router.push(`/dashboard/subscribers/2`);
                }}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <Eye /> View
              </div>
            </div>
          )}
        </span>
      </td>
    </tr>
  );
};

interface PageProps {
  params: { id: string };
}

const Page: FC<PageProps> = ({ params: { id } }) => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [subscribers, setSubscribers] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [service, setService] = useState<any>(null);

  const { loading, data, error } = useQuery(GET_USER);

  const res = useQuery(SUBSCRIPTIONS, {
    variables: {
      input: { limit: 10, page, paginate: true },
    },
  });

  useEffect(() => {
    if (res.data?.getSubscriptions?.code) {
      toast.error(res.data?.getSubscriptions?.message);
    } else if (res.data?.getSubscriptions?.data) {
      console.log(res.data?.getSubscriptions?.data);
      setSubscribers(res.data?.getSubscriptions?.data);
      console.log(res.data?.getSubscriptions?.pagination);
      setPages(res.data?.getSubscriptions?.pagination?.pages);
    }
  }, [res.data]);

  useEffect(() => {
    const storedUser = localStorage?.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const router = useRouter();

  const resp = useQuery(SERVICE, {
    variables: {
      input: { serviceId: id },
    },
  });

  useEffect(() => {
    if (resp.data?.getService?.code) {
      toast.error(resp.data?.getService?.message);
    } else if (resp.data?.getService?.data) {
      console.log(resp.data?.getService?.data);
      setService(resp.data?.getService?.data);
    }
  }, [resp.data]);

  // if (loading)
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <BeatLoader />
  //     </div>
  //   );

  return (
    <div>
      <div
        onClick={() => {
          router.push("/dashboard/services");
        }}
        className="flex items-center gap-x-2 text-[#414141] text-[16px] leading-[23.2px] cursor-pointer"
      >
        <ArrowLeft /> <span>Back to Services</span>
      </div>
      <div className="flex justify-between mt-[31px]">
        <div>
          <h3 className="font-extrabold text-[28px] leading-[42px] text-[#060809]">
            {service?.name || `Monthly Bookkeeping`}
          </h3>
        </div>
        <div className="flex items-center gap-x-2">
          <Button className="w-[95px] bg-white text-[#414141] border-[2px] border-[#7D839866]">
            Delete
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="w-[156px] relative"
          >
            <span className="flex gap-x-2 items-center">Edit service</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 mt-6">
        <div className="bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
          <div className="h-[52px] flex justify-between items-center px-4 border-b-[1px] border-[#EAEDEF]">
            General Details
          </div>
          <div className="p-4">
            <table>
              <tbody>
                <tr className="text-[#4C4E59]">
                  <td className="pr-[100px] py-2 text-left">Service name</td>
                  <td className="pr-[100px] py-2 text-left">
                    {service?.name || `Bookkeeping`}
                  </td>
                </tr>
                <tr className="text-[#4C4E59]">
                  <td className="pr-[100px] py-2 text-left">Description</td>
                  <td className="pr-[100px] py-2 text-left">
                    {service?.description ||
                      `From marketing to contracts, Zapier streamlines your
                    business ops—so you grow more and grumble less.`}
                  </td>
                </tr>
                <tr className="text-[#4C4E59]">
                  <td className="pr-[100px] py-2 text-left">Amount</td>
                  <td className="pr-[100px] py-2 text-left">
                    {currenciesDetails[service?.currency].symbol}
                    {service?.price.toLocaleString("en-US") || `$1,435,000`}
                  </td>
                </tr>
                <tr className="text-[#4C4E59]">
                  <td className="pr-[100px] py-2 text-left">Frequency</td>
                  <td className="pr-[100px] py-2 text-left">
                    {service?.frequency || `One - time`}
                  </td>
                </tr>
                <tr className="text-[#4C4E59]">
                  <td className="pr-[100px] py-2 text-left">Payment Tyoe</td>
                  <td className="pr-[100px] py-2 text-left">
                    {service?.subscription === true ? `Pre-paid` : `Post-paid`}
                  </td>
                </tr>
                {/* <tr className="text-[#4C4E59]">
                  <td className="pr-[100px] py-2 text-left">Status</td>
                  <td className="pr-[100px] py-2 text-left">
                    <div
                      className={twMerge(
                        `flex gap-x-2 items-center bg-[#ECFDF3] text-[#039855] w-[83px] rounded-[20px] py-1 px-3`,
                        user?.status === "PENDING" &&
                          "bg-[#F9F9F9] text-[#414141]"
                      )}
                    >
                      <span
                        className={twMerge(
                          `w-[8px] h-[8px] bg-[#039855] rounded-full flex justify-center items-center`,
                          user?.status === "PENDING" && "bg-[#414141]"
                        )}
                      ></span>
                      <div>
                       
                        Active
                      </div>
                    </div>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="min-h-[384px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl mt-6">
          <div className="h-[62px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
            <span className="text-[18px] leading-[26px]">
              {subscribers?.length || "2,345"} Subscribers
            </span>
            <div className="flex gap-x-2 items-center">
              <div className="bg-black/5 w-[289px] h-[36px] rounded-md flex items-center gap-x-1 px-2">
                <MagnifyingGlass color="#06080933" />
                <input
                  // value={search}
                  // onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none placeholder:text-[#06080933]"
                  placeholder="Search members"
                />
              </div>
              <button
                onClick={() => {}}
                className="border-[2px] border-[#EAEDEF] bg-white text-[#585858] py-2 px-4 rounded-[4px] font-medium text-[14px] leading-[20px] h-[36px] flex items-center gap-x-1"
              >
                <Faders size={20} /> Filter by <CaretDown />
              </button>
            </div>
          </div>
          <div className="">
            <table className="w-full">
              <thead>
                <tr className="font-semibold bg-[#F9F9F9] text-[#414141] text-[14px] leading-[20px]">
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">NAME</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">EMAIL</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">PURCHASED ON</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">NEXT DUE</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {/* {new Array(9).fill(0).map((item, i) => (
                  <Subscriber key={i} />
                ))} */}
                {subscribers?.length !== 0 &&
                  subscribers?.map((item: any, i: number) => (
                    <Subscriber item={item} key={i} />
                  ))}
              </tbody>
            </table>
            <div className="p-6 flex justify-between items-center">
              <div className="text-[#414141] text-[14px] leading-[20px]">
                Showing {subscribers?.length} out of{" "}
                <span className="font-semibold">{pages * 10} results</span>
              </div>
              <div className="flex justify-between items-center gap-x-3">
                <span
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
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

                <span
                  onClick={() => {
                    if (page < pages) {
                      setPage(page + 1);
                    }
                  }}
                  className="cursor-pointer border-[1px] border-[#F2F4F7] p-[6px] w-[36px] h-[36px] flex items-center justify-center rounded-[6px]"
                >
                  <CaretRight size={20} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
