"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  DotsThree,
  PaperPlaneRight,
  Paperclip,
  DownloadSimple,
  DotsThreeVertical,
  Eye,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  CONVERSATIONS,
  MESSAGES,
  GET_REPORTS_AND_FILES,
} from "@/graphql/queries";
import { CONVERSATE } from "@/graphql/mutations";
import { NEW_MESSAGE } from "@/graphql/subscriptions";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { S3 } from "aws-sdk";
import { useRouter } from "next/navigation";
import { truncateStr } from "@/utils";
import { twMerge } from "tailwind-merge";

const dummyConversations = [
  {
    firstName: "Chris",
    lastName: "Adolphus",
    img: "/accountofficer.svg",
    id: "re56jyu",
  },
  {
    firstName: "Rochel",
    lastName: "Foose",
    img: "/accountofficer.svg",
    id: "re56lyu",
  },
  {
    firstName: "Hannah",
    lastName: "Burress",
    img: "/accountofficer.svg",
    id: "re59jyu",
  },
];

const FileReport = ({ item }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <div className="flex justify-between">
      <div className="flex gap-x-2">
        <span className="w-[40px] h-[40px] bg-[#FEE4E2] rounded-full flex justify-center items-center">
          <Image src="/filepdf.svg" alt="pdf" height={23} width={20} />
        </span>
        <div>
          <p className="text-[14px] leading-[17px] text-[#04050F]">
            {truncateStr(item?.name, 20) || `Income statement.pdf`}
          </p>
          <p className="text-[12px] leading-[14px]">102 KB</p>
        </div>
      </div>
      <span className="relative">
        <DotsThreeVertical
          className="cursor-pointer"
          size={32}
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {showDropdown && (
          <div className="absolute p-3 z-50 bg-white border-[1px] border-[#E6E6E6] top-full right-0 w-[141px] h-auto rounded-[8px] overflow-hidden flex flex-col gap-y-3">
            <div
              onClick={() => {
                router.push(`/dashboard/files/${item?.id}`);
              }}
              className="cursor-pointer flex gap-x-3 items-center"
            >
              <Eye /> View
            </div>
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
    </div>
  );
};

const Page = () => {
  const [userType, setUserType] = useState("manager");
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [user, setUser] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [filesreports, setFilesReports] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  const { data: subscriptionData, error } = useSubscription(NEW_MESSAGE, {
    variables: {
      input: {
        // recipient: "649995b830ffef309062bf04",
        recipient: user?.id,
      },
    },
  });

  useEffect(() => {
    // console.log(subscriptionData);

    if (subscriptionData) {
      console.log(subscriptionData?.newMessage?.message);
      setMessages((prevMessages: any) => [
        ...prevMessages,
        subscriptionData?.newMessage?.message,
      ]);
    } else if (error) {
      console.log(error);
    }

    // if (subscriptionData && subscriptionData.newMessage) {
    //   console.log(subscriptionData);
    //   // When a new message arrives through the subscription, add it to the list of messages
    //   // setMessages((prevMessages:any) => [...prevMessages, subscriptionData.newMessage]);
    // }
  }, [subscriptionData, error]);

  const handleInputChange = (e: any) => {
    const selected = e.target.files[0];
    // console.log(selected);
    setSelectedFile(selected);
  };

  useEffect(() => {
    // console.log(selectedFile);

    const uploadFile = async () => {
      if (!selectedFile) return;

      try {
        const s3 = new S3({
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
          region: process.env.NEXT_PUBLIC_AWS_S3_REGION_NAME,
        });

        const initialFileName = selectedFile.name.replace(/\s/g, "");
        const fileNameParts = initialFileName.split(".");
        const fileName = fileNameParts[0]; // File name without extension
        const fileExtension = fileNameParts[1]; // File extension

        // Generate a random string
        const randomString = String(Date.now()); // Replace with your random string generation logic

        // Create the new file name with the random string appended
        const newFileName = `${fileName}${randomString}.${fileExtension}`;

        // Define the S3 bucket name and key for the uploaded file
        const bucketName = "monehqapi-publics";
        const key = `upload/${newFileName}`;

        // Prepare the parameters for the upload
        const params: S3.Types.PutObjectRequest = {
          Bucket: bucketName,
          Key: key,
          Body: selectedFile,
          ACL: "public-read", // Set the ACL to make the uploaded file publicly accessible
        };

        // Upload the file to AWS S3
        await s3.upload(params).promise();

        // Generate the file link using the bucket name and key
        const fileLink = `https://${bucketName}.s3.amazonaws.com/${key}`;

        // const link = await uploadToAWSAndGetLink(selectedFile);
        console.log(fileLink);
        setFile({ name: fileName, ext: fileExtension, link: fileLink });
      } catch (error: any) {
        console.log(error.message);
      }
    };

    // uploadFile();
  }, [selectedFile, setFile]);

  useEffect(() => {
    const storedUser = localStorage?.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const resp = useQuery(MESSAGES, {
    variables: {
      input: {
        // conversation: "650982e8fbbb0963e552658e",
        conversation: conversation?.id,
        limit: 100,
        sort: "asc",
      },
    },
    skip: !conversation,
  });

  const res = useQuery(CONVERSATIONS, {
    variables: {
      input: {
        limit: 100,
        sort: "asc",
      },
    },
  });

  useEffect(() => {
    console.log(res.data);

    if (res.data?.conversations?.code) {
      toast.error(res.data?.conversations?.message);
    } else if (res.data?.conversations?.data) {
      // console.log(res.data?.conversations?.data);
      setConversations(res.data?.conversations?.data);
    }
  }, [res.data]);

  useEffect(() => {
    // console.log(resp.data?.conversations);

    if (resp.data?.conversation?.code) {
      toast.error(resp.data?.conversation?.message);
    } else if (resp.data?.conversation?.data) {
      // console.log(resp.data?.conversations?.data);
      setMessages(resp.data?.conversation?.data);
      setText("");
      messagesRef?.current?.scrollIntoView();
    }
  }, [resp.data]);

  const [conversate] = useMutation(CONVERSATE);

  // useEffect(() => {
  //   if (result.data?.conversate?.code) {
  //     toast.error(result.data?.conversate?.message);
  //   } else if (result.data?.conversate?.data?.id) {
  //     // console.log(result.data?.conversate?.data?.id);
  //     setText("");
  //   }
  // }, [result.data]);

  const response = useQuery(GET_REPORTS_AND_FILES, {
    variables: {
      input: { limit: 100, paginate: true, customer: selectedParticipant?.id },
    },
  });

  // const router = useRouter();

  useEffect(() => {
    // console.log(res.data?.retrieveActivityFeed);

    if (response.data?.getReportsAndFiles?.code) {
      // responseet();
      toast.error(response.data?.getReportsAndFiles?.message);
    } else if (response.data?.getReportsAndFiles?.data) {
      console.log(response.data?.getReportsAndFiles?.data);
      setFilesReports(response.data?.getReportsAndFiles?.data);
      console.log(response.data?.getReportsAndFiles?.pagination);
      setPages(response.data?.getReportsAndFiles?.pagination?.pages);
    }
  }, [response.data]);

  useEffect(() => {
    messagesRef?.current?.scrollIntoView();
  }, [messages, userType]);

  const sendMessageHandler = async () => {
    try {
      // const { data } = await sendMessage({ variables: { text: messageText } });

      if (!text) return;

      if (userType === "manager") {
        const { data } = await conversate({
          variables: {
            input: {
              conversation: conversation?.id,
              // recipient: "64891480434ce1b0d1e5a819",
              text,
            },
          },
        });

        console.log(data);

        if (data && data.conversate?.data) {
          // If the message was sent successfully, clear the text field
          setText("");
          setMessages((prevMessages: any) => [
            ...prevMessages,
            data.conversate?.data,
          ]);

          // Notify the parent component that a message was sent
          // if (onMessageSent) {
          //   onMessageSent(data.sendMessage);
          // }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-full grid grid-cols-[246px,1fr]">
      <div>
        <div className="p-6 font-semibold text-[20px] leading-[24px] text-[#060809]">
          Messages
        </div>
        {conversations?.length !== 0
          ? conversations
              .filter((conversationn: any) => {
                return conversationn.participants.find(
                  (participant: any) => participant?.email === user?.email
                );
              })
              .map((conversationn: any) => {
                const participant = conversationn.participants.find(
                  (participant: any) => participant?.email !== user?.email
                );

                return (
                  <div
                    key={conversationn?.id}
                    onClick={() => {
                      setConversation(conversationn);
                      setSelectedParticipant(participant);
                    }}
                    className={`cursor-pointer relative flex gap-x-3 p-4 items-center text-[#3B3C41] shadow-[0_0_0_1px_#E7E7E7] ${
                      conversationn.id === conversation?.id
                        ? "bg-white text-[#071A7E]"
                        : ""
                    }`}
                  >
                    {/* <img
                      alt="participant pic"
                      src={participant?.avatar || "/accountofficer.svg"}
                      // height={40}
                      // width={40}
                      className="w-[40px] h-[40px]"
                    /> */}
                    <span className="font-migra text-[#060809] font-extrabold w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#FAEAD4] ">
                      {participant?.firstName?.slice(0, 1).toUpperCase()}
                    </span>
                    {participant?.firstName}
                    {` `}
                    {participant?.lastName}
                    {conversationn.id === conversation?.id && (
                      <span className="absolute w-1 h-10 left-[-1px] bg-[#071A7E] rounded-r-[20px]"></span>
                    )}
                  </div>
                );
              })
          : null}
        {/* <div
          onClick={() => {
            setUserType("ai");
          }}
          className={`relative cursor-pointer flex gap-x-3 p-4 text-[#3B3C41] items-center shadow-[0_0_0_1px_#E7E7E7] ${
            userType === "ai" ? "bg-white text-[#071A7E]" : ""
          }`}
        >
          <Image
            alt="logo dashboard"
            src="/logomain.svg"
            height={40}
            width={40}
          />{" "}
          AI
          {userType === "ai" && (
            <span className="absolute w-1 h-10 left-[-1px] bg-[#071A7E] rounded-r-[20px]"></span>
          )}
        </div> */}
      </div>
      {conversation === null ? (
        <div className="shadow-[0_0_0_1px_#E7E7E7] h-screen flex flex-col items-center justify-center px-2 gap-y-6">
          <Image alt="report" src="/emptychart.svg" height={172} width={104} />
          <div className="text-center">
            <p className="text-[14px] leading-[20px] max-w-[257px] text-[#060809]">
              Select user to start conversation
            </p>
          </div>
        </div>
      ) : (
        <div className="shadow-[0_0_0_1px_#E7E7E7]">
          <div className="shadow-[0_0_0_1px_#E7E7E7] p-4 bg-white h-[74px] flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
              <span>
                <span>
                  <span>
                    {selectedParticipant?.firstName}
                    {` `}
                    {selectedParticipant?.lastName}
                  </span>
                </span>
              </span>
            </div>
            <DotsThree size={32} />
          </div>
          <div className="grid grid-cols-[1fr,auto]">
            <div>
              <div className="shadow-[0_0_0_1px_#E7E7E7] h-[678px] px-6 py-10 bg-white overflow-auto">
                <>
                  {messages?.map((message: any, i: number) => {
                    // console.log(message);
                    return (
                      <div
                        key={i}
                        className={twMerge(
                          user?.id === message?.sender?.id
                            ? "grid grid-cols-[1fr,40px] gap-x-2 mb-4"
                            : `grid grid-cols-[40px,1fr] gap-x-2 mb-4`
                        )}
                      >
                        {user?.id === message?.sender?.id ? (
                          <span className="font-migra text-[#060809] font-extrabold w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#FAEAD4] ">
                            {message?.sender?.firstName
                              ?.slice(0, 1)
                              .toUpperCase()}
                          </span>
                        ) : (
                          <span className="font-migra text-[#060809] font-extrabold w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#FAEAD4] ">
                            {message?.sender?.firstName
                              ?.slice(0, 1)
                              .toUpperCase()}
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
                        <div
                          className={twMerge(
                            user?.id === message?.sender?.id && "order-first"
                          )}
                        >
                          <div className="flex flex-col rounded-[8px]">
                            <div
                              className={twMerge(
                                user?.id === message?.sender?.id && "text-right"
                              )}
                            >
                              {user?.id === message?.sender?.id ? (
                                <span>{`You`}</span>
                              ) : (
                                <div>
                                  <span className="text-[#060809]">
                                    {`${message?.sender?.firstName} ${message?.sender?.lastName}`}
                                  </span>{" "}
                                  {/* <span className="text-[#555555B2] text-[12px] leading-[20px]">
                                    - Account Officer
                                  </span> */}
                                </div>
                              )}
                            </div>
                            <span
                              className={twMerge(
                                user?.id === message?.sender?.id
                                  ? "text-right text-[#555555CC] text-[12px] leading-[17px]"
                                  : `text-[#555555CC] text-[12px] leading-[17px]`
                              )}
                            >
                              {moment(message?.createdAt).fromNow() ||
                                `5 minutes ago`}
                            </span>
                          </div>
                          <div className="flex flex-col rounded-[8px]">
                            <span className="p-4 bg-[#FAFBFC] text-[#060809] rounded-[32px]">
                              {message?.text}
                            </span>
                            <span>
                              <Image
                                alt="manager pic"
                                src="/accountofficer.svg"
                                height={40}
                                width={40}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesRef}></div>
                </>
              </div>
              {/* textbox */}
              <div className="h-[80px] shadow-[0_0_0_1px_#E7E7E7] bg-white pl-4 flex gap-x-2">
                <input
                  id="upload"
                  className="hidden"
                  type="file"
                  // accept=".xlsx"
                  onChange={handleInputChange}
                />
                <span className="self-center">{file?.ext}</span>
                <label className="self-center cursor-pointer">
                  <Paperclip size={23} />
                </label>
                <div className="h-[80px] bg-white p-3 w-full">
                  <div className="cursor-pointer rounded-[100px] p-4 relative border-[1px] border-[#ABAEB4]">
                    <span
                      onClick={sendMessageHandler}
                      className="absolute right-2 top-2 w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#071A7E] "
                    >
                      <PaperPlaneRight size={23} color="white" />
                    </span>

                    <textarea
                      className="bg-transparent outline-none placeholder:text-[#9597A0] w-full h-[20px] overflow-y-auto"
                      placeholder={`Message ${selectedParticipant?.firstName}`}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {userType === "manager" ? (
              <div className="shadow-[0_0_0_1px_#E7E7E7] w-[272px] p-4 overflow-y-auto flex flex-col gap-y-2">
                {filesreports?.length !== 0 ? (
                  filesreports?.map((item: any, i: number) => (
                    <FileReport item={item} key={i} />
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
                        You can view all reports your account manager sends you
                        here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Page;

{
  /* <div className="grid grid-cols-[40px,1fr] gap-x-2">
                    <span>
                      <Image
                        alt="manager pic"
                        src="/accountofficer.svg"
                        height={40}
                        width={40}
                      />
                    </span>
                    <div>
                      <div className="flex flex-col rounded-[8px]">
                        <div className="flex gap-x-2 items-center">
                          <span>
                            {
                              userType === "manager" ? (
                                <span>
                                  <span className="text-[#060809]">
                                    Bimbo Ademoye
                                  </span>{" "}
                                  <span className="text-[#555555B2] text-[12px] leading-[20px]">
                                    - Account Officer
                                  </span>
                                </span>
                              ) : null
                              // <span>AI Expert</span>
                            }
                          </span>
                        </div>
                        <span className="text-[#555555CC] text-[12px] leading-[17px]">
                          5 minutes ago
                        </span>
                      </div>
                      <div className="flex flex-col rounded-[8px]">
                        <span className="p-4 bg-[#FAFBFC] text-[#060809] rounded-[32px]">
                          Here’s what happens next: You'll receive a call from
                          us to activate your free trial. On this call, we'll
                          chat about your business to make sure Accountable is
                          the right fit. Once we complete your free month of
                          bookkeeping, the Accounting section of your
                          Accountable account will populate with your
                          personalized data.
                        </span>
                      </div>
                    </div>
                  </div> */
}

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Button from "@/components/buttons/Button";
// import { twMerge } from "tailwind-merge";

// import {
//   CaretDown,
//   PokerChip,
//   Book,
//   Percent,
//   Calculator,
//   BookOpen,
//   Money,
//   ChartLineUp,
//   Notepad,
//   Info,
//   Bank,
//   Scales,
//   Rocket,
//   ArrowRight,
//   Coins,
// } from "@phosphor-icons/react";
// import { GET_USER, FINANCIAL_SUMMARY } from "@/graphql/queries";
// import { useQuery } from "@apollo/client";
// import { BeatLoader } from "react-spinners";

// const Page = () => {
//   const [active, setActive] = useState(1);
//   const [callScheduled, setCallScheduled] = useState(false);
//   const [linkBanks, setLinkBanks] = useState(false);
//   const [uploadStatement, setUploadStatement] = useState(false);
//   const [invite, setInvite] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [accountLinked, setAccountLinked] = useState<any>(false);
//   const [trialBalanced, setTrialBalanced] = useState<any>(false);
//   const [chooseService, setChooseService] = useState<any>(false);
//   const timerId = useRef<any>(null);

//   const { loading, data, error } = useQuery(GET_USER);

//   useEffect(() => {
//     const storedUser = localStorage?.getItem("userData");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   useEffect(() => {
//     // console.log(data);
//     if (data?.user?.code) {
//       console.log(data?.user?.code);
//     } else if (data?.user?.data) {
//       setAccountLinked(data?.user?.data?.linkedAccount);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (accountLinked) {
//       // setTrialBalanced(true);

//       timerId.current = setTimeout(() => {
//         setTrialBalanced(true);
//       }, 5000);
//     }

//     return () => {
//       clearTimeout(timerId.current);
//     };
//   }, [accountLinked, timerId]);

//   if (loading)
//     return (
//       <div className="h-full flex items-center justify-center">
//         <BeatLoader />
//       </div>
//     );

//   return (
//     <div>
//       <div className="flex justify-between">
//         <div>
//           <h3 className="font-extrabold text-[28px] leading-[42px] text-[#060809]">
//             Good morning, {user?.firstName || "Chris!"} 👋
//           </h3>
//           <p className="text-[#414141] text-[18px] leading-[28px]">
//             Welcome back, Let’s get some work done!
//           </p>
//         </div>
//         <div className="bg-white flex items-center gap-x-2 px-5 py-4 rounded-[16px]">
//           <span className="w-[40px] h-[40px] flex items-center justify-center bg-[#FAEAD4] rounded-full">
//             C
//           </span>
//           <div className="flex flex-col">
//             <span>Fredrick Adams</span>
//             <span>Your supervisor</span>
//           </div>
//           <span className="w-[32px] h-[32px] flex items-center justify-center rounded-full border-[1px] border-[#EAEDEF]">
//             <CaretDown size={16} />
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
