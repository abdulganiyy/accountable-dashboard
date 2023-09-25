"use client";
import { useState, useEffect } from "react";
import Header from "@/components/layouts/Header";
import OtpInput from "react-otp-input";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { ONBOARD, VERIFY_PHONE } from "@/graphql/mutations";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const handleChange = (enteredOtp: any) => {
    setOtp(enteredOtp);
  };

  const searchParams = useSearchParams();

  const details = searchParams?.get("details");

  const data: any = {};

  // const data = JSON.parse(details || "");

  // console.log(data);

  const [onboard, result] = useMutation(ONBOARD);
  const [verifyPhone, res] = useMutation(VERIFY_PHONE);

  const router = useRouter();

  useEffect(() => {
    console.log(res.data);

    if (res.data?.requestPhoneVerification?.code) {
      toast.error(res.data?.requestPhoneVerification?.code);
    } else if (res.data?.requestPhoneVerification?.message) {
      toast.success(res.data?.requestPhoneVerification?.message);
    }
  }, [res.data]);

  useEffect(() => {
    console.log(result.data);

    if (result.data?.onboard?.data) {
      router.push(`/dashboard`);
    } else if (result.data?.onboard?.code) {
      toast.error(result.data?.onboard?.message);
      setOtp("");
    }
  }, [result.data, router]);

  useEffect(() => {
    if (otp.length === 4) {
      onboard({
        variables: {
          input: {
            otp,
            phone: data.phone,
          },
        },
      });
    }
  }, [onboard, otp, data]);

  const resendOtp = async () => {
    if (!data) return;
    console.log(data);
    verifyPhone({
      variables: {
        input: {
          phone: data.phone,
        },
      },
    });
  };

  return (
    <div className="bg-white h-screen overflow-hidden">
      <Header />
      <div className="flex flex-col pt-[80px] items-center h-full">
        <div className="mt-[32px] text-[#060809] font-medium text-[28px] leading-[39px]">
          Confirm Phone Number
        </div>
        <div className="max-w-[514px] text-center text-[#555555] font-normal text-[16px] leading-[24px]">
          We’ve sent a 4-digit code to your phone number{" "}
          <span className="text-[#071A7E]">
            {"+"}
            {data?.phone || "+234702*****89"}.
          </span>{" "}
          Please enter it below to verify it.
        </div>
        <div className="mt-6">
          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={4}
            renderSeparator={<span className="w-[20px]"></span>}
            placeholder="----"
            inputStyle={{
              border: "1px solid #EAEDEF",
              outline: "none",
              borderRadius: "4px",
              width: "40px",
              height: "40px",
              fontSize: "12px",
              color: "#04050F",
              fontWeight: "400",
              caretColor: "blue",
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>
        <div className="mt-4 text-[#555555] text-center font-normal text-[12px] leading-[18px]">
          <button onClick={resendOtp} className="underline">
            Send code again
          </button>{" "}
          or find more information about it in
          <Link href="/" className="underline">
            {" "}
            help center
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

// "use client";
// import { useState, useEffect } from "react";
// import Header from "@/components/layouts/Header";
// import OtpInput from "react-otp-input";
// import Link from "next/link";
// import { useMutation } from "@apollo/client";
// import { ONBOARD, VERIFY_PHONE } from "@/graphql/mutations";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast, ToastContainer } from "react-toastify";

// export default function Otp() {
//   const [otp, setOtp] = useState("");
//   const handleChange = (enteredOtp: any) => {
//     setOtp(enteredOtp);
//   };

//   const searchParams = useSearchParams();

//   const details = searchParams?.get("details");

//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     try {
//       setData(JSON?.parse(details || ""));
//       // console.log(result);
//     } catch (err) {
//       // 👇️ SyntaxError: Unexpected end of JSON input
//       console.log("error", err);
//     }
//   }, [details]);

//   // console.log(data);

//   const [onboard, result] = useMutation(ONBOARD);
//   const [verifyPhone, res] = useMutation(VERIFY_PHONE);

//   const router = useRouter();

//   useEffect(() => {
//     console.log(res.data);

//     if (res.data?.requestPhoneVerification?.code) {
//       toast.error(res.data?.requestPhoneVerification?.code);
//     } else if (res.data?.requestPhoneVerification?.message) {
//       toast.success(res.data?.requestPhoneVerification?.message);
//     }
//   }, [res.data]);

//   useEffect(() => {
//     console.log(result.data);

//     if (result.data?.onboard?.data) {
//       router.push(`/dashboard`);
//     } else if (result.data?.onboard?.code) {
//       toast.error(result.data?.onboard?.message);
//       setOtp("");
//     }
//   }, [result.data, router]);

//   useEffect(() => {
//     if (otp.length === 4) {
//       onboard({
//         variables: {
//           input: {
//             monthlyRecurringRevenue: data.revenue,
//             operationCountry: data.country,
//             otp,
//             phone: data.phone,
//             reportingCurrency: data.currency,
//             companySize: data.size,
//             industry: data.industry,
//           },
//         },
//       });
//     }
//   }, [onboard, otp, data]);

//   const resendOtp = async () => {
//     if (!data) return;
//     console.log(data);
//     verifyPhone({
//       variables: {
//         input: {
//           phone: data.phone,
//         },
//       },
//     });
//   };

//   return (
//     <div className="bg-white h-screen overflow-hidden">
//       <Header />
//       <div className="flex flex-col pt-[80px] items-center h-full">
//         <div className="mt-[32px] text-[#060809] font-medium text-[28px] leading-[39px]">
//           Verify your email
//         </div>
//         <div className="max-w-[514px] text-center text-[#555555] font-normal text-[16px] leading-[24px]">
//           We’ve sent a 4-digit code to your email <br />
//           <span className="text-[#071A7E]">
//             {data?.phone || "bimbo@accountable.global."}.
//           </span>{" "}
//           <br />
//           Please enter it below to verify it.
//         </div>
//         <div className="mt-6">
//           <OtpInput
//             value={otp}
//             onChange={handleChange}
//             numInputs={4}
//             renderSeparator={<span className="w-[20px]"></span>}
//             placeholder="----"
//             inputStyle={{
//               border: "1px solid #EAEDEF",
//               outline: "none",
//               borderRadius: "4px",
//               width: "40px",
//               height: "40px",
//               fontSize: "12px",
//               color: "#04050F",
//               fontWeight: "400",
//               caretColor: "blue",
//             }}
//             renderInput={(props) => <input {...props} />}
//           />
//         </div>
//         <div className="mt-4 text-[#555555] text-center font-normal text-[12px] leading-[18px]">
//           <button onClick={resendOtp} className="underline">
//             Send code again
//           </button>{" "}
//           or find more information about it in
//           <Link href="/" className="underline">
//             {" "}
//             help center
//           </Link>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }
