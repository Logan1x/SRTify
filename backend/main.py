from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from transcriber import transcribe_audio
import os
import subprocess

app = FastAPI()


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Whisper Transcriber API!"}


@app.get("/ping/")
async def ping():
    return {"message": "pong!"}


@app.post("/process-video/")
async def process_video(video: UploadFile = File(...)):
    # Save uploaded video to a temporary file
    temp_video_path = f"temp/{video.filename}"
    with open(temp_video_path, "wb") as buffer:
        content = await video.read()
        buffer.write(content)

    # Ensure the output directory exists
    output_dir = "output_srt"
    os.makedirs(output_dir, exist_ok=True)

    # Use the transcribe function
    srt_file_path = transcribe_audio(temp_video_path, output_dir)

    # Merge the video with its SRT file
    output_video_path = merge_video_srt(temp_video_path, srt_file_path, output_dir)

    # Cleanup: Remove the temporary video and SRT files after processing
    os.remove(temp_video_path)
    os.remove(srt_file_path)

    # Return the processed video with captions as a response
    return FileResponse(
        path=output_video_path,
        filename=os.path.basename(output_video_path),
        media_type="video/mp4",
    )


def merge_video_srt(video_path, srt_path, output_dir):
    output_video_path = os.path.join(
        output_dir,
        os.path.splitext(os.path.basename(video_path))[0] + "_with_captions.mp4",
    )
    ffmpeg_command = [
        "ffmpeg",
        "-i",
        video_path,
        "-vf",
        f"subtitles={srt_path}",
        "-c:a",
        "copy",
        output_video_path,
    ]
    subprocess.run(ffmpeg_command, capture_output=True)
    return output_video_path
