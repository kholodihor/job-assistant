"use client";

import Image from "next/image";

const templates = [
  {
    name: "Classic",
    image: "/templates/classic.jpg",
  },
  {
    name: "Modern Dark",
    image: "/templates/modern-dark.jpg",
  },
  {
    name: "Detailed",
    image: "/templates/letter-detailed.jpg",
  },
  {
    name: "Short",
    image: "/templates/letter-short.jpg",
  },
];

export const Templates = () => {
  return (
    <div className="flex w-full flex-col items-center justify-around gap-4 py-4 lg:flex-row">
      {templates.map((template, index) => (
        <div key={index} className="flex flex-col items-start gap-2">
          <h4 className="font-bold">{template.name}</h4>
          <Image
            src={template.image}
            alt={template.name}
            width={500}
            height={500}
          />
        </div>
      ))}
    </div>
  );
};
