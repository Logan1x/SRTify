"use client";

import React from "react";
import { ModeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "./button";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Nav() {
  const currentRoute = usePathname();
  console.log(currentRoute);
  return (
    <nav className="flex items-center justify-between p-4 border-b-2 border-muted">
      <div className="flex items-center space-x-4">
        <a href="/" className="font-bold">
          SRTIFY
        </a>
      </div>
      <div className="flex items-center gap-2">
        {currentRoute === "/dashboard" ? (
          <Link
            href={"/transcribe"}
            className={`${buttonVariants({
              variant: "default",
            })} border-primary text-primary hover:bg-primary hover:text-secondary`}
          >
            Transcribe
          </Link>
        ) : (
          <Link
            href={"/dashboard"}
            className={`${buttonVariants({
              variant: "outline",
            })} border-primary text-primary hover:bg-primary hover:text-secondary`}
          >
            Dashboard
          </Link>
        )}

        <ModeToggle />
      </div>
    </nav>
  );
}

export default Nav;
