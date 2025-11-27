import { useEffect, useState } from "react";
import { LetterData } from "@/types/letter";

// const formatDate = (date: Date) => {
//   return new Intl.DateTimeFormat("uk-UA", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(date);
// };

export const DetailedTemplate = ({ data }: { data: LetterData }) => {
  const [currentDate, setCurrentDate] = useState("");

  const formattedText = data.text
    ? data.text.split("\n").map((line, index) => (
        <p key={index} className="text-[12px] sm:text-sm md:text-lg">
          {line}
        </p>
      ))
    : null;

  useEffect(() => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    };

    setCurrentDate(formatDate(new Date()));
  }, []);

  return (
    <div className="aspect-[210/297] h-fit w-full bg-white text-black-400">
      {/* Header */}
      <div className="flex h-[75px] flex-col sm:h-[100px] md:h-[195px]">
        <div className="relative flex flex-1 flex-col text-left sm:px-3 sm:pt-3 md:px-12 md:pt-12">
          <h1 className="mb-1 whitespace-normal text-2xl font-bold uppercase md:mb-5 md:text-[50px] md:font-medium md:tracking-widest">
            {data.name}
          </h1>
          {data.profession && (
            <p className="w-[70%] text-[12px] font-medium capitalize leading-[1.2] sm:text-[16px] md:text-[30px]">
              {data.profession}
            </p>
          )}
          <div className="absolute bottom-[-15px] left-0 flex w-full flex-col items-end sm:px-3 md:bottom-[25px] md:px-12">
            <p className="w-[200px] break-all rounded-3xl text-end text-[12px] italic leading-[1.2] sm:text-[14px] md:text-[20px]">
              {data.phone}
            </p>
            <p className="min-w-[150px] break-all rounded-3xl text-end text-[12px] italic leading-[1.2] sm:text-[14px] md:text-[20px]">
              {data.email}
            </p>
            <p className="min-w-[200px] max-w-[300px] break-all rounded-3xl text-end text-[12px] italic leading-[1.2] sm:text-[14px] md:text-[20px]">
              {data.location}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mx-auto mt-[1.5rem] flex w-[100%] self-center border-t border-[#000] sm:w-[95%] md:mt-3 md:w-[88%] md:pt-3">
          <p className="w-[100%] pt-[10px] text-end text-[14px] md:pt-[20px] md:text-[16px]">
            {currentDate}
          </p>
        </div>

        <div className="w-[90%] pt-2 sm:px-2 md:w-[70%] md:px-12 md:pt-5">
          <p className="text-[14px] md:text-xl">{data.nameRecipient}</p>
          <p className="text-[14px] md:text-xl">{data.positionRecipient},</p>
          <p className="text-[14px] md:text-xl">{data.company}</p>
        </div>

        <div className="flex min-h-0 flex-col gap-y-5 pb-5 pt-5 sm:px-2 md:px-12 md:pt-12">
          <div className="w-[90%] pb-7 text-[14px] md:w-[70%] md:pb-5 md:text-xl">
            JOB REFERENCE: {data.position}
          </div>
          <p className="text-[12px] sm:text-sm md:text-lg">
            {data.nameRecipient},
          </p>
          {formattedText}
          <p className="text-[12px] sm:text-sm md:text-lg">{data.name}</p>
        </div>
      </div>
    </div>
  );
};
