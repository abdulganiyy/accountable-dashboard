"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { GET_USER, GET_AUTH_URL } from "@/graphql/queries";
import { ADD_APPOINTMENT_LINK } from "@/graphql/mutations";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import Meetings from "@/components/Meetings";
import { ToastContainer, toast } from "react-toastify";
import { Portal } from "@/components/Portal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "@/components/inputs/TextInput";
import TextArea from "@/components/inputs/TextArea";

// .matches(
//   /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
//   "Enter correct url!"
// )

const schema = yup.object({
  link: yup.string().required("Please enter website"),
});

const Page = () => {
  const [user, setUser] = useState<any>(null);
  const [addLink, setAddLink] = useState(false);

  const resp = useQuery(GET_USER);

  useEffect(() => {
    console.log(resp?.data);
    if (resp?.data?.user?.code) {
      console.log(resp?.data?.user?.code);
    } else if (resp?.data?.user?.data) {
      console.log(resp?.data?.user?.data);
      setUser(resp?.data?.user?.data);
    }
  }, [resp?.data]);

  const {
    watch,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const [addAppointmentLink, res] = useMutation(ADD_APPOINTMENT_LINK);

  useEffect(() => {
    console.log(res.data);

    if (res.data?.addAppointmentLink?.code) {
      toast.error(res.data?.addAppointmentLink?.code);
    } else if (res.data?.addAppointmentLink?.data) {
      toast.success(res.data?.addAppointmentLink?.message);
      setAddLink(false);
    }
  }, [res.data]);

  const [getAuthUrl, { loading, data, error }] = useLazyQuery(GET_AUTH_URL);

  useEffect(() => {
    // console.log(data);
    if (data?.getAuthUrl?.code) {
      console.log(data?.getAuthUrl?.code);
    } else if (data?.getAuthUrl?.data) {
      // redirect to link
      console.log(data?.getAuthUrl?.data);
      window.location.assign(data?.getAuthUrl?.data);
    }
  }, [data]);

  // useEffect(() => {
  //   const storedUser = localStorage?.getItem("userData");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  const onSubmit = async (data: any) => {
    console.log(data);
    addAppointmentLink({
      variables: {
        input: {
          link: data?.link,
        },
      },
    });
  };

  if (resp.loading)
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
            Meetings
          </h3>
          <p className="text-[#414141] text-[18px] leading-[28px]">
            Effortlessly schedule, organize, and manage your meetings with ease
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            onClick={() => {
              setAddLink(true);
            }}
            className="w-[207px] text-white bg-[#071A7E] border-[2px] border-[#071A7E]"
          >
            Add Appointment Link
          </Button>
          {Boolean(!user?.google) && (
            <Button
              onClick={() => {
                getAuthUrl();
                // window.location.assign("https://duckduckgo.com/");
              }}
              className="w-[177px]  bg-white text-[#071A7E] border-[2px] border-[#071A7E]"
            >
              Manage Availability
            </Button>
          )}
        </div>
      </div>
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

      {/* <Meetings /> */}
      {addLink && (
        <Portal
          onClose={() => {
            setAddLink(false);
          }}
        >
          <div className="w-[546px] bg-white rounded-[16px]">
            <div className="px-6 py-4 border-b-[1px] border-[#0000001F] font-semibold	text-[20px] leading-[28px]">
              Add Appointment Link
              {/* <p className="text-[14px] leading-[20px] text-[#4C5259]">
                This is an instant meeting with your account manager
              </p> */}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 py-4">
                <div>
                  {" "}
                  <TextInput
                    label="Appointment Link"
                    name="link"
                    placeholder=""
                    register={register}
                    errorMessage={errors?.link?.message}
                  />
                </div>

                <div className="flex justify-end gap-x-2 mt-5">
                  <Button
                    onClick={() => {
                      setAddLink(false);
                    }}
                    type="button"
                    className="w-[95px] bg-white text-[#071A7E] border-[2px] border-[#EAEDEF]"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-[196px]"
                    isLoading={isSubmitting || res.loading}
                    disabled={!isValid || isSubmitting || res.loading}
                    type="submit"
                  >
                    Add Link
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Portal>
      )}
      <ToastContainer />
    </div>
  );
};

export default Page;
