import React from "react";
import { Icon } from "@/components/shared/icon";

export const Avatar: React.FC<{ name: string | null | undefined }> = ({
  name,
}) => {
  const getInitials = (fullname: string) => {
    const names = fullname.split(" ");
    return names
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(name || "");

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-[50%] bg-blue-50 text-base font-normal">
        {name === null || name === undefined ? (
          <Icon name="icon-person" size="w-6 h-6" />
        ) : (
          initials
        )}
      </div>

      {name && name.trim() !== "" && (
        <span className="hidden text-base font-semibold md:inline-block">
          {name}
        </span>
      )}
    </div>
  );
};
