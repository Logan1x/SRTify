"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { axVideoToTranscription } from "@/services/transcription";

type VideoFile = File | null;

const Transcribe: React.FC = () => {
  const [videoFile, setVideoFile] = useState<VideoFile>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if files are selected and set the first file
    const file = event.target.files ? event.target.files[0] : null;
    setVideoFile(file);
  };

  const onUploadProgress = (progressEvent: ProgressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded / (progressEvent.total ?? 0)) * 100
    );
    progress === 100 && setProgressMessage("Generating subtitles...");
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
        onUploadProgress
      );
      setIsLoading(false);
      if (videoId) {
        router.push(`/editor/${videoId}`);
      } else {
        alert("Error processing file. Please try again.");
      }
    } catch (error) {
      alert(`Error uploading file: ${error}. Please try again.`);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl text-center font-semibold mb-4">
        Transcribe Video
      </h1>
      <section className="w-auto lg:w-2/5 flex justify-center border p-4 lg:p-24 rounded shadow-md hover:shadow-lg dark:shadow-slate-900 dark:hover:shadow-slate-800">
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
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
            />

            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-primary hover:bg-primary/90 hover:text-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/90 transition duration-300 ease-in-out text-white"
            >
              Upload
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Transcribe;
