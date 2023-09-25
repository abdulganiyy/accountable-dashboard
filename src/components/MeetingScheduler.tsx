import React, { FC, useState, useEffect } from "react";
import { GET_ACCOUNT_MANAGER } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { BeatLoader } from "react-spinners";
import moment from "moment";
// import Iframe from "react-iframe";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import Button from "./buttons/Button";
// import DatePicker from "./inputs/DatePicker";
// import TimePicker from "./inputs/TimePicker";
// import TextInput from "./inputs/TextInput";
// // import { apiCalendar } from "@/utils";
// import timezone from "city-timezones";

// const callSchema = yup.object({
//   date: yup.string().required(),
//   time: yup.string().required(),
//   note: yup.string(),
// });

interface MeetingSchedulerProps {
  onSubmitCallback?: () => void;
  onCancel?: () => void;
}

const MeetingScheduler: FC<MeetingSchedulerProps> = ({
  onSubmitCallback,
  onCancel,
}) => {
  const [link, setLink] = useState("");
  const [currentDate, setCurrentDate] = useState(moment());
  console.log(currentDate.month());

  const { loading, data, error } = useQuery(GET_ACCOUNT_MANAGER, {
    variables: {
      input: { month: +currentDate.month(), year: +currentDate.year() },
    },
  });

  useEffect(() => {
    console.log(data);
    if (data?.getAccountManagerCalendar?.code) {
      console.log(data?.getAccountManagerCalendar?.code);
    } else if (data?.getAccountManagerCalendar?.data) {
      console.log(data?.getAccountManagerCalendar?.data?.link);

      setLink(data?.getAccountManagerCalendar?.data?.link);
    }
  }, [data, currentDate.month(), currentDate.year()]);

  // useEffect(() => {
  //   const closeIframe = () => {
  //     onSubmitCallback();
  //   };

  //   window.addEventListener("beforeunload", closeIframe);

  //   return () => {
  //     window.removeEventListener("beforeunload", closeIframe);
  //   };
  // }, [onSubmitCallback]);

  if (loading) return <BeatLoader />;

  return (
    <iframe
      src={link}
      style={{
        border: 0,
        background: "white",
        width: "1000px",
        height: "600px",
      }}

      // height="600"
      // frameborder="0"
    ></iframe>
  );
};

export default MeetingScheduler;
