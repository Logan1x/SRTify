import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 p-24">
      <h1 className="text-5xl font-bold">SRTIFY</h1>
      <p className="text-lg text-center text-slate-500">
        Create SRT files for your videos.
      </p>
      <div className="flex flex-wrap gap-2">
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
    </main>
  );
}
