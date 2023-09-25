"use client";
import React, { FC, useState, useEffect } from "react";
import Button from "@/components/buttons/Button";
import Image from "next/image";
import {
  X,
  PaperPlaneTilt,
  Lightning,
  ArrowUp,
  CaretDown,
  DotsThreeVertical,
  Timer,
  CaretLeft,
  CaretRight,
  FileText,
  CalendarBlank,
  BellRinging,
  Eye,
  DownloadSimple,
  MagnifyingGlass,
  DotsThree,
} from "@phosphor-icons/react";
import { Portal } from "@/components/Portal";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { DevTool } from "@hookform/devtools";
import TextArea from "@/components/inputs/TextArea";
import TextInput from "@/components/inputs/TextInput";
import DatePicker from "@/components/inputs/DatePicker";
import { ToastContainer, toast } from "react-toastify";
import SingleDragAndDrop from "@/components/inputs/SingleDragAndDrop";
import {
  REQUEST_REPORT,
  SEND_FILE_TO_ACCOUNT_MANAGER,
} from "@/graphql/mutations";
import {
  GET_REPORT_SUMMARY,
  GET_REPORTS_AND_FILES,
  RETRIEVE_FEED,
  GET_USER,
} from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { BeatLoader } from "react-spinners";

interface ReportProps {
  name?: string;
  dueDate?: string;
  status?: string;
  id?: string;
}

interface ActivityProps {
  item?: any;
}

