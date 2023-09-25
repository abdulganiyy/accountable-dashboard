"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { twMerge } from "tailwind-merge";
import moment from "moment";

import {
  ArrowUp,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Faders,
  CaretDown,
  DotsThreeVertical,
  Trash,
  Copy,
  CirclesThree,
  PlusCircle,
} from "@phosphor-icons/react";
import { MANAGERS } from "@/graphql/queries";
import { INVITE } from "@/graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { Portal } from "@/components/Portal";
import EmailInput from "@/components/inputs/EmailInput";
import SelectRole from "@/components/inputs/SelectRole";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import TextInput from "@/components/inputs/TextInput";

//   invitations: yup.array().of(
//     yup.object().shape({
//       email: yup.string().required("Value is mendatory"),
//       role: yup.string().required("Value is mendatory"),
//     })
//   ),

const schema = yup.object({
  email: yup.string().required("Value is mendatory"),
  role: yup.string().required("Value is mendatory"),
  firstName: yup.string().required("Value is mendatory"),
  lastName: yup.string().required("Value is mendatory"),
});

const Member = ({ item }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <tr className="border-b-[#E6E6E6] border-[1px] bg-white">
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        <div className="flex gap-x-2 items-center">
          <span className="text-[14px] leading-[17px] w-[40px] h-[40px] flex items-center justify-center bg-[#FAEAD4] rounded-full">
            {`${item?.firstName?.slice(0, 1)}${item?.lastName?.slice(0, 1)}` ||
              "Jacob Jones"}
          </span>{" "}
          {`${item?.firstName} ${item?.lastName}` || "Jacob Jones"}
        </div>
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.email || `jacobjones@example.com`}
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.role === "admin" ? "Supervisor" : "Account manager"}
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {moment(
          new Date(item?.lastAcive || `2023-10-26T11:30:21.594Z`)
        ).fromNow()}
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
                  navigator.clipboard.writeText(item?.email);
                  toast.success("Email copied");
                }}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <Copy /> Copy email
              </div>
              <div
                onClick={() => {}}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <CirclesThree /> Update role
              </div>
              <div
                onClick={() => {}}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <Trash /> Remove member
              </div>
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
  const [teams, setTeams] = useState([]);
  const [inviteTeamMembers, setInviteTeamMembers] = useState(false);
  const [inviteTeamMembersSuccess, setInviteTeamMembersSuccess] =
    useState(false);
  const [search, setSearch] = useState("");

  const {
    watch,
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    // defaultValues: {
    //   invitations: [{ email: "", role: "" }],
    // },
    resolver: yupResolver(schema),
  });

  //   const { fields, append, remove } = useFieldArray({
  //     control,
  //     name: "invitations",
  //   });

  const [invite, res] = useMutation(INVITE);

  useEffect(() => {
    // console.log(res.data?.getReportSummary);

    if (res.data?.invite?.code) {
      //
      toast.error(res.data?.invite?.message);
    } else if (res.data?.invite?.data) {
      console.log(res.data?.invite?.data);

      setInviteTeamMembersSuccess(true);
      setInviteTeamMembers(false);
    }
  }, [res.data]);

  const onSubmit = async (data: any) => {
    console.log(data);
    invite({
      variables: {
        input: {
          ...data,
        },
      },
    });
  };

  const resp = useQuery(MANAGERS, {
    variables: {
      input: search
        ? { limit: 10, page, search, paginate: true }
        : { limit: 10, page, paginate: true },
    },
  });

  // const router = useRouter();

  useEffect(() => {
    if (resp.data?.managers?.code) {
      toast.error(resp.data?.managers?.message);
    } else if (resp.data?.managers?.data) {
      console.log(resp.data?.managers?.data);
      setTeams(resp.data?.managers?.data);
      console.log(resp.data?.managers?.pagination);
      setPages(resp.data?.managers?.pagination?.pages);
    }
  }, [resp.data]);

  //   const { loading, data, error } = useQuery(GET_USER);

  // if (loading)
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <BeatLoader />
  //     </div>
  //   );

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-semibold text-[28px] leading-[34px] text-[#060809]">
          Team Management
        </h1>
        <Button
          onClick={() => setInviteTeamMembers(true)}
          className="w-[207px] bg-white text-[#071A7E] border-[2px] border-[#071A7E]"
        >
          Invite new member
        </Button>
      </div>
      <div className="mt-6">
        <div className="min-h-[384px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl mt-6">
          <div className="h-[62px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
            <span className="text-[18px] leading-[26px]">All members</span>
            <div className="flex gap-x-2 items-center">
              <div className="bg-black/5 w-[289px] h-[36px] rounded-md flex items-center gap-x-1 px-2">
                <MagnifyingGlass color="#06080933" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                      <span className="text-[#414141]">ROLE</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">LAST ACTIVE</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {/* {new Array(9).fill(0).map((item, i) => (
                  <Member item={item} key={i} />
                ))} */}
                {teams?.length !== 0 &&
                  teams?.map((item: any, i: number) => (
                    <Member item={item} key={i} />
                  ))}
              </tbody>
            </table>
            <div className="p-6 flex justify-between items-center">
              <div className="text-[#414141] text-[14px] leading-[20px]">
                Showing {`${(page - 1) * 10 + teams?.length}`} out of{" "}
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
      {inviteTeamMembers && (
        <Portal
          onClose={() => {
            setInviteTeamMembers(false);
          }}
        >
          <div className="w-[546px] bg-white rounded-[16px] flex flex-col">
            <div className="min-h-[60px] px-6 py-4 border-b-[1px] border-[#0000001F] font-semibold	text-[20px] leading-[28px]">
              Add Team member
              <p className="text-[14px] leading-[20px] text-[#4C5259] font-normal">
                Enter the email address of your team and choose the role they
                should have within your organization
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 py-4 h-[436px] overflow-y-auto">
                <div className="flex flex-col gap-y-4">
                  <EmailInput
                    label="Email Address"
                    placeholder="name@example.com "
                    name="email"
                    register={register}
                    errorMessage={errors?.email?.message}
                  />
                  <SelectRole
                    label="Role"
                    name="role"
                    placeholder="Select role"
                    register={register}
                    setValue={setValue}
                  />
                  <TextInput
                    label="First Name"
                    name="firstName"
                    placeholder="Ade"
                    register={register}
                    errorMessage={errors?.firstName?.message}
                  />
                  <TextInput
                    label="Last Name"
                    name="lastName"
                    placeholder="Tunde"
                    register={register}
                    errorMessage={errors?.lastName?.message}
                  />

                  {/* {fields.map((field, index) => (
                    <div className="flex gap-x-2" key={field.id}>
                      <div className="w-[285px]">
                        <EmailInput
                          label="Email Address"
                          placeholder="name@example.com "
                          name={`invitations.${index}.email` as const}
                          register={register}
                        />
                      </div>
                      <div className="flex-auto">
                        <SelectRole
                          label="Role"
                          name={`invitations.${index}.role` as const}
                          register={register}
                          setValue={setValue}
                        />
                      </div>
                      {index > 0 && (
                      <button type="button" onClick={() => remove(index)}>
                        Remove
                      </button>
                    )}
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      append({ email: "", role: "" });
                    }}
                    className="flex gap-x-2 cursor-pointer"
                  >
                    <span className="bg-[#F2F3F7] w-[24px] h-[24px] rounded-[8px] text-black p-1 cursor-pointer">
                      <PlusCircle size={16} />
                    </span>
                    <span>Add another user</span>
                  </div> */}
                </div>
              </div>
              <div className="w-full rounded-b-[16px] bg-[#F2F3F7] flex justify-end gap-x-2 mt-5 px-6 py-4 pb-8">
                <Button
                  type="button"
                  className="w-[207px] bg-white text-[#071A7E] border-[2px] border-[#EAEDEF]"
                  onClick={() => {}}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!isValid || isSubmitting || res.loading}
                  isLoading={isSubmitting || res.loading}
                  type="submit"
                  className="w-[176px]"
                >
                  Invite
                </Button>
              </div>
            </form>
          </div>
        </Portal>
      )}
      {inviteTeamMembersSuccess && (
        <Portal
          onClose={() => {
            setInviteTeamMembersSuccess(false);
          }}
        >
          <div className="bg-white h-[388px] w-[517px] rounded-[16px]">
            <div className="flex flex-col pt-[80px] items-center h-full">
              <Image src="/verify-icon.svg" alt="Logo" width={72} height={72} />
              <div className="mt-[32px] text-[#060809] font-medium text-[20px] leading-[28px]">
                Team Invites sent
              </div>
              <div className="max-w-[278px] mb-4 text-center text-[#555555] font-normal text-[16px] leading-[24px]">
                You have successfully invited your team members
              </div>
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  className="w-[175px]"
                  onClick={() => {
                    setInviteTeamMembersSuccess(false);
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  type="button"
                  className="w-[177px]  bg-white text-[#071A7E] border-[2px] border-[#EAEDEF]"
                  onClick={() => {
                    setInviteTeamMembersSuccess(false);
                    setInviteTeamMembers(true);
                  }}
                >
                  Invite new members
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
      <ToastContainer />
    </div>
  );
};

export default Page;
