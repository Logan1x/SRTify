"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../store";

type VideoFile = File | null;

const Transcribe: React.FC = () => {
  const [videoFile, setVideoFile] = useState<VideoFile>(null);
  const router = useRouter();
  const { updateSubs } = useStore();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if files are selected and set the first file
    const file = event.target.files ? event.target.files[0] : null;
    setVideoFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoFile) {
      alert("Please select a file first.");
      return;
    }

    console.log("Uploading:", videoFile.name);

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/transcription/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            const intervals = [10, 20, 50, 70, 100]; // Define the progress intervals you want
            for (let i = intervals.length - 1; i >= 0; i--) {
              if (progress >= intervals[i]) {
                console.log(`Upload Progress: ${intervals[i]}%`);
                // You can update a progress bar or do other actions based on the progress
                break; // Exit the loop once the highest interval is reached
              }
            }
          },
          // responseType: "text/plain",
        }
      );
      console.log(response.data);
      updateSubs(response.data);

      router.push("/editor");
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
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
        {videoFile && <p className="text-sm text-gray-500">{videoFile.name}</p>}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default Transcribe;
