"use client";
import { ReactNode, FC, useEffect, useState } from "react";
import {
  HouseSimple,
  CalendarBlank,
  Cardholder,
  ChatDots,
  ChartPieSlice,
  Faders,
  Gift,
  Question,
  SignOut,
  Sun,
  Gear,
  Bell,
  SidebarSimple,
  MagnifyingGlass,
  Star,
  Folder,
  Users,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter } from "next/navigation";
import { GET_USER, FINANCIAL_SUMMARY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import { checkTokenExpiration } from "@/utils";

interface MenuLinkProps {
  children: ReactNode;
  active?: boolean;
  href: string;
}

const MenuLink: FC<MenuLinkProps> = ({ children, active, href }) => {
  return (
    <Link
      href={href}
      className={`relative flex gap-x-1 px-[14.5px] py-2.5 items-center h-[28px] text-[14px] leading-[20px] font-normal rounded-md ${
        active ? "bg-[#071A7E0D] text-[#071A7E]" : ""
      }`}
    >
      {children}
      {active && (
        <span className="absolute w-1 h-4 left-0 bg-[#071A7E] rounded-[3px]"></span>
      )}
    </Link>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // const { data, status } = useSession();

  // console.log(data);

  // console.log(
  //   apiCalendar.tokenClient.requestAccessToken({ prompt: "consent" })
  // );

  // const { loading, data, error } = useQuery(GET_USER);

  // console.log(error);

  // useEffect(() => {
  //   console.log(data);
  //   if (data?.user?.code) {
  //     console.log(data?.user?.code);
  //     router.push("/login");
  //   } else if (data?.user?.data) {
  //     console.log(data?.user?.data);
  //     setUser(data?.user?.data);
  //   }
  // }, [data]);

  useEffect(() => {
    const jwtToken = localStorage?.getItem("userToken");
    const isTokenExpired = checkTokenExpiration(jwtToken);
    setLoading(false);

    if (isTokenExpired) {
      // console.log("Token has expired.");
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      router.push("/login");
    } else {
      // console.log("Token is valid and has not expired.");
      const storedUser = localStorage?.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <BeatLoader />
      </div>
    );

  if (user) {
    return (
      <div className="h-screen grid grid-cols-[212px,1fr]">
        <div className="w-[212px] p-4 h-screen bg-white border-r-[1px] border-[#E6E6E6] overflow-scroll">
          <div className="flex justify-between items-center">
            <Image
              alt="logo dashboard"
              src="/logomain.svg"
              height={55}
              width={55}
            />
            <SidebarSimple size={20} />
          </div>
          <div className="mt-10 flex flex-col gap-y-4">
            <MenuLink
              href="/dashboard"
              active={pathName === "/dashboard" && true}
            >
              <HouseSimple size={20} /> Dashboard
            </MenuLink>
            <MenuLink
              href="/dashboard/clients"
              active={pathName === "/dashboard/clients" && true}
            >
              <Users size={20} /> Clients
            </MenuLink>
            {/* <MenuLink
              href="/dashboard/files"
              active={pathName === "/dashboard/files" && true}
            >
              <Folder size={20} /> Files
            </MenuLink> */}
            <MenuLink
              href="/dashboard/messages"
              active={pathName === "/dashboard/messages" && true}
            >
              <ChatDots size={20} /> Messages
            </MenuLink>
            <MenuLink
              href="/dashboard/meeting"
              active={pathName === "/dashboard/meeting" && true}
            >
              <CalendarBlank size={20} /> Meetings
            </MenuLink>
            <MenuLink
              href="/dashboard/services"
              active={pathName === "/dashboard/services" && true}
            >
              <Star size={20} /> Services
            </MenuLink>
          </div>

          <div className="mt-10 flex flex-col gap-y-4 mt-[132px]">
            {user?.role === "admin" ? (
              <MenuLink
                href="/dashboard/teams"
                active={pathName === "/dashboard/teams" && true}
              >
                <Users size={20} /> Team Management
              </MenuLink>
            ) : null}
            {/* <MenuLink
              href="/dashboard/help"
              active={pathName === "/dashboard/help" && true}
            >
              <Question size={20} /> Help & Support
            </MenuLink> */}
            <span
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userData");
                router.push("/login");
              }}
              className="cursor-pointer relative flex gap-x-1 px-[14.5px] py-2.5 items-center h-[28px] rounded-md"
            >
              <SignOut size={20} /> Log out
            </span>
          </div>
          <div className="flex items-end mt-[200px] gap-x-3">
            <span className="font-migra text-[32px] leading-[.32px] w-[40px] h-[40px] flex items-center justify-center bg-[#FAEAD4] ">
              {user?.firstName?.substring(0, 1) || `C`}
            </span>
            <div className="flex flex-col">
              <span className="font-medium text-[14px] leading-[21px]">
                {user?.firstName || `Chris`}
              </span>
              <span className="text-[10px] leading-[14px] font-light text-[#555555]">
                {user?.companyName || ` Accountable TechServe`}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-screen bg-[#FAFBFC] overflow-auto">
          <div className="bg-white w-full h-[72px] flex items-center justify-between px-12">
            <span className="text-black/40 capitalize">
              {pathName?.substring(1).split("/")[1] || pathName?.substring(1)}
            </span>
            <div className="bg-black/5 w-[289px] h-[26px] rounded-md flex items-center gap-x-1 px-2">
              <MagnifyingGlass color="#06080933" />
              <input
                className="bg-transparent outline-none placeholder:text-[#06080933]"
                placeholder="Search"
              />
            </div>
            <div className="flex gap-x-3 items-center">
              <Link
                href="/dashboard/meeting"
                className="border-[1px] border-[#EAEDEF] flex gap-x-1 h-[36px] justify-center px-2 rounded-[4px] mr-3 items-center text-[#071A7E]"
              >
                <CalendarBlank /> Meetings
              </Link>
              <div className="border-l-[1px] border-l-[#060809] flex gap-x-3 h-[28px] w-[100px] justify-center items-center">
                <Sun />
                <Gear />
                <Bell />
              </div>
            </div>
          </div>
          <div
            className={twMerge(
              `px-12 py-7`,
              pathName?.substring(1).split("/")[1] === "messages" && "px-0 py-0"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}
