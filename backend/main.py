from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper
import shutil
import os

# Explicitly add Winget's ffmpeg installation to the PATH
ffmpeg_path = r"C:\Users\Ranvijay\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin"
if ffmpeg_path not in os.environ.get("PATH", ""):
    os.environ["PATH"] += os.pathsep + ffmpeg_path

app = FastAPI(title="AI Interview Backend")

# Allow CORS for the frontend React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (adjust in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the whisper model once on startup
print("Loading Whisper Model...")
model = whisper.load_model("base")
print("Model loaded successfully.")

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Accepts an audio file via POST, saves it temporarily, 
    transcribes it using OpenAI Whisper, and returns the text.
    """
    temp_file_path = f"temp_{audio.filename}"
    
    # Save the uploaded file temporarily
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    try:
        # Transcribe the audio
        print(f"Transcribing {temp_file_path}...")
        result = model.transcribe(temp_file_path)
        transcript = result.get("text", "").strip()
        print("Transcription complete.")
        
        return {"text": transcript}
    except Exception as e:
        print(f"Error during transcription: {e}")
        return {"error": str(e)}
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.get("/")
def read_root():
    return {"message": "AI Interview Backend is running."}
