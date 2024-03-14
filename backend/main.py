from fastapi import FastAPI, File, UploadFile, Response, BackgroundTasks, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from transcriber import transcribe_audio
import os
import subprocess
from datetime import datetime
from pydantic import BaseModel
from config.supabase import supabase


app = FastAPI()


# Define a list of origins that should be permitted to make cross-origin requests
# You can use "*" to allow all origins
origins = [
    "*",
    "http://localhost:3000",  # Adjust this to include the frontend origin
    "http://localhost:3001",
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


# define a model for the transcription update request
class TranscriptionUpdate(BaseModel):
    subs: str


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Whisper Transcriber API!"}


@app.get("/ping/")
async def ping():
    return {"message": "pong!"}


@app.get("/transcription/")
async def get_transcriptions():
    try:
        videos = (
            supabase.table("videos")
            .select("*")
            .order("updated_at", desc=True)
            .execute()
        )
        return videos
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/transcription/{video_id}/")
async def get_transcription(video_id: str):
    try:
        video = supabase.table("videos").select("*").eq("id", video_id).execute()
        return video
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/transcription/")
async def transcribe_audio_from_video(
    *,
    video: UploadFile = File(...),
    model: str = Form(...),
    background_tasks: BackgroundTasks,
):
    try:
        # Save uploaded video to a temporary file
        temp_dir = "temp"
        os.makedirs(temp_dir, exist_ok=True)

        temp_video_path = f"temp/{video.filename}"
        with open(temp_video_path, "wb") as buffer:
            content = await video.read()
            buffer.write(content)

        # Insert the video into the database
        data, count = (
            supabase.table("videos")
            .insert(
                {
                    "title": video.filename,
                    "is_ready": False,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat(),
                    "model": model,
                }
            )
            .execute()
        )

        # Destructuring data tuple to extract id
        (_, [video_data]) = data
        video_id = video_data["id"]

        # Use the transcribe function
        srt_content = background_tasks.add_task(
            transcribe_audio, temp_video_path, video_id, model
        )

        # Return the SRT file as a response
        return {"video_id": video_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/transcription/{video_id}/")
async def update_transcription(
    video_id: str, transcription_update: TranscriptionUpdate
):
    try:
        srt_content = transcription_update.subs
        updated_data, count = (
            supabase.table("videos")
            .update({"subs": srt_content, "updated_at": datetime.now().isoformat()})
            .eq("id", video_id)
            .execute()
        )
        return updated_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
