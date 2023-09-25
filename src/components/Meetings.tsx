"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Meeting from "@/components/Meeting";
import { twMerge } from "tailwind-merge";
import { GET_ACCOUNT_MANAGER } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

const Meetings = () => {
  const [link, setLink] = useState("");
  const [meetings, setMeetings] = useState<any>([]);

  console.log(meetings);

  const [currentDate, setCurrentDate] = useState(moment());

  const { loading, data, error } = useQuery(GET_ACCOUNT_MANAGER, {
    variables: {
      input: { month: currentDate.month(), year: currentDate.year() },
    },
  });

  useEffect(() => {
    console.log(data);
    if (data?.getCalendar?.code) {
      console.log(data?.getCalendar?.code);
    } else if (data?.getCalendar?.data) {
      setMeetings(data?.getCalendar?.data);
      // setLink(data?.getCalendar?.data?.link);
    }
  }, [data]);

  const weekdays = moment.weekdaysShort();
  const weekdaysStartingFromMonday = [...weekdays.slice(1), weekdays[0]]; // Rearrange weekdays to start from Monday

  const renderWeekdays = () => {
    return weekdaysStartingFromMonday.map((weekday) => (
      <div key={weekday} className="flex justify-end">
        {weekday}
      </div>
    ));
  };

  const renderCalendarDays = () => {
    const today = moment().startOf("day");
    const firstDayOfMonth = moment(currentDate).startOf("month").day() - 1;
    const daysInMonth = moment(currentDate).daysInMonth();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDay = moment(currentDate)
        .startOf("month")
        .subtract(firstDayOfMonth - i, "days");
      days.push(
        <div
          key={`empty-${i}`}
          className={`p-2 bg-white h-[130px] flex flex-col gap-y-1 items-end box-border shadow-[0_0_0_1px_#E7E7E7]`}
        >
          {" "}
          {prevMonthDay.format("D")}
        </div>
      );
    }

    // for (let i = 1; i < firstDayOfMonth; i++) {
    //   const prevMonthDay = moment(currentDate)
    //     .startOf("month")
    //     .subtract(firstDayOfMonth - i, "days");
    //   days.push(
    //     <div
    //       key={`prev-day-${i}`}
    //       className={twMerge(
    //         `p-2 bg-white h-[130px] flex flex-col gap-y-1 items-end box-border shadow-[0_0_0_1px_#E7E7E7]`
    //       )}
    //     >
    //       {prevMonthDay.format("D")}
    //     </div>
    //   );
    // }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(currentDate).date(i);
      // console.log(date.format());
      const isToday = date.isSame(moment(), "day");
      const isEventDay = meetings?.some((event: any) => {
        return (
          moment(event?.start?.dateTime).isSame(date, "day") &&
          event?.summary?.includes("Manager")
        );
      });
      const isWeekend = date.day() === 0 || date.day() === 6;

      // console.log(
      //   meetings?.filter((event: any) =>
      //     moment(event?.updated).isSame(date, "day")
      //   )
      // );
      days.push(
        <div
          key={`day-${i}`}
          className={twMerge(
            `p-2 bg-white h-[130px] flex flex-col gap-y-1 items-end box-border shadow-[0_0_0_1px_#E7E7E7]`,
            isWeekend && "bg-[#FAFBFC]"
          )}
        >
          <span
            className={`text-[14px] leading-[15px] m-1 ${
              isToday
                ? "w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#00085A] text-white"
                : ""
            }`}
          >
            {i}
          </span>
          {/* {isToday && <Meeting />} */}
          {/* {isEventDay && <Meeting />} */}
          {
            <>
              {isEventDay && (
                <Meeting
                  details={
                    meetings?.filter((event: any) => {
                      return (
                        moment(event?.start?.dateTime).isSame(date, "day") &&
                        event?.summary?.includes("Meet")
                      );
                    })[0]
                  }
                  // link={link}
                />
              )}
            </>
          }
        </div>
      );
    }

    const lastDayOfMonth = moment(currentDate).endOf("month").day();
    for (let i = lastDayOfMonth + 1; i <= 7; i++) {
      const nextMonthDay = moment(currentDate)
        .endOf("month")
        .add(i - lastDayOfMonth, "days");

      const isWeekend = nextMonthDay.day() === 0 || nextMonthDay.day() === 6;

      days.push(
        <div
          key={`next-day-${i}`}
          className={twMerge(
            `p-2 bg-white h-[130px] flex flex-col gap-y-1 items-end box-border shadow-[0_0_0_1px_#E7E7E7]`,
            isWeekend && "bg-[#FAFBFC]"
          )}
        >
          {nextMonthDay.format("D")}
        </div>
      );
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "month"));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {" "}
      <div className="min-h-[471px] bg-white border-[1px] border-[#E6E6E6] rounded-2xl mt-8">
        <div className="h-[68px] flex justify-between items-center px-6 border-b-[1px] border-[#EAEDEF]">
          {currentDate.format("MMMM YYYY")}
          <div className="flex gap-x-1 items-center">
            <span
              onClick={previousMonth}
              className="cursor-pointer w-[36px] h-[36px] border-[1px] border-[#E7E7E7] rounded-[4px] flex items-center justify-center"
            >
              <CaretLeft />
            </span>
            <span className="border-[1px] border-[#E7E7E7] rounded-[4px] flex items-center justify-center p-1">
              {currentDate.isSame(moment(), "day")
                ? "Today"
                : currentDate.format("dddd")}
            </span>
            <span
              onClick={nextMonth}
              className="cursor-pointer w-[36px] h-[36px] border-[1px] border-[#E7E7E7] rounded-[4px] flex items-center justify-center"
            >
              <CaretRight />
            </span>
          </div>
        </div>

        <div className="p-4 grid grid-cols-7">
          {renderWeekdays()}
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default Meetings;
