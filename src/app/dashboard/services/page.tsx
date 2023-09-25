"use client";
import React, { useState, useEffect, useRef } from "react";
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
  PencilSimple,
  Trash,
  ChartLineUp,
} from "@phosphor-icons/react";
import { GET_USER, SERVICES } from "@/graphql/queries";
import { CREATE_SERVICE } from "@/graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { Portal } from "@/components/Portal";
import Select from "@/components/inputs/Select";
import SelectCurrency from "@/components/inputs/SelectCurrency";
import TextArea from "@/components/inputs/TextArea";
import TextInput from "@/components/inputs/TextInput";
import RadioInput from "@/components/inputs/RadioInput";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";

const schema = yup.object({
  name: yup.string().required("Value is mendatory"),
  price: yup.number(),
  currency: yup.string(),
  description: yup.string(),
  subscription: yup.string(),
  frequency: yup.string(),
});

const Service = ({ item }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <tr className="border-b-[#E6E6E6] border-[1px] bg-white">
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.name || "Monthly Bookkeeping"}
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.subscribers || `0`}
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {currenciesDetails[item?.currency].symbol}
        {item?.price.toLocaleString("en-US") || `$1,435,000`}
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.frequency || `One time`}
      </td>
      <td className="text-[#3B3C41] px-6 py-4 text-left">
        {item?.subscription === true ? `Pre-paid` : `Post-paid`}
      </td>
      {/* <td className="text-[#3B3C41] px-6 py-4 text-left">
        <div
          className={twMerge(
            `flex gap-x-2 items-center bg-[#ECFDF3] text-[#039855] rounded-[20px] py-1 px-3`,
            item?.status === "PENDING" && "bg-[#F9F9F9] text-[#414141]"
          )}
        >
          <span
            className={twMerge(
              `w-[8px] h-[8px] bg-[#039855] rounded-full flex justify-center items-center`,
              item?.status === "PENDING" && "bg-[#414141]"
            )}
          ></span>
          <div>
          
            Pending
          </div>
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
            <div className="absolute p-3 z-50 bg-white border-[1px] border-[#E6E6E6] right-0 top-full w-[241px] h-auto rounded-[8px] overflow-hidden flex flex-col gap-y-3">
              <div
                onClick={() => {
                  // router.push(`/dashboard/services/${item?.id}`);
                }}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <Eye /> View
              </div>
              <div
                onClick={() => {}}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <PencilSimple /> Edit details
              </div>
              <div
                onClick={() => {}}
                className="cursor-pointer flex gap-x-3 items-center"
              >
                <Trash /> Remove
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
  const [services, setServices] = useState([]);
  const [createService, setCreateService] = useState(false);
  const [createServiceSuccess, setCreateServiceSuccess] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const resp = useQuery(SERVICES, {
    variables: {
      input: { limit: 10, page, paginate: true },
    },
  });

  const [addService, res] = useMutation(CREATE_SERVICE);

  useEffect(() => {
    // console.log(res.data?.getReportSummary);

    if (res.data?.createService?.code) {
      //
      toast.error(res.data?.createService?.message);
    } else if (res.data?.createService?.data) {
      console.log(res.data?.createService?.data);

      setCreateService(false);
      setCreateServiceSuccess(true);
    }
  }, [res.data]);

  useEffect(() => {
    if (resp.data?.getServices?.code) {
      toast.error(resp.data?.getServices?.message);
    } else if (resp.data?.getServices?.data) {
      console.log(resp.data?.getServices?.data);
      setServices(resp.data?.getServices?.data);
      console.log(resp.data?.getServices?.pagination);
      setPages(resp.data?.getServices?.pagination?.pages);
    }
  }, [resp.data]);

  const onSubmit = (data: any) => {
    addService({
      variables: {
        input: {
          ...data,
          subscription: data?.subscription == "yes" ? true : false,
          price: parseInt(data?.price),
        },
      },
    });
  };

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
          Services
        </h1>
        <Button
          onClick={() => setCreateService(true)}
          className="w-[207px] bg-white text-[#071A7E] border-[2px] border-[#071A7E]"
        >
          Add new service
        </Button>
      </div>
      <div className="mt-6">
        <div className="min-h-[384px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl mt-6">
          <div className="h-[62px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
            <span className="text-[18px] leading-[26px]">All Services</span>
            <div className="flex gap-x-2 items-center">
              <div className="bg-black/5 w-[289px] h-[36px] rounded-md flex items-center gap-x-1 px-2">
                <MagnifyingGlass color="#06080933" />
                <input
                  // value={search}
                  // onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none placeholder:text-[#06080933]"
                  placeholder="Search services"
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
                      <span className="text-[#414141]">SERVICE</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">NO OF USERS</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">AMOUNT</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">FREQUENCY</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">PAYMENT TYPE</span>
                      <ArrowUp size={16} />
                    </span>
                  </th>
                  {/* <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">STATUS</span>
                      <ArrowUp size={16} />
                    </span>
                  </th> */}
                  <th className="px-6 py-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {/* {new Array(9).fill(0).map((item, i) => (
                  <Service key={i} />
                ))} */}
                {services?.length
                  ? services?.map((item: any, i: number) => (
                      <Service item={item} key={i} />
                    ))
                  : null}
              </tbody>
            </table>
            <div className="p-6 flex justify-between items-center">
              <div className="text-[#414141] text-[14px] leading-[20px]">
                Showing {services?.length} out of{" "}
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
      {createService && (
        <Portal
          onClose={() => {
            setCreateService(false);
          }}
        >
          <div className="w-[546px] bg-white rounded-[16px] flex flex-col">
            <div className="h-[60px] px-6 py-4 border-b-[1px] border-[#0000001F] font-semibold	text-[20px] leading-[28px]">
              Create a service
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 py-4 h-[436px] overflow-y-auto">
                <div className="flex flex-col gap-y-4 w-full">
                  <div className="flex flex-col gap-y-4 w-full">
                    <TextInput
                      label="Name of service"
                      name="name"
                      placeholder="Enter name"
                      register={register}
                      errorMessage={errors?.name?.message}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <TextInput
                        type="number"
                        label="Amount"
                        name="price"
                        placeholder="Enter amount"
                        register={register}
                        errorMessage={errors?.price?.message}
                      />
                      <SelectCurrency
                        name="currency"
                        label="Select currency"
                        register={register}
                        setValue={setValue}
                        errorMessage={errors?.currency?.message}
                      />
                    </div>
                  </div>
                  <div>
                    <TextArea
                      label="Description"
                      name="description"
                      placeholder="Please write about your expected outcome for the services selected * work on copy"
                      register={register}
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-2 gap-y-2">
                  <div>
                    <h3>Allow Subscription</h3>
                    <div className="flex gap-x-3">
                      <RadioInput
                        name="subscription"
                        id="suscription"
                        label="Yes"
                        value="yes"
                        register={register}
                      />
                      <RadioInput
                        name="subscription"
                        id="suscription"
                        label="No"
                        value="no"
                        register={register}
                      />
                    </div>
                  </div>
                  <div>
                    <h3>Payment Type</h3>
                    <div className="flex gap-x-3">
                      {/* <RadioInput
                        name="frequency"
                        id="onetime"
                        label="One time"
                        value="ONETIME"
                        register={register}
                      /> */}
                      <RadioInput
                        name="frequency"
                        id="monthly"
                        label="Monthly"
                        value="MONTHLY"
                        register={register}
                      />
                      <RadioInput
                        name="frequency"
                        id="yearly"
                        label="Yearly"
                        value="YEARLY"
                        register={register}
                      />
                    </div>
                  </div>
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
                  type="submit"
                  isLoading={isSubmitting || res.loading}
                  disabled={!isValid || res.loading}
                  className="w-[176px]"
                >
                  Add service
                </Button>
              </div>
            </form>
          </div>
        </Portal>
      )}
      {createServiceSuccess && (
        <Portal
          onClose={() => {
            setCreateServiceSuccess(false);
          }}
        >
          <div className="bg-white h-[388px] w-[517px] rounded-[16px]">
            <div className="flex flex-col pt-[65px] gap-y-4 items-center h-full">
              <Image src="/verify-icon.svg" alt="Logo" width={72} height={72} />
              <div className="mt-[32px] text-[#060809] font-medium text-[20px] leading-[28px]">
                Service created
              </div>
              <div className="max-w-[278px] mb-4 text-center text-[#04050F] font-normal text-[16px] leading-[24px]">
                You have successfully created a service
              </div>
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  className="w-[175px]"
                  onClick={() => {
                    setCreateServiceSuccess(false);
                  }}
                >
                  Go to dashboard
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
