import React, { FC, useEffect, useState } from "react";
import { Trash, ArrowUp, PlusCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { truncateStr } from "@/utils";
import { Portal } from "@/components/Portal";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "./buttons/Button";
import TextInput from "./inputs/TextInput";
import { useQuery, useMutation } from "@apollo/client";
import { SERVICES } from "@/graphql/queries";
import { REQUESTSERVICE } from "@/graphql/mutations";
import { ToastContainer, toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import Select from "./inputs/Select";
import Image from "next/image";

const schema = yup.object({
  services: yup.array().of(
    yup.object().shape({
      serviceId: yup.string().required("Value is mendatory"),
      duration: yup.number().required("Value is mendatory"),
      price: yup.number().required("Value is mendatory"),
    })
  ),
});

interface RequestServiceProps {
  setRequestService: any;
  customerId: any;
  customerName?: string;
  customerEmail?: string;
}

const RequestService: FC<RequestServiceProps> = ({
  customerId,
  customerName,
  setRequestService,
  customerEmail,
}) => {
  const [active, setActive] = useState(1);
  const [services, setServices] = useState<any>([]);
  const [pickedServices, setPickedServices] = useState<any>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [items, setItems] = useState<any>([]);

  const {
    watch,
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      services: [{ serviceId: "", duration: 0, price: 0 }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const res = useQuery(SERVICES, {
    variables: {
      input: { limit: 10 },
    },
  });

  useEffect(() => {
    if (res.data?.getServices?.code) {
      //
      toast.error(res.data?.getServices?.message);
    } else if (res.data?.getServices?.data) {
      //   console.log(res.data?.getServices?.data);

      setServices(res.data?.getServices?.data);
    }
  }, [res.data]);

  useEffect(() => {
    setPickedServices(getValues("services"));
  }, [getValues("services")]);

  const [requestService, resp] = useMutation(REQUESTSERVICE);

  useEffect(() => {
    if (resp.data?.serviceRequest?.code) {
      //
      toast.error(resp.data?.serviceRequest?.message);
    } else if (resp.data?.serviceRequest?.data) {
      console.log(resp.data?.serviceRequest?.data);
      //   toast.success("Invoice created successfully");
      reset();
      setShowSummary(false);
      setShowSuccessModal(true);
    }
  }, [resp.data]);

  const onSubmit = async (data: any) => {
    console.log(data, customerId);
    setItems(
      services
        .filter((item: any) =>
          data.services
            .map((service: any) => service.serviceId)
            .includes(item?.id)
        )
        .map((item: any) => {
          return {
            ...item,
            duration: data.services.find(
              (service: any) => service.serviceId === item.id
            )?.duration,
            price: data.services.find(
              (service: any) => service.serviceId === item.id
            )?.price,
          };
        })
    );
    setShowSummary(true);
    // requestService({
    //   variables: {
    //     input: {
    //       customerId,
    //       services: data.services,
    //     },
    //   },
    // });
  };

  return (
    <div>
      <h3 className="font-extrabold text-[28px] leading-[42px] text-[#060809] p-2">
        Creating an Invoice
      </h3>
      <div className="h-[471px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl mt-4">
        <div className="h-[68px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
          <div className="flex gap-x-4 items-center">
            <span>Invoice Details</span>
            <span className="px-2 py-1 bg-[#F2F3F7] text-[#00085A] hidden">
              Step {active} out of 4
            </span>
          </div>
          <div className="w-[126px] grid grid-cols-4 hidden">
            {[1, 2, 3, 4].map((item, i) => {
              return (
                <div
                  key={i}
                  className={
                    "cursor-pointer z-0 relative before:content-[''] before:absolute before:top-[12px] before:z-10 before:translate-x-2/4 before:w-full before:h-[2px] before:bg-[#E6E6E6] before:left-0 last:before:hidden"
                  }
                  // onClick={() => setActive(item)}
                >
                  <div
                    className={twMerge(
                      "relative z-50 w-[24px] h-[24px] rounded-full bg-[#F2F3F7] text-[#00085A] flex justify-center items-center",
                      active === item && "bg-[#00085A] text-white",
                      active > item && "bg-[#00085A] text-white"
                    )}
                  >
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="h-[340px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="font-semibold bg-[#F9F9F9] text-[#414141] text-[14px] leading-[20px]">
                    <th className="px-6 py-4 text-left">
                      <span className="flex items-center gap-x-1">
                        <span className="text-[#414141]">#</span>
                        {/* <ArrowUp size={16} /> */}
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="flex items-center gap-x-1">
                        <span className="text-[#414141]">SERVICES</span>
                        <ArrowUp size={16} />
                      </span>
                    </th>
                    {/* <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-x-1">
                      <span className="text-[#414141]">DESCRIPTION</span>
                      <ArrowUp size={16} />
                    </span>
                  </th> */}
                    <th className="px-6 py-4 text-left">
                      <span className="flex items-center gap-x-1">
                        <span className="text-[#414141]">DURATION</span>
                        <ArrowUp size={16} />
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="flex items-center gap-x-1">
                        <span className="text-[#414141]">PRICE</span>
                        <ArrowUp size={16} />
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr className="bg-white" key={field.id}>
                      <td className="px-6 py-4 text-left">{index + 1}</td>
                      <td className="px-6 py-4 text-left">
                        {/* <TextInput
                        label="Service"
                        placeholder="Tax Accrual"
                        name={`services.${index}.service` as const}
                        register={register}
                      /> */}
                        <Select
                          // label="What service are you purchasing"
                          placeholder="Select a service"
                          name={`services.${index}.serviceId` as const}
                          register={register}
                          setValue={setValue}
                          options={services.map((item: any) => ({
                            value: item?.id,
                            key: item?.name,
                          }))}
                          useKey
                          //   callBack={updatePickedServices}
                        />
                      </td>
                      <td className="px-6 py-4 text-left">
                        {/* <TextInput
                        // label="Duration"
                        placeholder="Two months"
                        name={`services.${index}.duration` as const}
                        register={register}
                        type="number"
                      /> */}
                        <Select
                          // label="How many months are you subscribing for"
                          placeholder="Select duration"
                          name={`services.${index}.duration` as const}
                          register={register}
                          setValue={setValue}
                          options={[
                            { key: "1 month", value: 1 },
                            { key: "2 months", value: 2 },
                            { key: "3 months", value: 3 },
                            { key: "4 months", value: 4 },
                            { key: "5 months", value: 5 },
                            { key: "6 months", value: 6 },
                            { key: "7 months", value: 7 },
                            { key: "8 months", value: 8 },
                            { key: "9 months", value: 9 },
                            { key: "10 months", value: 10 },
                            { key: "11 months", value: 11 },
                          ]}
                        />
                      </td>
                      <td className="px-6 py-4 text-left">
                        <TextInput
                          // label="Duration"
                          placeholder="₦2000.00"
                          name={`services.${index}.price` as const}
                          register={register}
                          type="number"
                        />
                      </td>
                      {index > 0 && (
                        <td className="px-6 py-4 text-left">
                          <button type="button" onClick={() => remove(index)}>
                            <Trash />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                onClick={() => {
                  append({ serviceId: "", duration: 0, price: 0 });
                }}
                className="flex gap-x-2 cursor-pointer p-4 border-y-[#E6E6E6] border-[1px]"
              >
                <span className="bg-[#F2F3F7] w-[24px] h-[24px] rounded-[8px] text-black p-1 cursor-pointer">
                  <PlusCircle size={16} />
                </span>
                <span>Add another service</span>
              </div>
              <div className="flex p-6 justify-end gap-x-4 text-[#3B3C41] text-[14px] leading-[20.3px]">
                <span>Total</span>
                <span>
                  ₦{" "}
                  {pickedServices
                    .reduce(
                      (acc: number, item: any) => (acc += +item?.price),
                      0
                    )
                    .toLocaleString("en-US")}
                </span>
              </div>
            </div>
            <div className="flex gap-x-2 px-2">
              {active === 1 ? (
                <>
                  <Button
                    className="w-[164px]"
                    type="submit"
                    // isLoading={resp.loading || isSubmitting}
                    // disabled={resp.loading || isSubmitting}
                    //   onClick={() => {
                    //     setActive(2);
                    //   }}
                  >
                    Send Invoice
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setActive(1);
                    }}
                    className="w-[300px] px-2"
                  >
                    Previous
                  </Button>
                  <Button className="w-[220px] bg-white text-[#071A7E] border-[2px] border-[#EAEDEF]">
                    Save and continue
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
        <pre className="hidden">{JSON.stringify(watch(), null, 2)}</pre>
      </div>
      {showSuccessModal && (
        <Portal
          onClose={() => {
            setRequestService();
          }}
        >
          <div className="bg-white h-[388px] w-[517px] rounded-[16px]">
            <div className="flex flex-col pt-[80px] items-center h-full">
              <Image src="/verify-icon.svg" alt="Logo" width={72} height={72} />
              <div className="mt-[32px] text-[#060809] font-medium text-[20px] leading-[28px]">
                Services requested
              </div>
              <div className="max-w-[278px] mb-4 text-center text-[#555555] font-normal text-[16px] leading-[24px]">
                You have successfully requested services for {customerName}
              </div>
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  className="w-[175px]"
                  onClick={() => {
                    setRequestService();
                  }}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
      {showSummary && (
        <Portal
          onClose={() => {
            setShowSummary(false);
          }}
        >
          <div
            className="bg-white mt-4 md:w-[97%] lg:w-[41vw] mx-auto rounded-md"
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            <div className=" flex justify-between w-[97%] mx-auto  bg-[#F2F5F9] mt-[8px] xl:mt-[0.55vw] px-[1.1vw] py-[2.2vw]">
              <div>
                <h1 className="font-bold text-[20px] xl:text-[1.38vw] ">
                  Invoice
                </h1>
                <p className=" text-[10px] xl:text-[0.69vw] font-[400] mt-[0.97vw]">
                  Billed to:
                </p>
                <p className="text-[14px] xl:text-[0.97vw] text-[#04050F] font-semibold">
                  {customerName}
                </p>

                <p className="text-[10px] xl:text-[0.69vw] font-[500] text-[#04050F]">
                  {customerEmail}
                </p>
              </div>

              {/*<div className="sm:text-right">
                <p className=" text-[10px] xl:text-[0.69vw]">Invoice Number</p>
                <h1 className="font-bold text-[14px] xl:text-[0.97vw] text-[#04050F]">
                  {invoice?.number}
                </h1>
                <p className="text-[10px] xl:text-[0.67vw] font-[400] text-[#4C5259] mt-[0.97vw]">
                  Issued on
                </p>
                <p className="mb-[12px] text-[#04050F] text-[10px] xl:text-[0.67vw] font-[500]">
                  {formatDateToYYYYMMDD(invoice?.createdAt)}
                </p>
              </div> */}
            </div>

            <div
              className=" text-[10px] rounded-[3px] xl:rounded-[0.2vw] xl:text-[0.7vw] mt-[24px] xl:mt-[1.7vw] w-[90%] mx-auto"
              style={{ border: "1px solid #DFE4EA" }}
            >
              <div className="flex justify-between border-b font-semibold px-[9px] xl:px-[0.62vw] py-[12px] xl:py-[0.83vw]">
                <h1 className="w-[33%]">Name</h1>
                <h1 className="w-[7%] text-center ">Duration</h1>
                {/* <h1 className="w-[18%] text-center">Recurring</h1> */}
                <h1 className="w-[18%] text-end">Amount</h1>
              </div>
              {items?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between border-b px-[9px] xl:px-[0.62vw] py-[12px] xl:py-[0.83vw]"
                  >
                    <h1 className="w-[33%] ">{item.name}</h1>
                    <h1 className="w-[7%] text-center">{item.duration}</h1>
                    {/* <h1 className="w-[18%] text-center">
                      {item.recurring ? "Yes" : "No"}
                    </h1> */}
                    <h1 className="w-[18%] text-end">
                      {formatWithCommas(item.price)}
                    </h1>
                  </div>
                );
              })}
            </div>
            <div className="flex w-[90%] mx-auto mt-[24px] xl:mt-[1.67vw] items-center">
              <div className="border-t-[2px] rounded-sm  w-[60%]"></div>
              <div className="flex justify-between items-center w-[40%] bg-[#F2F5F9] px-[20px] xl:px-[1.38vw] py-[12px] xl:py-[0.83vw] rounded-[12px] xl:rounded-[0.8vw]">
                <p className="text-[10px] xl:text-[0.7vw]">
                  {/* Total ( {invoice?.currency} ) */}₦{" "}
                </p>
                <span className="font-bold text-[16px] xl:text-[1.1vw]">
                  {/* {formatWithCommas(invoice?.amount)} */}
                  {pickedServices
                    .reduce(
                      (acc: number, item: any) => (acc += +item?.price),
                      0
                    )
                    .toLocaleString("en-US")}
                </span>
              </div>
            </div>

            <div className=" bg-[#F9F9FA] mt-[45px] text-[#04050F] flex flex-col xl:mt-[3.1vw] px-[30px] py-[16px] xl:px-[2.08vw] xl:py-[1.1vw]">
              <div className="flex justify-between mt-[12px] xl:mt-[0.83vw]">
                <div className="w-[30%]">
                  <Image
                    alt="logo dashboard"
                    src="/logomain.svg"
                    height={25}
                    width={25}
                  />
                  <h1 className="font-bold text-[14px] xl:text-[0.87vw]">
                    Accountable TechServe
                  </h1>
                  <p className="mt-[8px] xl:mt-[0.55vw] text-[10px] xl:text-[0.7vw]">
                    56,Admiralty Rd,Lekki Lagos.
                  </p>
                  <p className="text-[#071A7E] mt-[8px] xl:mt-[0.55vw] text-[10px] xl:text-[0.7vw]">
                    Product@accountable.com
                  </p>
                </div>
                <div className="w-[30%] text-[10px] xl:text-[0.7vw]">
                  <p className="font-semibold">Payment Details</p>
                  <>
                    <p className="mt-[8px] xl:mt-[0.55vw] font-[400]">
                      {/* Recurring: {invoice?.recurring ? "Yes" : "No"} */}
                    </p>
                    <p className="mt-[8px] xl:mt-[0.55vw] font-[400]">
                      Paid: No
                    </p>
                    <p className="text-[12px] xl:text-[0.83vw] border-b border-gray-500 font-normal mt-[8px] xl:mt-[0.55vw] mb-3 "></p>
                    <Button
                      isLoading={resp.loading || isSubmitting}
                      disabled={resp.loading || isSubmitting}
                      onClick={() => {
                        // console.log(items);
                        requestService({
                          variables: {
                            input: {
                              customerId,
                              services: items.map((item: any) => {
                                return {
                                  serviceId: item?.id,
                                  price: item?.price,
                                  duration: item?.duration,
                                };
                              }),
                            },
                          },
                        });
                      }}
                    >
                      Send
                    </Button>
                  </>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default RequestService;

// const Page = () => {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   if (!id) {
//     window.location.href = "/404";
//   }

//   const { loading, data, error } = useQuery(INVOICE_DETAILS, {
//     variables: {
//       input: {
//         invoiceId: id,
//       },
//     },
//   });
//   const invoice = data?.invoice?.data;
//   console.log(data);
//   console.log(error);

//   //@ts-ignore
//   const handleFlutterPayment = useFlutterwave({
//     public_key: "FLWPUBK_TEST-78c32a8b72a024530811d57ff2768e5a-X",
//     tx_ref: "Accountable-1687650943124-8278266",
//     amount: invoice?.amount,
//     currency: invoice?.currency,
//     payment_options: "card",
//     customer: {
//       email: invoice?.initiator.email,
//       phone_number: '',
//       name: invoice?.initiator.firstName + " " + invoice?.initiator.lastName,
//     },

//     // customizations: {
//     //   title: "my Payment Title",
//     //   description: "Payment for items in cart",
//     //   logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
//     // },
//   });

//   if (loading) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <BeatLoader />
//       </div>
//     );
//   }

//   return (
//     <div
//       className="mt-4 md:w-[97%] lg:w-[41vw] mx-auto"
//       style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
//     >
//       <div className=" flex justify-between w-[97%] mx-auto  bg-[#F2F5F9] mt-[8px] xl:mt-[0.55vw] px-[1.1vw] py-[2.2vw]">
//         <div>
//           <h1 className="font-bold text-[20px] xl:text-[1.38vw] ">Invoice</h1>
//           <p className=" text-[10px] xl:text-[0.69vw] font-[400] mt-[0.97vw]">
//             Billed to:
//           </p>
//           <p className="text-[14px] xl:text-[0.97vw] text-[#04050F] font-semibold">
//             {invoice?.initiator?.firstName} {invoice?.initiator?.lastName}
//           </p>

//           <p className="text-[10px] xl:text-[0.69vw] font-[500] text-[#04050F]">
//             {invoice?.initiator?.email}
//           </p>
//         </div>

//         <div className="sm:text-right">
//           <p className=" text-[10px] xl:text-[0.69vw]">Invoice Number</p>
//           <h1 className="font-bold text-[14px] xl:text-[0.97vw] text-[#04050F]">
//             {invoice?.number}
//           </h1>
//           <p className="text-[10px] xl:text-[0.67vw] font-[400] text-[#4C5259] mt-[0.97vw]">
//             Issued on
//           </p>
//           <p className="mb-[12px] text-[#04050F] text-[10px] xl:text-[0.67vw] font-[500]">
//             {formatDateToYYYYMMDD(invoice?.createdAt)}
//           </p>
//         </div>
//       </div>

//       <div
//         className=" text-[10px] rounded-[3px] xl:rounded-[0.2vw] xl:text-[0.7vw] mt-[24px] xl:mt-[1.7vw] w-[90%] mx-auto"
//         style={{ border: "1px solid #DFE4EA" }}
//       >
//         <div className="flex justify-between border-b font-semibold px-[9px] xl:px-[0.62vw] py-[12px] xl:py-[0.83vw]">
//           <h1 className="w-[33%]">Name</h1>
//           <h1 className="w-[7%] text-center ">Unit</h1>
//           <h1 className="w-[18%] text-center">Recurring</h1>
//           <h1 className="w-[18%] text-end">Amount</h1>
//         </div>
//         {invoice?.items?.map((item: any, index: number) => {
//           return (
//             <div
//               key={index}
//               className="flex justify-between border-b px-[9px] xl:px-[0.62vw] py-[12px] xl:py-[0.83vw]"
//             >
//               <h1 className="w-[33%] ">{item.name}</h1>
//               <h1 className="w-[7%] text-center">{item.occurrence}</h1>
//               <h1 className="w-[18%] text-center">
//                 {item.recurring ? "Yes" : "No"}
//               </h1>
//               <h1 className="w-[18%] text-end">
//                 {formatWithCommas(item.price)}
//               </h1>
//             </div>
//           );
//         })}
//       </div>
//       <div className="flex w-[90%] mx-auto mt-[24px] xl:mt-[1.67vw] items-center">
//         <div className="border-t-[2px] rounded-sm  w-[60%]"></div>
//         <div className="flex justify-between items-center w-[40%] bg-[#F2F5F9] px-[20px] xl:px-[1.38vw] py-[12px] xl:py-[0.83vw] rounded-[12px] xl:rounded-[0.8vw]">
//           <p className="text-[10px] xl:text-[0.7vw]">
//             Total ( {invoice?.currency} )
//           </p>
//           <span className="font-bold text-[16px] xl:text-[1.1vw]">
//             {formatWithCommas(invoice?.amount)}
//           </span>
//         </div>
//       </div>

//       <div className=" bg-[#F9F9FA] mt-[45px] text-[#04050F] flex flex-col xl:mt-[3.1vw] px-[30px] py-[16px] xl:px-[2.08vw] xl:py-[1.1vw]">
//         <div className="flex justify-between mt-[12px] xl:mt-[0.83vw]">
//           <div className="w-[30%]">
//             <Image
//               alt="logo dashboard"
//               src="/logomain.svg"
//               height={25}
//               width={25}
//             />
//             <h1 className="font-bold text-[14px] xl:text-[0.87vw]">
//               Accountable TechServe
//             </h1>
//             <p className="mt-[8px] xl:mt-[0.55vw] text-[10px] xl:text-[0.7vw]">
//               56,Admiralty Rd,Lekki Lagos.
//             </p>
//             <p className="text-[#071A7E] mt-[8px] xl:mt-[0.55vw] text-[10px] xl:text-[0.7vw]">
//               Product@accountable.com
//             </p>
//           </div>
//           <div className="w-[30%] text-[10px] xl:text-[0.7vw]">
//             <p className="font-semibold">Payment Details</p>
//             <>
//               <p className="mt-[8px] xl:mt-[0.55vw] font-[400]">
//                 Recurring: {invoice?.recurring ? "Yes" : "No"}
//               </p>
//               <p className="mt-[8px] xl:mt-[0.55vw] font-[400]">
//                 Paid: {invoice?.paid ? "Yes" : "No"}
//               </p>
//               <p className="text-[12px] xl:text-[0.83vw] border-b border-gray-500 font-normal mt-[8px] xl:mt-[0.55vw] mb-3 "></p>
//               <Button onClick={() => {
//                 handleFlutterPayment({
//                   callback: (response: any) => {
//                     console.log(response);
//                     closePaymentModal();

//                   },
//                   onClose: () => {
//                     closePaymentModal();
//                   }

//                 });
//               }}>Pay Now</Button>
//             </>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const formatWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatDateToYYYYMMDD = (date: string) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();
  return [year, month, day].join("-");
};
