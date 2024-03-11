"use client";

import { Button } from "@/components/ui/button";
import {
  axGetTranscription,
  axUpdateTranscription,
} from "@/services/transcription";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Link from "next/link";
import ReactPlayer from "react-player";

export default function Editor({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [subtitles, setSubtitles] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [url, setUrl] = useState("");
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
    return <div className="flex gap-2 items-center mt-4">{children}</div>;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setUrl(url);
  };

  return (
    <>
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : isProcessing ? (
        <div className="flex flex-col items-center justify-center mt-6">
          <Alert variant={"warn"} className="w-max flex gap-2">
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
          <div className="flex gap-2 items-center mt-4">
            <Button variant={"outline"}>
              <a href={`/editor/${slug}`}>Refresh</a>
            </Button>
            <Button>
              <Link href={`/dashboard`}>Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="w-3/5">
            <div className="flex flex-col p-4">
              <h1 className="text-3xl text-center font-semibold m-4">
                Edit Subtitles
              </h1>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center px-4 w-full gap-4"
              >
                <textarea
                  name=""
                  id=""
                  value={subtitles || ""}
                  onChange={(e) => setSubtitles(e.target.value)}
                  className="w-full h-96 p-4 border-2 border-gray-300 dark:border-0 rounded-md bg-muted"
                ></textarea>
                <ButtonGroup>
                  <Button type="submit">Update Subtitles</Button>
                  <Button
                    type="button"
                    onClick={handleDownload}
                    variant="outline"
                  >
                    Download Subtitles
                  </Button>
                </ButtonGroup>
              </form>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="w-2/5">
            <div className="flex flex-col  items-center p-4">
              <h1 className="text-3xl text-center font-semibold m-4">
                Preview Subtitles
              </h1>
              <input type="file" accept="video/*" onChange={handleFileChange} />
              {url && (
                <div className="m-4 p-4">
                  <ReactPlayer
                    url={url}
                    controls
                    config={{
                      file: {
                        tracks: [
                          {
                            kind: "subtitles",
                            src: subtitles
                              ? URL.createObjectURL(
                                  new Blob([subtitles], { type: "text/vtt" })
                                )
                              : "",
                            srcLang: "hi",
                            label: "Hindi",
                            mode: "showing",
                          },
                        ],
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
}
