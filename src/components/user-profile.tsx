"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export function UserProfile() {
  const { data: session } = useSession();

  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
      {session ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <Image
                width={50}
                height={50}
                src={session.user.image}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-bold">
                Welcome, {session.user?.name || session.user?.email}!
              </h2>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
          </div>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold">Welcome to CVBaza!</h2>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline">Register</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