const Activity: FC<ActivityProps> = ({
  item: {
    name = "Projected Revenue 2024",
    type = "file",
    createdAt = "2023-08-21",
    dueDate = "2023-09-16",
    comment = [],
    id = "64d2d5f363134032a97cc12a",
  },
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [uploadFile, setUploadFile] = useState(false);
  const [uploadFileSuccess, setUploadFileSuccess] = useState(false);
  const [file, setFile] = useState<any>(null);

  const router = useRouter();

  const [sendFile, result] = useMutation(SEND_FILE_TO_ACCOUNT_MANAGER);

  useEffect(() => {
    console.log(result.data?.sendFileToAccountManager);

    if (result.data?.sendFileToAccountManager?.code) {
      // reset();
      toast.error(result.data?.sendFileToAccountManager?.message);
    } else if (result.data?.sendFileToAccountManager?.data?.id) {
      console.log(result.data?.sendFileToAccountManager?.data);

      setUploadFile(false);
      setUploadFileSuccess(true);
      // router.push(`/passwordlink?email=${result.data?.register?.data?.email}`);
    }
  }, [result.data]);

  return (
    <div className="flex gap-x-2">
      <span className="text-[#A0A0A0] bg-[#F2F3F7] p-[6px] w-[40px] h-[40px] rounded-md flex items-center justify-center text-white">
        <BellRinging color="black" size={24} />
      </span>
      <span className="flex flex-col gap-y-1">
        <span className="text-[#3B3C41] font-medium text-[12px] leading-[20px]">
          {type === "FILES"
            ? `Your account manager has requested a file “${name}” from you `
            : `Your account manager has sent you a new report “${name}”`}
        </span>
        <span className="flex items-center gap-x-2 text-[#191919] font-medium text-[14px] leading-[20px]">
          <span className="text-[#4C4E59] text-[12px] leading-[17px]">
            {moment(new Date(createdAt)).fromNow()}
          </span>
          <span className="text-[#9E9FA0]">•</span>
          <span
            onClick={() => {
              if (type !== "FILES") {
                router.push(`/dashboard/reports/${id}`);
              } else {
                setShowDetails(true);
              }
            }}
            className="cursor-pointer text-[#4C4E59] font-medium text-[12px] leading-[17px]"
          >
            {type === "FILES" ? `View details` : `View report`}
          </span>
        </span>
      </span>
      <span>
        <span className="inline-block self-center h-[8px] w-[8px] bg-[#DC6803] rounded-full"></span>
      </span>
      {type === "FILES" && showDetails && (
        <Portal
          onClose={() => {
            setShowDetails(false);
          }}
        >
          <div className="w-[483px] bg-white rounded-[16px] flex flex-col">
            <div className="h-[60px] px-6 py-4 border-b-[1px] border-[#0000001F] font-semibold	text-[20px] leading-[28px]">
              You have a file upload request
            </div>
            <div className="p-6 flex flex-col gap-y-4">
              <p className="text-[#3B3C41] text-[14px] leading-[20px]">
                {/* Your account manager has requested a file “Financial Report for
                2023” from you */}
                {`Your account manager has requested a file “${name}” from you `}
              </p>
              <div className="flex flex-col gap-y-2">
                <h4 className="text-[#060809] font-semibold text-[14px] leading-[20px]">
                  Due on:
                </h4>
                <p className="text-[#3B3C41] text-[14px] leading-[20px]">
                  {new Intl.DateTimeFormat("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(dueDate))}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <h4 className="text-[#060809] font-semibold text-[14px] leading-[20px]">
                  Additional Note:
                </h4>
                <p className="text-[#3B3C41] text-[14px] leading-[20px]">
                  {comment.length != 0
                    ? comment![0]?.text
                    : `Hi David, Please send a csv file containing your financial
                  report for 2023, We’d need this to analyze and create a
                  spreadsheet of your growth projections for 2024.`}
                </p>
                <p className="text-[#3B3C41] text-[14px] leading-[20px]">
                  Thank you!
                </p>
              </div>
            </div>
            <div className="w-full rounded-b-[16px] bg-[#F2F3F7] flex justify-end gap-x-2 mt-5 px-6 py-4 pb-8">
              <Button className="w-[207px] bg-white text-[#071A7E] border-[2px] border-[#EAEDEF]">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDetails(false);
                  setUploadFile(true);
                }}
                className="w-[176px]"
              >
                Upload file
              </Button>
            </div>
          </div>
        </Portal>
      )}
      {uploadFile && (
        <Portal
          onClose={() => {
            setUploadFile(false);
          }}
        >
          <div className="w-[483px] bg-white rounded-[16px] flex flex-col">
            <div className="px-6 py-4 border-b-[1px] border-[#0000001F] font-semibold	text-[20px] leading-[28px]">
              Upload File
            </div>
            <div className="flex flex-col h-full grow justify-between">
              <div>
                <div className="px-6 py-4">
                  {/* <DragAndDropUpload setStatements={setStatements} /> */}
                  <SingleDragAndDrop setFile={setFile} />
                </div>
                <div className="px-6">
                  {file && (
                    <div className="py-4 px-3 flex border-[1px] rounded-[16px] border-[#E6E6E6E5] gap-x-2 relative">
                      <span className="cursor-pointer absolute w-[16px] h-[16px] top-[18px] right-[14px] border-[1px] rounded-full border-[#000000] flex justify-center items-center">
                        <X size={8} />
                      </span>
                      <span className="w-[40px] h-[40px] bg-[#F1FFF7] rounded-full flex justify-center items-center">
                        <Image
                          src="/csvfile.svg"
                          alt="csv"
                          height={23}
                          width={20}
                        />
                      </span>
                      <div>
                        <p>
                          {file?.name || `Bank statement - July 2022`}.
                          {file?.ext}{" "}
                        </p>
                        <p className="text-[12px] leading-[14px]">
                          {/* <span className="text-[#9E9FA0]">•</span>{" "} */}
                          102 KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-b-[16px] bg-[#F2F3F7] flex justify-end gap-x-2 mt-5 px-6 py-4 pb-8">
              <Button className="w-[95px] bg-white text-[#071A7E] border-[2px] border-[#EAEDEF]">
                Cancel
              </Button>
              <Button
                isLoading={result?.loading}
                className="w-[156px]"
                // onClick={createTrialBalanceHandler}
                onClick={() => {
                  if (!file?.link) return;

                  sendFile({
                    variables: {
                      input: {
                        files: [file.link],
                        reportId: id,
                      },
                    },
                  });
                }}
              >
                Send File
              </Button>
            </div>
            <ToastContainer />
          </div>
        </Portal>
      )}
      {uploadFileSuccess && (
        <Portal
          onClose={() => {
            setUploadFileSuccess(false);
          }}
        >
          <div className="bg-white h-[388px] w-[517px] rounded-[16px]">
            <div className="flex flex-col pt-[65px] gap-y-4 items-center h-full">
              <Image src="/verify-icon.svg" alt="Logo" width={72} height={72} />
              <div className="mt-[32px] text-[#060809] font-smibold text-[20px] leading-[28px]">
                Upload Complete
              </div>
              <div className="max-w-[278px] mb-4 text-center text-[#04050F] font-normal text-[16px] leading-[24px]">
                Your file has been successfully sent to your account manager
              </div>
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  className="w-[175px]"
                  // onClick={() => {
                  //   setUploadFileSuccess(false);
                  // }}
                >
                  View File
                </Button>
                <Button
                  type="button"
                  className="w-[175px]  bg-white text-[#071A7E] border-[2px] border-[#EAEDEF]"
                  onClick={() => {
                    setUploadFileSuccess(false);
                  }}
                >
                  Back to dashboard
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

const Report: FC<ReportProps> = ({
  name = "Projected Revenue 2024",
  dueDate = "16 Sept, 2023",
  status = "Requested",
  id = "64d2d5f363134032a97cc12a",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <span className="flex justify-between items-center gap-x-3">
        <span className="text-[#A0A0A0] bg-[#F2F3F7] p-[6px] w-[40px] h-[40px] rounded-full flex items-center justify-center text-white">
          <FileText color="black" size={24} />
        </span>
        <span className="flex flex-col gap-y-1">
          <span className="text-[#3B3C41] font-medium text-[12px] leading-[20px]">
            {name}
          </span>
          <span className="flex justify-between items-center gap-x-2 text-[#191919] font-medium text-[14px] leading-[20px]">
            <CalendarBlank size={16} color="black" />{" "}
            <span className="text-[#4C4E59] text-[12px] leading-[17px]">
              {`Due on `}
              {new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(dueDate))}
            </span>
            <span className="text-[#9E9FA0]">•</span>
            <span className="capitalize text-[#4C4E59] font-medium text-[12px] leading-[17px]">
              {status}
            </span>
          </span>
        </span>
      </span>
      <span>
        <span className="flex items-center gap-x-1">
          <span className="relative">
            <DotsThreeVertical
              className="cursor-pointer"
              size={32}
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute p-3 z-50 bg-white border-[1px] border-[#E6E6E6] top-full right-0 w-[241px] h-auto rounded-[8px] overflow-hidden flex flex-col gap-y-3">
                <div
                  onClick={() => {
                    router.push(`/dashboard/reports/${id}`);
                  }}
                  className="cursor-pointer flex gap-x-3 items-center"
                >
                  <Eye /> View
                </div>
                {/* <a
                href={item?.files[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <DownloadSimple /> Download
              </a> */}
              </div>
            )}
          </span>
        </span>
      </span>
    </div>
  );
};

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
      <td className="px-6 py-4 text-left">{item?.type || `REPORT`}</td>
      <td className="px-6 py-4 text-left">
        {item?.createdAt.slice(0, 10) || `2023-05-01`}
      </td>
      {/* <td className="px-6 py-4 text-left">
    <div className="flex gap-x-2 items-center bg-[#F2F3F7] rounded-[20px] py-1 px-3">
      <span className="w-[8px] h-[8px] bg-[#33397B] rounded-full flex justify-center items-center"></span>
      <div>Completed</div>
    </div>
  </td> */}
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

const ActivitiesFeed = () => {
  const [activities, setActivities] = useState<any[]>([]);

  const res = useQuery(RETRIEVE_FEED, {
    variables: {
      input: { limit: 3 },
    },
  });

  // const router = useRouter();

  useEffect(() => {
    // console.log(res.data?.getReportSummary);

    if (res.data?.retrieveActivityFeed?.code) {
      //
      toast.error(res.data?.retrieveActivityFeed?.message);
    } else if (res.data?.retrieveActivityFeed?.data) {
      console.log(res.data?.retrieveActivityFeed?.data);

      setActivities(res.data?.retrieveActivityFeed?.data);
    }
  }, [res.data]);

  //  [
  //     {
  //       filename: "Financial Report for 2023",
  //       type: "report",
  //     },
  //     {
  //       filename: "Income statement for 2022 financials.pdf",
  //       type: "file",
  //     },
  //     {
  //       filename: " 2023 Profit Analysis",
  //       type: "report",
  //     },
  //   ].map((item, i) => <Activity key={i} item={item} />)}

  if (activities?.length == 0) return null;

  return (
    <div className="mb-8 bg-white border-[1px] border-[#E6E6E6] rounded-2xl h-[375px]">
      <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
        <span>Activity Feed</span>
      </div>
      <div className="p-6 flex flex-col gap-y-6">
        {activities?.length !== 0 &&
          activities?.map((item: any, i: number) => (
            <Activity key={i} item={item} />
          ))}
      </div>
    </div>
  );
};

const RequestedReports = () => {
  const [reports, setReports] = useState<any>([]);

  const resp = useQuery(GET_REPORTS_AND_FILES, {
    variables: {
      input: { limit: 7, status: "REQUESTED", type: "REPORT" },
    },
  });

  // const router = useRouter();

  useEffect(() => {
    // console.log(res.data?.retrieveActivityFeed);

    if (resp.data?.getReportsAndFiles?.code) {
      // respet();
      toast.error(resp.data?.getReportsAndFiles?.message);
    } else if (resp.data?.getReportsAndFiles?.data) {
      // console.log(resp.data?.getReportsAndFiles?.data);
      setReports(resp.data?.getReportsAndFiles?.data);
      // console.log(resp.data?.getReportsAndFiles?.pagination);
    }
  }, [resp.data]);

  return (
    <div className="bg-white border-[1px] border-[#E6E6E6] rounded-2xl h-[539px]">
      <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
        <span>Requested Reports</span>
      </div>
      <div className="p-6 ">
        <div className="flex flex-col gap-y-6">
          {reports?.length !== 0 ? (
            reports?.map((item: any, i: number) => (
              <Report
                key={i}
                name={item?.name}
                dueDate={item?.dueDate}
                status={item?.status}
                id={item?.id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-2 gap-y-6">
              <Image
                alt="report"
                src="/emptychart.svg"
                height={172}
                width={104}
              />
              <div className="text-center">
                <p className="text-[14px] leading-[20px] max-w-[257px] text-[#060809]">
                  You’ve not requested any reports from your account manager.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* new Array(7).fill(0).map((item, i) => <Report key={i} />) */}

        {/* 
    
    
    <div className="flex flex-col items-center justify-center px-2 gap-y-6">
      <Image
        alt="report"
        src="/emptychart.svg"
        height={172}
        width={104}
      />
      <div className="text-center">
        <p className="text-[14px] leading-[20px] max-w-[257px] text-[#060809]">
          You’ve not requested any reports from your account manager.
        </p>
      </div>
    </div> */}
      </div>
    </div>
  );
};

const Page = () => {
  const [user, setUser] = useState<any>(null);

  const { loading, data, error } = useQuery(GET_USER);

  useEffect(() => {
    const storedUser = localStorage?.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // console.log(data);
    if (data?.user?.code) {
      console.log(data?.user?.code);
    } else if (data?.user?.data) {
      // setAccountLinked(data?.user?.data?.linkedAccount);
    }
  }, [data]);

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <BeatLoader />
      </div>
    );

  return (
    <div>
      {/* <div className="flex justify-between">
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
            C
          </span>
          <div className="flex flex-col">
            <span>Fredrick Adams</span>
            <span>Your supervisor</span>
          </div>
          <span className="w-[32px] h-[32px] flex items-center justify-center rounded-full border-[1px] border-[#EAEDEF]">
            <CaretDown size={16} />
          </span>
        </div>
      </div> */}
      <div className="flex justify-between mt-[31px]">
        <div>
          <h3 className="font-extrabold text-[28px] leading-[42px] text-[#060809]">
            Files and Report
          </h3>
        </div>
        <div className="flex items-center gap-x-2">
          <Button className="w-[207px] bg-white text-[#071A7E] border-[2px] border-[#071A7E]">
            Request a file
          </Button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-[1fr,390px] gap-x-6">
        <div>
          <div className="bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
            <div className="h-[52px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
              <span>File Summary</span>

              {/* <button
              onClick={() => {}}
              className="w-[213px] bg-[#071A7E] text-white py-2 px-4 rounded-[4px] font-medium text-[14px] leading-[20px] h-[36px]"
            >
            </button> */}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-x-6">
                <div className="border-[1px] border-[#E6E6E6] rounded-[16px] bg-[#E6E6E6]">
                  <div className="py-8 px-6 rounded-t-[16px] flex flex-col gap-y-3 h-[93%] bg-white">
                    <span className="bg-[#F2F3F7] p-[6px] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]">
                      <PaperPlaneTilt size={20} />
                    </span>
                    <span className="font-medium text-[14px] leading-[20px] text-[#4C5259] flex items-center gap-x-1">
                      Completed Reports
                    </span>
                    <span className="font-semibold text-[24px] leading-[35px] text-[#021645]">
                      {"10"}
                    </span>
                  </div>
                </div>
                <div className="border-[1px] border-[#E6E6E6] rounded-[16px] bg-[#E6E6E6]">
                  <div className="py-8 px-6 rounded-t-[16px] flex flex-col gap-y-3 h-[93%] bg-white">
                    <span className="bg-[#F2F3F7] p-[6px] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]">
                      <Lightning size={20} />
                    </span>
                    <span className="font-medium text-[14px] leading-[20px] text-[#4C5259] flex items-center gap-x-1">
                      Files Requested
                    </span>
                    <span className="font-semibold text-[24px] leading-[35px] text-[#021645]">
                      {"150"}
                    </span>
                  </div>
                </div>
                <div className="border-[1px] border-[#E6E6E6] rounded-[16px] bg-[#E6E6E6]">
                  <div className="py-8 px-6 rounded-t-[16px] flex flex-col gap-y-3 h-[93%] bg-white">
                    <span className="bg-[#F2F3F7] p-[6px] w-[32px] h-[32px] flex items-center justify-center rounded-[8px]">
                      <Timer size={20} />
                    </span>
                    <span className="font-medium text-[14px] leading-[20px] text-[#4C5259] flex items-center gap-x-1">
                      Requested Reports
                    </span>
                    <span className="font-semibold text-[24px] leading-[35px] text-[#021645]">
                      {"7"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-white border-[1px] border-[#E6E6E6] rounded-2xl">
            <div className="h-[89px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
              <span>File Summary</span>
              <div className="flex gap-x-2 items-center">
                <div className="bg-black/5 w-[289px] h-[36px] rounded-md flex items-center gap-x-1 px-2">
                  <MagnifyingGlass color="#06080933" />
                  <input
                    // value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent outline-none placeholder:text-[#06080933]"
                    placeholder="Search folders"
                  />
                </div>
                <button
                  onClick={() => {}}
                  className="bg-[#071A7E] text-white py-2 px-4 rounded-[4px] font-medium text-[14px] leading-[20px] h-[36px] flex items-center gap-x-1"
                >
                  Create new
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 p-4">
              {new Array(9).fill(null).map((item: any, i: number) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-y-2 border-[1px] rounded-md border-[#E1E2E6] p-4 relative"
                  >
                    <span className="absolute top-4 right-4 cursor-pointer">
                      <DotsThree size={20} />
                    </span>
                    <span className="w-[40px] h-[40px] border-[1px] rounded-md border-[#E1E2E6] inline-flex justify-center items-center">
                      <Image
                        src={"/folder.svg"}
                        width={20}
                        height={16}
                        alt="folder"
                      />
                    </span>
                    <span>Savannah Nguyen</span>
                    <span>23 files</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {/* Activity feed */}
          <ActivitiesFeed />
          {/* Requested reports */}
          {/* <RequestedReports /> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
