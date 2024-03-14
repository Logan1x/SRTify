import axios, { AxiosProgressEvent } from "axios";

export const axGetTranscription = async (videoId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transcription/${videoId}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const axGetAllTranscriptions = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transcription/`
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const axVideoToTranscription = async (
  video: File,
  selectedModel: string
) => {
  try {
    const formData = new FormData();
    formData.append("video", video);
    formData.append("model", selectedModel);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transcription/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const axUpdateTranscription = async (
  videoId: string,
  subs: string | null
) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transcription/${videoId}/`,
      {
        subs: subs,
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};
