"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "../../store";

const Editor: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const { receivedSubs } = useStore();

  console.log("receivedSubs", receivedSubs);

  useEffect(() => {
    if (receivedSubs) {
      setData(receivedSubs);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <form action="" className="flex flex-col items-center">
        <textarea
          name=""
          id=""
          value={data || ""}
          onChange={(e) => setData(e.target.value)}
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
  );
};

export default Editor;
