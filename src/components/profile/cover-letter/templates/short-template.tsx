import { LetterData } from "@/types/letter";

export const ShortTemplate = ({ data }: { data: LetterData }) => {
  const formattedText = data.text
    ? data.text.split("\n").map((line, index) => (
        <p key={index} className="indent-2 text-[12px] sm:text-sm md:text-lg">
          {line}
        </p>
      ))
    : null;

  return (
    <div className="aspect-[210/297] h-fit w-full bg-white text-black-400">
      <div className="flex flex-col gap-8 bg-[#e6f1f3] md:h-[285px]">
        <div className="flex flex-1 flex-col items-center justify-center px-2 py-6 text-left md:p-6">
          <h1 className="mb-1 whitespace-normal text-center text-lg font-semibold uppercase tracking-widest sm:mb-3 sm:text-[28px] md:mb-8 md:text-[50px]">
            {data.name}
          </h1>
          {data.profession && (
            <p className="mb-1 whitespace-normal text-center text-[12px] font-semibold uppercase text-[#8b8f92] sm:text-[14px] md:text-[26px] md:tracking-[8px]">
              {data.profession}
            </p>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute bottom-[-13px] left-0 flex w-full justify-between px-1 sm:justify-around sm:px-0 md:bottom-[-20px] md:px-3 lg:px-8">
          <p className="flex min-w-[80px] items-center justify-center rounded-3xl bg-[#8dcedc] px-1 py-2 text-[8px] font-semibold text-white sm:min-w-[100px] sm:text-[8px] md:w-[200px] md:break-all md:px-3 md:text-[14px] lg:text-[16px]">
            {data.phone}
          </p>
          <p className="flex min-w-[80px] items-center justify-center rounded-3xl bg-[#8dcedc] px-1 py-2 text-center text-[8px] font-semibold text-white sm:min-w-[100px] sm:text-[8px] md:min-w-[200px] md:max-w-[300px] md:break-all md:px-3 md:text-[14px] lg:text-[16px]">
            {data.location}
          </p>
          <p className="flex min-w-[100px] items-center justify-center rounded-3xl bg-[#8dcedc] px-1 py-2 text-center text-[8px] font-semibold text-white sm:min-w-[100px] sm:text-[8px] md:min-w-[150px] md:break-all md:px-3 md:text-[14px] lg:text-[16px]">
            {data.email}
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-y-4 px-2 pb-5 pt-16 md:gap-y-8 md:px-12 md:pt-24">
        <p className="indent-2 text-sm sm:text-lg md:text-xl">
          {data.nameRecipient},
        </p>
        {formattedText}
        <p className="indent-2 text-sm sm:text-lg md:text-xl">{data.name}</p>
      </div>
    </div>
  );
};
