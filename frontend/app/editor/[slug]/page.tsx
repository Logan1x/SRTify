"use client";

import { Button } from "@/components/ui/button";
import {
  axGetTranscription,
  axUpdateTranscription,
} from "@/services/transcription";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function Editor({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [subtitles, setSubtitles] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSubtitles() {
      setIsLoading(true);
      const response = await axGetTranscription(slug);
      const data = response.data;
      setSubtitles(data[0].subs);
      if (data[0].is_ready === false) {
        setIsProcessing(true);
      }
      setIsLoading(false);
    }
    fetchSubtitles();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      if (!subtitles) return;
      const response = await axUpdateTranscription(slug, subtitles);
      setIsLoading(false);
      if (response) {
        router.push(`/dashboard`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    if (subtitles) {
      const element = document.createElement("a");
      const file = new Blob([subtitles], { type: "text/srt" });
      element.href = URL.createObjectURL(file);
      element.download = "subtitles.srt";
      document.body.appendChild(element);
      element.click();
    }
  };

  const ButtonGroup: React.FC = ({ children }) => {
    return <div className="flex gap-2 items-center">{children}</div>;
  };

  return (
    <section className="flex w-full">
      <div className="flex flex-col w-3/5">
        <h1 className="text-3xl text-center font-semibold mb-4">
          Edit Subtitles
        </h1>
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : isProcessing ? (
          <div className="flex items-center justify-center">
            <Alert variant={"warn"} className="w-fit flex gap-2">
              <div className="text-amber-600">
                <ExclamationTriangleIcon />
              </div>
              <div className="flex flex-col">
                <AlertTitle>Still Processing!</AlertTitle>
                <AlertDescription>
                  Your video is still processing, come back to same link later.
                </AlertDescription>
              </div>
            </Alert>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center ">
            <textarea
              name=""
              id=""
              value={subtitles || ""}
              onChange={(e) => setSubtitles(e.target.value)}
              className="w-4/5 h-96 p-4 m-6 border-2 border-gray-300 rounded-md bg-muted"
            ></textarea>
            <ButtonGroup>
              <Button type="submit">Update Subtitles</Button>
              <Button type="button" onClick={handleDownload} variant="outline">
                Download Subtitles
              </Button>
            </ButtonGroup>
          </form>
        )}
      </div>
      <div className="flex flex-col w-2/5 items-center">
        <h1 className="text-3xl text-center font-semibold mb-4">
          Preview Subtitles
        </h1>
        <div className="w-4/5 h-96 p-4 m-6 border-2 border-gray-300 rounded-md bg-muted">
          {subtitles}
        </div>
      </div>
    </section>
  );
}
