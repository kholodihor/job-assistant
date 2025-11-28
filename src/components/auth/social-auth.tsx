"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../shared/icon";

export function SocialAuth() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
      <Button
        variant="outline"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-base font-medium transition-colors hover:bg-gray-50 sm:w-[200px]"
        onClick={() =>
          authClient.signIn.social({
            provider: "google",
            callbackURL: "/profile/dashboard",
          })
        }
      >
        <Icon name="icon-google" size="24px" />
        Google
      </Button>
      {/* <Button
        variant="outline"
        onClick={() => signIn("github", { callbackUrl: "/profile/dashboard" })}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-base font-medium transition-colors hover:bg-gray-50 sm:w-[200px]"
      >
        <Icon name="icon-git" size="24px" />
        GitHub
      </Button> */}
    </div>
  );
}
