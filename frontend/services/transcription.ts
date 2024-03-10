import axios, { AxiosProgressEvent } from "axios";

export const axGetTranscription = async (videoId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transcription/${videoId}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const axGetAllTranscriptions = async () => {
  try {
    const response = await axios.get(
      `${process.env.BACKEND_URL}/transcription/`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const axVideoToTranscription = async (
  video: File,
  onUploadProgressCallback: (progressEvent: ProgressEvent) => void
) => {
  try {
    const formData = new FormData();
    formData.append("video", video);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transcription/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onUploadProgressCallback,
      }
    );
    console.log("response inside: ", response);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const axUpdateTranscription = async (
  videoId: string,
  data: { subtitles: string }
) => {
  try {
    const response = await axios.put(
      `${process.env.BACKEND_URL}/transcription/${videoId}/`,
      data
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
