from datetime import datetime, timedelta
import os
import whisper
from config.supabase import supabase


def transcribe_audio(path, video_id, model_name="base"):
    model = whisper.load_model("large")  # Change this to your desired model
    transcribe = model.transcribe(audio=path)
    segments = transcribe["segments"]
    srtContent = ""

    for segment in segments:
        startTime = str(0) + str(timedelta(seconds=int(segment["start"]))) + ",000"
        endTime = str(0) + str(timedelta(seconds=int(segment["end"]))) + ",000"
        text = segment["text"]
        segmentId = segment["id"] + 1
        segmentText = f"{segmentId}\n{startTime} --> {endTime}\n{text[1:] if text.startswith(' ') else text}\n\n"
        srtContent += segmentText

    os.remove(path)
    updated_data, count = (
        supabase.table("videos")
        .update(
            {
                "is_ready": True,
                "subs": srtContent,
                "updated_at": datetime.now().isoformat(),
            }
        )
        .eq("id", video_id)
        .execute()
    )
    return True
