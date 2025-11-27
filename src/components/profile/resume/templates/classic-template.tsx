import Image from "next/image";
import { format, parseISO } from "date-fns";
import parse from "html-react-parser";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaBehance, FaDribbble, FaTelegram } from "react-icons/fa";
import { SiAdobeacrobatreader } from "react-icons/si";
import { Github } from "@/components/icons/github";
import { Linkedin } from "@/components/icons/linkedin";
import { ResumeData } from "@/types/resume";

const formatDate = (date: string) => {
  if (!date) return "";
  try {
    return format(parseISO(date), "MMM yyyy");
  } catch {
    return date;
  }
};

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <h3 className="mb-4 bg-black-400 text-center text-xs font-bold uppercase text-white md:text-lg">
      {title}
    </h3>
  );
};

const ContactItem = ({
  icon: Icon,
  text,
  link,
  isLink = false,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  link?: string;
  isLink?: boolean;
}) => {
  return (
    <>
      {isLink ? (
        <a href={link} className="flex items-center gap-2">
          <Icon className="h-2 w-2 min-w-2 text-gray-600 md:h-4 md:w-4 md:min-w-4" />
          <span className="text-xs md:text-[13px]">{text}</span>
        </a>
      ) : (
        <div className="flex items-center gap-2">
          <Icon className="h-2 w-2 min-w-2 text-gray-600 md:h-4 md:w-4 md:min-w-4" />
          <span className="text-xs md:text-[13px]">{text}</span>
        </div>
      )}
    </>
  );
};

export const ClassicTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="aspect-[210/297] h-fit w-full bg-white text-black-400">
      {/* Header Section */}
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="flex h-[12rem] w-full items-center justify-center bg-gray-200 sm:w-1/3">
          {data.photo && typeof data.photo === "string" && (
            <div className="h-24 w-24 overflow-hidden rounded-full border-[0.7rem] border-white md:h-32 md:w-32">
              <Image
                src={data.photo}
                width={128}
                height={128}
                alt={`${data.name}'s photo`}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col items-start justify-center p-6 text-left">
          <h1 className="mb-1 text-center text-xl font-bold sm:text-left sm:text-2xl">
            {data.name}
          </h1>
          {data.profession && (
            <p className="mb-1 text-center text-sm font-[600] text-gray-600 sm:text-left">
              {data.profession}
            </p>
          )}
          {data.summary && (
            <p className="mt-4 text-xs text-gray-600 md:text-sm">
              {data.summary}
            </p>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Left Column */}
        <div className="w-1/3 space-y-8 bg-gray-200 px-2">
          {/* Contact Section */}
          {(data.email || data.phone || data.location) && (
            <div className="my-2">
              <SectionTitle title="Contact" />
              <div className="space-y-6">
                {data.phone && <ContactItem icon={Phone} text={data.phone} />}
                {data.location && (
                  <ContactItem icon={MapPin} text={data.location} />
                )}
                {data.email && (
                  <ContactItem
                    icon={Mail}
                    text={data.email}
                    isLink={true}
                    link={`mailto:${data.email}`}
                  />
                )}
                {data.telegram && (
                  <ContactItem
                    icon={FaTelegram}
                    text="Telegram"
                    isLink={true}
                    link={data.telegram}
                  />
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(data.linkedin || data.github || data.behance) && (
            <div>
              <SectionTitle title="Social" />
              <div className="space-y-6">
                {data.linkedin && (
                  <ContactItem
                    icon={Linkedin}
                    text="Linkedin"
                    isLink={true}
                    link={data.linkedin}
                  />
                )}
                {data.github && (
                  <ContactItem
                    icon={Github}
                    text="Github"
                    isLink={true}
                    link={data.github}
                  />
                )}
                {data.behance && (
                  <ContactItem
                    icon={FaBehance}
                    text="Behance"
                    isLink={true}
                    link={data.behance}
                  />
                )}
                {data.dribbble && (
                  <ContactItem
                    icon={FaDribbble}
                    text="Dribbble"
                    isLink={true}
                    link={data.dribbble}
                  />
                )}
                {data.adobePortfolio && (
                  <ContactItem
                    icon={SiAdobeacrobatreader}
                    text="Adobe Portfolio"
                    isLink={true}
                    link={data.adobePortfolio}
                  />
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {Array.isArray(data.skills) && data.skills.length > 0 && (
            <div>
              <SectionTitle title="Skills" />
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-gray-300 px-2 py-1 text-xs md:text-[13px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {Array.isArray(data.languages) && data.languages.length > 0 && (
            <div>
              <SectionTitle title="Languages" />
              <div className="space-y-2">
                {data.languages.map((language, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-xs md:text-[13px]"
                  >
                    <span>{language.language}</span>
                    <span className="text-gray-600">{language.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-8 p-4">
          {/* Experience Section */}
          {data.workExperiences?.length ? (
            <div>
              <SectionTitle title="Work Experience" />
              <div className="space-y-4">
                {data.workExperiences.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="text-xs font-bold md:text-sm">
                      {exp.position}
                    </h4>
                    {exp.company && (
                      <p className="text-xs text-gray-600 md:text-sm">
                        {exp.company} | {formatDate(exp.startDate!)} -{" "}
                        {formatDate(exp.endDate!)}
                      </p>
                    )}
                    <div className="text-sm [&>ol]:ml-4 [&>ol]:list-disc [&>ul>li]:pl-2 [&>ul]:ml-4 [&>ul]:list-['-']">
                      {parse(exp.description || "Work Experience Description")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Education Section */}
          {data.educations && data?.educations?.length > 0 && (
            <div>
              <SectionTitle title="Education" />
              <div className="space-y-4">
                {data?.educations?.map((edu, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="text-xs font-bold md:text-sm">
                      {edu.degree}
                    </h4>
                    {edu.institution && (
                      <p className="text-xs text-gray-600 md:text-sm">
                        {edu.institution} | {formatDate(edu.startDate!)} -{" "}
                        {formatDate(edu.endDate!)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
