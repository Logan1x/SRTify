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
    <div className="container mx-auto p-4">
      <h1
        className="text-3xl font-semibold
      text-gray-800 mb-4"
      >
        Transcribe Video
      </h1>
      {isLoading ? (
        <p className="text-sm text-gray-500">{progressMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Video
          </label>
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
          {videoFile && (
            <p className="text-sm text-gray-500">{videoFile.name}</p>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload
          </button>
        </form>
      )}
    </div>
  );
};

export default Transcribe;
