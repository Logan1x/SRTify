"use client";

import React from "react";
import { ModeToggle } from "./theme-toggle";
import { buttonVariants } from "./button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

function Nav() {
  const currentRoute = usePathname();

  const variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.nav
      className="flex items-center justify-between p-4 border-b-2 border-muted"
      initial="hidden"
      animate="show"
      variants={variants}
    >
      <div className="flex items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 225 225"
          className="w-6 h-6 fill-none stroke-black dark:stroke-white dark:fill-none "
        >
          <g transform="matrix( 1, 0, 0, 1, 0,0) ">
            <g>
              <path
                style={{
                  strokeWidth: 13,
                  strokeLinecap: "square",
                  strokeMiterlimit: 3,
                }}
                d="M113,140.4h39.2c8.6,0,16-3.1,22-9.2c4.7-4.7,7.6-10.2,8.7-16.4
			c-5.5-2.7-11.6-4.1-18.3-4.1H53.5c-9,0-16.6-3.2-23-9.5c-6.3-6.3-9.5-14-9.5-23s3.2-16.6,9.5-23c4.1-4.1,8.7-6.8,13.8-8.3
			c1.1-4.1,3.2-7.7,6.4-10.9c4.8-4.8,10.6-7.2,17.4-7.2h45.4c3.1,0.2,5.6,1.2,7.6,3c1.9,1.8,2.8,3.9,2.5,6.2
			c-0.2,2.3-1.5,4.2-3.8,5.8c-2.3,1.5-4.9,2.2-7.7,2H53.5c-3.2,0-6.3,0.4-9.2,1.2c-0.5,2-0.8,4.2-0.8,6.5c0,6.8,2.4,12.6,7.2,17.4
			c4.8,4.8,10.6,7.2,17.4,7.2h84.2c8.6,0,16,3,22,9.1c6.1,6.1,9.2,13.5,9.2,22.1c0,2-0.2,3.8-0.5,5.6c3.9,2,7.5,4.6,10.9,7.9
			c8.1,8.1,12.1,17.8,12.1,29.2c0,11.4-4,21.1-12.1,29.1c-8,8.1-17.7,12.1-29.1,12.1H111 M86.7,187.2c-0.4-0.3-0.7-0.7-1.1-1.1
			c-5.3-5.3-7.9-11.6-7.9-19.1s2.6-13.9,7.9-19.1c2.6-2.6,5.5-4.5,8.7-5.9"
              />
            </g>
          </g>
        </svg>

        <Link href="/" className="font-bold text-xl">
          SRTIFY
        </Link>
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
    </motion.nav>
  );
}

export default Nav;
