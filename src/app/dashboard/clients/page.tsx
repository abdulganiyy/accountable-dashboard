"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { twMerge } from "tailwind-merge";

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
} from "@phosphor-icons/react";
import { GET_USER, CUSTOMERS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const Client = ({ item }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <tr className="border-b-[#E6E6E6] border-[1px] bg-white">
      <td className="px-6 py-4 text-left">
        {`${item?.firstName} ${item?.lastName}` || "Chukwuemeka Ezechuckwu"}
      </td>
      <td className="px-6 py-4 text-left">
        {item?.email || `chukwuemeka@example.com`}
      </td>
      <td className="px-6 py-4 text-left">
        {item?.phone?.slice(0, 10) || `-`}
      </td>
      <td className="px-6 py-4 text-left">
        {item?.createdAt?.slice(0, 10) || `2023-05-01`}
      </td>
      <td className="px-6 py-4 text-left">
        <div
          className={twMerge(
            `inline-flex gap-x-2 items-center bg-[#ECFDF3] text-[#039855] rounded-[20px] py-1 px-3`,
            !item?.manager ? "bg-[#F9F9F9] text-[#414141]" : ""
          )}
        >
          <span
            className={twMerge(
              `w-[8px] h-[8px] bg-[#039855] rounded-full flex justify-center items-center`,
              !item?.manager ? "bg-[#414141] text-[#414141]" : ""
            )}
          ></span>
          <div>{item?.manager ? "Assigned" : "Unassigned"}</div>
        </div>
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
                  router.push(`/dashboard/clients/${item?.id}`);
                }}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <Eye /> View
              </div>
              {/* <a
                // href={item?.files[0]?.url}
                target="_blank"
                rel="noopener"
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <DownloadSimple /> Download
              </a> */}
            </div>
          )}
        </span>
      </td>
    </tr>
  );
};

const Page = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const { loading, data, error } = useQuery(GET_USER);

  const resp = useQuery(CUSTOMERS, {
    variables: {
      input: search
        ? { limit: 10, page, search, paginate: true }
        : { limit: 10, page, paginate: true },
    },
  });

  // const router = useRouter();

  useEffect(() => {
    if (resp.data?.customers?.code) {
      toast.error(resp.data?.customers?.message);
    } else if (resp.data?.customers?.data) {
      console.log(resp.data?.customers?.data);
      setUsers(resp.data?.customers?.data);
      console.log(resp.data?.customers?.pagination);
      setPages(resp.data?.customers?.pagination?.pages);
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
      <h1 className="font-semibold text-[28px] leading-[34px] text-[#060809]">
        Clients
      </h1>
      <div className="mt-6">
        <div className="min-h-[384px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl mt-6">
          <div className="h-[62px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
            <span className="text-[18px] leading-[26px]">Client List</span>
            <div className="flex gap-x-2 items-center">
              <div className="bg-black/5 w-[289px] h-[36px] rounded-md flex items-center gap-x-1 px-2">
                <MagnifyingGlass color="#06080933" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none placeholder:text-[#06080933]"
                  placeholder="Search clients"
                />
              </div>
              <button
                onClick={() => {
                  // setShowFilter(!showFilter);
                }}
                className="relative border-[2px] border-[#EAEDEF] bg-white text-[#585858] py-2 px-4 rounded-[4px] font-medium text-[14px] leading-[20px] h-[36px] flex items-center gap-x-1"
              >
                <Faders size={20} /> Filter by <CaretDown />
                {/* {showFilter && (
                  <div className="absolute p-3 z-50 bg-white border-[1px] border-[#E6E6E6] right-0 top-full w-[200px] h-auto rounded-[8px] overflow-hidden flex flex-col gap-y-3">
                    <div
                      onClick={() => {}}
                      className="cursor-pointer flex gap-x-3 items-center"
                    >
                      Linked Acccount
                    </div>
                    <div
                      onClick={() => {}}
                      className="cursor-pointer flex gap-x-3 items-center"
                    >
                      Email Verified
                    </div>
                  </div>
                )} */}
              </button>
            </div>
          </div>
          <div className="">
            <table className="w-full">
              <thead>
                <tr className="font-semibold bg-[#F9F9F9] text-[#414141] text-[14px] leading-[20px]">
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span>NAME</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span>EMAIL</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span>PHONE NUMBER</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span>JOINED ON</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span>STATUS</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {/* {new Array(9).fill(0).map((item, i) => (
                  <Client key={i} />
                ))} */}
                {users?.length !== 0 &&
                  users?.map((item: any, i: number) => (
                    <Client item={item} key={i} />
                  ))}
              </tbody>
            </table>
            <div className="p-6 flex justify-between items-center">
              <div className="text-[#414141] text-[14px] leading-[20px]">
                Showing {users?.length} out of{" "}
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
