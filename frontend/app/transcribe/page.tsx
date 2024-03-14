"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { axVideoToTranscription } from "@/services/transcription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

type VideoFile = File | null;

const Transcribe: React.FC = () => {
  const [videoFile, setVideoFile] = useState<VideoFile>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [selectedModel, setSelectedModel] = React.useState("base");
  const router = useRouter();
  const { toast } = useToast();

  const variants = {
    hidden: { opacity: 0, scale: 0.6 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if files are selected and set the first file
    const file = event.target.files ? event.target.files[0] : null;
    setVideoFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!videoFile) {
        alert("Please select a file first.");
        return;
      }
      setIsLoading(true);
      setProgressMessage(`Uploading ${videoFile.name}...`);
      const { video_id: videoId } = await axVideoToTranscription(
        videoFile,
        selectedModel
      );
      setIsLoading(false);
      if (videoId) {
        toast({
          variant: "success",
          title: "Video uploaded 🥳",
          description:
            "Your video is currently being transformed into a masterpiece. Keep an eye on the dashboard—a fresh update is just a page refresh away. 🌟",
        });
        router.push(`/dashboard`);
      } else {
        alert("Error processing file. Please try again.");
      }
    } catch (error) {
      alert(`Error uploading file: ${error}. Please try again.`);
      toast({
        variant: "destructive",
        title: "Error Uploading file",
        description: `${error}. Please try again.`,
      });
    }
  };

  const SelectModel = () => {
    return (
      <DropdownMenu>
        <Label>Select Model</Label>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-1 w-max">
            {selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            <DropdownMenuRadioItem value="tiny">Tiny</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="base">Base</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="small">Small</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="large">Large</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="large-v2">
              Large-V2
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="large-v3">
              Large-V3
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <motion.div
      className="p-4 flex flex-col items-center"
      initial="hidden"
      animate="show"
      variants={variants}
    >
      <h1 className="text-3xl text-center font-semibold mb-4">
        Transcribe Video
      </h1>
      <section className="w-auto flex justify-center border p-4 lg:p-24 rounded shadow-md bg-background hover:shadow-lg dark:shadow-slate-900 dark:hover:shadow-slate-800">
        {isLoading ? (
          <section className="flex flex-col gap-2 items-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 text-gray-200 animate-spin dark:text-primary fill-primary"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-lg text-pretty text-card-foreground">
              {progressMessage}
            </p>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <label className="block text-sm font-medium">Choose Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-primary/15 file:text-primary
          hover:file:bg-primary/30 cursor-pointer"
              required
            />

            <SelectModel />

            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-primary hover:bg-primary/90 hover:text-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/90 transition duration-300 ease-in-out text-white"
            >
              Upload
            </button>
          </form>
        )}
      </section>
    </motion.div>
  );
};

export default Transcribe;
