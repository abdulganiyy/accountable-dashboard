"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { twMerge } from "tailwind-merge";
import RequestService from "@/components/RequestService";

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
import { CUSTOMER, GET_USER, MANAGERS } from "@/graphql/queries";
import { ASSIGN_MANAGER } from "@/graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { Portal } from "@/components/Portal";
import SearchboxDropdown from "@/components/inputs/SearchboxDropdown";
import { ToastContainer, toast } from "react-toastify";

interface PageProps {
  params: { id: string };
}

const Page: FC<PageProps> = ({ params: { id } }) => {
  const [customer, setCustomer] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [assignManager, setAssignManager] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [teams, setTeams] = useState([]);
  const [requestService, setRequestService] = useState(false);

  // console.log(id);

  // let items = [
  //   "Chris Rock",
  //   "Christian Fabulous",
  //   "Christian Aguleria",
  //   "Christopher Nolan",
  // ];

  // let items = teams.map((team:any)=>  `${team}`)

  const res = useQuery(MANAGERS, {
    variables: {
      input: { limit: 100 },
    },
  });

  // const router = useRouter();

  useEffect(() => {
    if (res.data?.managers?.code) {
      toast.error(res.data?.managers?.message);
    } else if (res.data?.managers?.data) {
      // console.log(res.data?.managers?.data);
      setTeams(res.data?.managers?.data);
    }
  }, [res.data]);

  const { loading, data, error } = useQuery(GET_USER);

  useEffect(() => {
    const storedUser = localStorage?.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const router = useRouter();

  const resp = useQuery(CUSTOMER, {
    variables: {
      input: { customerId: id },
    },
  });

  // const router = useRouter();

  useEffect(() => {
    if (resp.data?.customer?.code) {
      toast.error(resp.data?.customer?.message);
    } else if (resp.data?.customer?.data) {
      // console.log(resp.data?.customer?.data);
      setCustomer(resp.data?.customer?.data);
    }
  }, [resp.data]);

  const [assign, response] = useMutation(ASSIGN_MANAGER);

  useEffect(() => {
    // console.log(response.data?.getReportSummary);

    if (response.data?.assignManager?.code) {
      //
      toast.error(response.data?.assignManager?.message);
    } else if (response.data?.assignManager?.data) {
      console.log(response.data?.assignManager?.data);
      setAssignManager(false);
      setSelectedItem(null);
    }
  }, [response.data]);

  if (resp?.loading)
    return (
      <div className="h-full flex items-center justify-center">
        <BeatLoader />
      </div>
    );

  return (
    <div>
      <div
        onClick={() => {
          if (requestService) {
            return setRequestService(false);
          }
          router.push("/dashboard/clients");
        }}
        className="flex items-center gap-x-2 text-[#414141] text-[16px] leading-[23.2px] cursor-pointer"
      >
        <ArrowLeft />{" "}
        <span>{!requestService ? "Back to Clients" : "Back to Client"}</span>
      </div>

      {!requestService ? (
        <>
          <div className="flex justify-between mt-[31px]">
            <div>
              <h3 className="font-extrabold text-[28px] leading-[42px] text-[#060809]">
                {`${customer?.firstName} ${customer?.lastName}`}
              </h3>
            </div>
            <div className="flex items-center gap-x-2">
              <Button className="w-[207px] bg-white text-[#071A7E] border-[2px] border-[#071A7E]">
                Send a message
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowDropdown(!showDropdown);
                }}
                className="w-[176px] relative"
              >
                <span className="flex gap-x-2 items-center">
                  Quick Actions <CaretDown />
                </span>
                {showDropdown && (
                  <div className="absolute p-3 z-[1000] bg-white text-black border-[1px] border-[#E6E6E6] right-0 top-full w-[241px] h-auto rounded-[8px] overflow-hidden flex flex-col gap-y-3">
                    <div
                      onClick={() => {
                        setAssignManager(true);
                      }}
                      className="cursor-pointer flex gap-x-3 items-center"
                    >
                      <User /> Assign manager
                    </div>
                    <div
                      onClick={() => {
                        setRequestService(true);
                      }}
                      className="cursor-pointer flex gap-x-3 items-center"
                    >
                      <Target /> Request a service
                    </div>
                    <div
                      onClick={() => {
                        //   router.push(`/dashboard/reports/${item?.id}`);
                      }}
                      className="cursor-pointer flex gap-x-3 items-center text-[#F04438]"
                    >
                      <Warning /> Deactivate User
                    </div>
                    {/* <a
                  href={item?.files[0]?.url}
                  target="_blank"
                  rel="noopener"
                  className="cursor-pointer flex gap-x-3 items-center"
                >
                  <DownloadSimple /> Download
                </a> */}
                  </div>
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 mt-6 relative z-0">
            <div>
              <div className="bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
                <div className="h-[52px] flex justify-between items-center px-4 border-b-[1px] border-[#EAEDEF]">
                  General Details
                </div>
                <div className="p-4">
                  <div className="cursor-pointer flex gap-x-3 items-center mb-5 text-[#9597A0]">
                    <User /> PERSONAL DETAILS
                  </div>
                  <table>
                    <tbody>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">
                          Client name
                        </td>
                        <td className="pr-[100px] py-2 text-left">
                          {`${customer?.firstName} ${customer?.lastName}` ||
                            `Chris Adolphus`}
                        </td>
                      </tr>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">
                          Email address
                        </td>
                        <td className="pr-[100px] py-2 text-left">
                          {customer?.email || `Adolphus19@gmail.com`}
                        </td>
                      </tr>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">
                          Phone number
                        </td>
                        <td className="pr-[100px] py-2 text-left">
                          {" "}
                          {customer?.phone || `0818934756`}
                        </td>
                      </tr>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">Joined on</td>
                        <td className="pr-[100px] py-2 text-left">
                          09 Nov. 2023 12:04:34
                        </td>
                      </tr>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">
                          Assigned on
                        </td>
                        <td className="pr-[100px] py-2 text-left">
                          15 Nov. 2023 12:04:34
                        </td>
                      </tr>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">
                          Assigned to
                        </td>
                        <td className="pr-[100px] py-2 text-left">
                          {customer?.manager
                            ? `${customer?.manager?.firstName} ${customer?.manager?.lastName}`
                            : "-"}
                        </td>
                      </tr>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">Status</td>
                        <td className="pr-[100px] py-2 text-left">
                          <div
                            className={twMerge(
                              `inline-flex gap-x-2 items-center bg-[#ECFDF3] text-[#039855] rounded-[20px] py-1 px-3`,
                              !customer?.manager
                                ? "bg-[#F9F9F9] text-[#414141]"
                                : ""
                            )}
                          >
                            <span
                              className={twMerge(
                                `w-[8px] h-[8px] bg-[#039855] rounded-full flex justify-centcustomers-center`,
                                !customer?.manager
                                  ? "bg-[#414141] text-[#414141]"
                                  : ""
                              )}
                            ></span>
                            <div>
                              {customer?.manager ? "Assigned" : "Unassigned"}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="cursor-pointer flex gap-x-3 items-center my-5 text-[#9597A0]">
                    <SuitcaseSimple /> BUSINESS DETAILS
                  </div>
                  <table>
                    <tbody>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">
                          Business type
                        </td>
                        <td className="pr-[100px] py-2 text-left">
                          Micro Enterprise
                        </td>
                      </tr>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">Industry</td>
                        <td className="pr-[100px] py-2 text-left">
                          Banking & Finance
                        </td>
                      </tr>
                      <tr className="text-[#4C4E59]">
                        <td className="pr-[100px] py-2 text-left">
                          Company name
                        </td>
                        <td className="pr-[100px] py-2 text-left">
                          Nguvu Health LLC
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white border-[1px] border-[#E6E6E6] rounded-2xl mt-6">
                <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
                  Financial Statements
                  <Button className="w-[105px] h-[36px] bg-white text-[#7D839866] border-[1px] border-[#7D839866]">
                    View Details
                  </Button>
                </div>
                <div className="p-4 flex flex-col gap-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-3 items-center">
                      <Money /> All Cash and Assets
                    </div>
                    <div>₦26,000,680</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-3 items-center">
                      <PokerChip /> Assets
                    </div>
                    <div>₦20,000,680</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-3 items-center">
                      <Bank /> Cash in bank
                    </div>
                    <div>₦6,000,680</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-3 items-center">
                      <Scales /> Liabilities
                    </div>
                    <div>₦120,680</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-3 items-center">
                      <Rocket /> Runaway duration
                    </div>
                    <div>10 months</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
                <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
                  Overview
                </div>
                <div className="p-4 flex flex-col gap-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-2 items-center">
                      <FileText color="#9597A0" />{" "}
                      <span className="text-[#4C4E59]">Files shared</span>
                    </div>
                    <div className="flex gap-x-3 items-center">
                      <span className="text-[#3B3C41]">10</span>
                      <Button className="w-[67px] h-[36px] bg-white text-[#414141] border-[1px] border-[#7D839866]/40">
                        View all
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-2 items-center">
                      <ChartPieSlice color="#9597A0" />{" "}
                      <span className="text-[#4C4E59]">Reports created</span>
                    </div>
                    <div className="flex gap-x-3 items-center">
                      <span className="text-[#3B3C41]">10</span>
                      <Button className="w-[67px] h-[36px] bg-white text-[#414141] border-[1px] border-[#7D839866]/40">
                        View all
                      </Button>
                    </div>
                  </div>{" "}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-2 items-center">
                      <Star color="#9597A0" />{" "}
                      <span className="text-[#4C4E59]">
                        Services subscribed
                      </span>
                    </div>
                    <div className="flex gap-x-3 items-center">
                      <span className="text-[#3B3C41]">10</span>
                      <Button className="w-[67px] h-[36px] bg-white text-[#414141] border-[1px] border-[#7D839866]/40">
                        View all
                      </Button>
                    </div>
                  </div>{" "}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-2 items-center">
                      <Star color="#9597A0" />{" "}
                      <span className="text-[#4C4E59]">Invoice created</span>
                    </div>
                    <div className="flex gap-x-3 items-center">
                      <span className="text-[#3B3C41]">10</span>
                      <Button className="w-[67px] h-[36px] bg-white text-[#414141] border-[1px] border-[#7D839866]/40">
                        View all
                      </Button>
                    </div>
                  </div>{" "}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-2 items-center">
                      <CalendarCheck color="#9597A0" />{" "}
                      <span className="text-[#4C4E59]">Scheduled meetings</span>
                    </div>
                    <div className="flex gap-x-3 items-center">
                      <span className="text-[#3B3C41]">10</span>
                      <Button className="w-[67px] h-[36px] bg-white text-[#414141] border-[1px] border-[#7D839866]/40">
                        View all
                      </Button>
                    </div>
                  </div>{" "}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-2 items-center">
                      <ChatCircleText color="#9597A0" />{" "}
                      <span className="text-[#4C4E59]">Messages</span>
                    </div>
                    <div className="flex gap-x-3 items-center">
                      <span className="text-[#3B3C41]">10</span>
                      <Button className="w-[67px] h-[36px] bg-white text-[#414141] border-[1px] border-[#7D839866]/40">
                        View all
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a
                  className="h-[48px] w-[230px] rounded-md flex items-center justify-center bg-[#071A7E] text-white"
                  href={`https://docs.google.com/spreadsheets/d/${customer?.spreadsheet}/edit#gid=0`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View customer spreadsheet
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <RequestService
          customerId={customer?.id}
          setRequestService={setRequestService}
          customerName={`${customer?.firstName} ${customer?.lastName}`}
          customerEmail={customer?.email}
        />
      )}
      {assignManager && (
        <Portal
          onClose={() => {
            setAssignManager(false);
          }}
        >
          <div className="w-[483px] bg-white rounded-[16px] flex flex-col">
            <div className="min-h-[60px] px-6 py-4 border-b-[1px] border-[#0000001F] font-semibold	text-[20px] leading-[28px]">
              Assign manager
            </div>
            <div className="px-6 py-4 h-[306px] overflow-y-auto">
              <SearchboxDropdown
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                items={teams}
              />
            </div>
            <div className="w-full rounded-b-[16px] bg-[#F2F3F7] flex justify-end gap-x-2 mt-5 px-6 py-4 pb-8">
              <Button
                type="button"
                className="w-[207px] bg-white text-[#071A7E] border-[2px] border-[#EAEDEF]"
                onClick={() => {
                  setAssignManager(false);
                }}
              >
                Cancel
              </Button>
              <Button
                isLoading={response.loading}
                disabled={response.loading}
                type="button"
                onClick={() => {
                  assign({
                    variables: {
                      input: {
                        customerId: id,
                        managerId: selectedItem?.id,
                      },
                    },
                  });
                }}
                className="w-[176px]"
              >
                Assign manager
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default Page;
