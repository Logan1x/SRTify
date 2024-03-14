"use client";

import React, { useEffect } from "react";
import { axGetAllTranscriptions } from "@/services/transcription";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface ISubtitle {
  id: string;
  title: string;
  is_ready: boolean;
  model: string;
  updated_at: string;
}
function Dashboard() {
  const [subtitles, setSubtitles] = React.useState<ISubtitle[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetchAllSubtitles() {
      setIsLoading(true);
      const response = await axGetAllTranscriptions();
      setSubtitles(response.data);
      setIsLoading(false);
    }
    fetchAllSubtitles();
  }, []);

  const toLocaleString = (isoDateString: string) => {
    // change to 12 hour format

    const date = new Date(isoDateString);
    return date.toLocaleString(undefined, {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const Icon = (props: { state: any }) => {
    const { state } = props;
    return (
      <div className="flex items-center gap-2">
        <div className="bg-slate-100 dark:bg-slate-700 flex justify-center items-center rounded">
          <svg height="16" width="16">
            <circle
              r="4"
              cx="8"
              cy="8"
              fill={state === "Completed" ? "#16a34a" : "#facc15"}
            />
          </svg>
        </div>
        <p>{state}</p>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl text-center font-semibold m-4 ">Dashboard</h1>
      {isLoading ? (
        <p className="text-center">Fetching data...</p>
      ) : (
        <>
          <Table className="mb-12 bg-background">
            <TableCaption>
              A list of your recent video to srt conversions.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subtitles?.map((sub) => (
                <TableRow key={sub?.id}>
                  <TableCell>
                    <Link
                      href={`/editor/${sub?.id}`}
                      className="hover:text-primary flex gap-1 items-center"
                    >
                      <span>
                        <ExternalLinkIcon />
                      </span>
                      {sub?.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {sub?.is_ready ? (
                      <Icon state={"Completed"} />
                    ) : (
                      <Icon state={"Processing"} />
                    )}
                  </TableCell>
                  <TableCell>{sub?.model || "N/A"}</TableCell>
                  <TableCell>{toLocaleString(sub?.updated_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

export default Dashboard;
