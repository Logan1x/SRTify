"use client";

import { axGetTranscription } from "@/services/transcription";
import React, { useEffect } from "react";

export default function Editor({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [subtitles, setSubtitles] = React.useState<string | null>(null);

  useEffect(() => {
    async function fetchSubtitles() {
      const response = await axGetTranscription(slug);
      const data = response.data;
      console.log("subs data", data);
      setSubtitles(data[0].subs);
    }
    fetchSubtitles();
  }, []);

  return (
    <>
      <div>My Post: {slug}</div>
      <div className="container mx-auto p-4">
        <form action="" className="flex flex-col items-center">
          <textarea
            name=""
            id=""
            value={subtitles || ""}
            onChange={(e) => setSubtitles(e.target.value)}
            className="text-black w-4/5 h-96 p-4 m-6 border-2 border-gray-300 rounded-md"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold rounded-md p-2"
          >
            Update Subtitles
          </button>
        </form>
      </div>
    </>
  );
}
