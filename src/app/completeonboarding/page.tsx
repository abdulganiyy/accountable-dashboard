"use client";
import { useState, useEffect } from "react";
import PhoneInput from "@/components/inputs/PhoneInput";
import Header from "@/components/layouts/Header";
import Button from "@/components/buttons/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { phoneRegExp } from "@/utils";
import { useMutation } from "@apollo/client";
import { ONBOARD, VERIFY_PHONE } from "@/graphql/mutations";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

const schema = yup.object({
  phone: yup
    .string()
    .required("required")
    .matches(phoneRegExp, "Phone number is not valid"),
});

export default function CompleteOnboarding() {
  const searchParams = useSearchParams();

  const {
    watch,
    handleSubmit,
    reset,
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<any>();

  // const [onboard, result] = useMutation(ONBOARD);
  // const [verifyPhone, res] = useMutation(VERIFY_PHONE);

  const router = useRouter();

  // useEffect(() => {
  //   console.log(result.data);

  //   if (result.data?.onboard?.data) {
  //     router.push(`/dashboard`);
  //   } else if (result.data?.onboard?.code) {
  //     toast.error(result.data?.onboard?.message);
  //   }
  // }, [result.data, router]);

  // const router = useRouter();

  // useEffect(() => {
  //   if (result.data?.requestPhoneVerification?.code) {
  //     console.log(result.data?.requestPhoneVerification);
  //     toast.error(result.data?.requestPhoneVerification?.message);
  //   } else if (result.data?.requestPhoneVerification?.message) {
  //     toast("OTP Code Sent");
  //     router.push(`/otp?details=${JSON.stringify(getValues())}`);
  //   }
  // }, [result.data, router, getValues]);

  const onSubmit = async (data: any) => {
    console.log(data);
    // verifyPhone({
    //   variables: {
    //     input: {
    //       phone: `+${data.phone}`,
    //     },
    //   },
    // });
    // onboard({
    //   variables: {
    //     input: {
    //       monthlyRecurringRevenue: data.revenue,
    //       operationCountry: data.country,
    //       reportingCurrency: data.currency,
    //       companySize: data.size,
    //       industry: data.industry,
    //     },
    //   },
    // });
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto px-2 w-[365px] mt-[32px] flex flex-col gap-y-2 mb-6">
        <h1 className="text-[#060809] font-medium text-[28px] leading-[39.2px]">
          Just one more step...
        </h1>
        {/* <div className="text-[#555555] pb-[19px] font-normal">
          Tell us a bit more about your business
        </div> */}
        <div className="">
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={`flex flex-col gap-y-2`}>
                <PhoneInput
                  name="phone"
                  label="Phone number"
                  placeholder="8123456789"
                  register={register}
                  setValue={setValue}
                  trigger={trigger}
                  error={errors.phone}
                />
              </div>
              <div className="mt-4 z-100">
                <Button
                  // disabled={!isValid || isSubmitting || result.loading}
                  // isLoading={isSubmitting || result.loading}
                  type="submit"
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </div>
      <ToastContainer />
    </main>
  );
}
