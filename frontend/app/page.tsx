"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const variants = {
    hidden: { scale: 0.8, rotate: 2, opacity: 0 },
    show: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-2 p-24"
      initial="hidden"
      animate="show"
      variants={variants}
    >
      <h1 className="text-5xl font-bold bg-background">SRTIFY</h1>
      <p className="text-lg text-center text-slate-500">
        Create SRT files for your videos.
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        <Link
          href={"/dashboard"}
          className={buttonVariants({ variant: "outline" })}
        >
          Dashboard
        </Link>
        <Link
          href={"/transcribe"}
          className={buttonVariants({ variant: "default" })}
        >
          Transcribe
        </Link>
      </div>
    </motion.div>
  );
}
