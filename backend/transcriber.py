from datetime import timedelta
import os
import whisper


def transcribe_audio(path, output_dir="/content"):
    model = whisper.load_model("base")  # Change this to your desired model
    print("Whisper model loaded.")
    transcribe = model.transcribe(audio=path)
    segments = transcribe["segments"]
    srtFilename = os.path.join(output_dir, os.path.basename(path) + ".srt")

    with open(srtFilename, "w", encoding="utf-8") as srtFile:
        for segment in segments:
            startTime = str(0) + str(timedelta(seconds=int(segment["start"]))) + ",000"
            endTime = str(0) + str(timedelta(seconds=int(segment["end"]))) + ",000"
            text = segment["text"]
            segmentId = segment["id"] + 1
            segmentText = f"{segmentId}\n{startTime} --> {endTime}\n{text[1:] if text.startswith(' ') else text}\n\n"
            srtFile.write(segmentText)
    return srtFilename
