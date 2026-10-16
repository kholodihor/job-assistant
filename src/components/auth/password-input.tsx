"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { FormControl, useFormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/icon";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

/**
 * Password field with a visibility toggle. Must be rendered inside a
 * <FormItem>; FormControl sits directly on the <input> so <FormLabel> and
 * aria-describedby link to it.
 */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const { error } = useFormField();
  const t = useTranslations("Auth.passwordInput");

  return (
    <div className="relative flex items-center">
      <FormControl>
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-12", className)}
          {...props}
        />
      </FormControl>
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? t("hide") : t("show")}
        aria-pressed={visible}
        className={cn(
          "absolute right-4 border-none bg-inherit p-0",
          error
            ? "stroke-red-500 text-red-500"
            : "stroke-gray-500 text-gray-400"
        )}
      >
        <Icon name={visible ? "icon-closed" : "icon-open"} size="24px" />
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
