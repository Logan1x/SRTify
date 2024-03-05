from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from transcriber import transcribe_audio, merge_video_srt
import os
import subprocess

from pymongo import MongoClient


app = FastAPI()


# mongo db connection
client = MongoClient("mongodb://localhost:27017/")
db = client["srtify"]
videos = db["videos"]

# Define a list of origins that should be permitted to make cross-origin requests
# You can use "*" to allow all origins
origins = [
    "http://localhost:3000",  # Adjust this to include the frontend origin
    "http://localhost:8000",  # Include additional origins as needed
]

# Add CORSMiddleware to the application instance
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of origins that are allowed to make requests
    allow_credentials=True,  # Whether to support cookies in cross-origin requests
    allow_methods=["*"],  # Which HTTP methods to allow
    allow_headers=["*"],  # Which HTTP headers can be included in requests
)


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

    print("video saved to temp file")
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


@app.post("/transcribe/")
async def transcribe_audio_from_video(video: UploadFile = File(...)):
    # Save uploaded video to a temporary file
    temp_video_path = f"temp/{video.filename}"
    with open(temp_video_path, "wb") as buffer:
        content = await video.read()
        buffer.write(content)

    # Ensure the output directory exists
    output_dir = "output_srt"
    os.makedirs(output_dir, exist_ok=True)

    # give resp at this stage
    video_id = videos.insert_one(
        {"video_name": video.filename, "status": "processing"}
    ).inserted_id

    # Use the transcribe function
    srt_file_path = transcribe_audio(temp_video_path, output_dir)

    # Cleanup: Remove the temporary video file after processing
    os.remove(temp_video_path)

    videos.update_one(
        {"_id": video_id}, {"$set": {"srt_content": srt_file_path, "status": "done"}}
    )

    # Return the SRT file as a response
    return FileResponse(
        path=srt_file_path,
        filename=os.path.basename(srt_file_path),
        media_type="text/srt",
    )
