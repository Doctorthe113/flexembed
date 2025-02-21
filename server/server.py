from typing import Generator
from fastapi import FastAPI, UploadFile, HTTPException, Request, File
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import os, time

from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# * Serve the client side =============================================================
app.mount("/home/", StaticFiles(directory="./templates/dist/", html=True))


@app.get("/")
async def root() -> RedirectResponse:
    return RedirectResponse(url="/home/")


# * File upload side ==================================================================
async def remove_old_files() -> None:
    files = os.listdir("media")
    threeDayOld = int(time.time() - 7 * 24 * 3600)

    for file in files:
        fileMetaTime = int((os.path.getmtime("media/" + file)))
        if fileMetaTime < threeDayOld:
            os.remove("media/" + file)
            print(f"Removed {file}")


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)) -> dict[str, str]:
    await remove_old_files()

    # to prevent file uploads over 2 gb
    if file.size > 2 * 1024 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size too large")

    with open("media/" + file.filename, "wb") as fileBuffer:
        while content := await file.read(10 * 1024 * 1024):
            fileBuffer.write(content)
    return {
        "filename": file.filename,
        "preview": "https://flexembed.doctorthe113.com/files/" + file.filename,
    }


# * File serving side =================================================================
def get_byte_range(rangeHeader: str, file_size: int) -> tuple[int, int]:
    byteRange = rangeHeader.replace("bytes=", "").split("-")
    start = int(byteRange[0])
    end = int(byteRange[1]) if byteRange[1] else file_size - 1
    return start, end


def get_stream(videoPath: str, start: int, end: int) -> Generator[bytes, None, None]:
    with open(videoPath, "rb") as video:
        video.seek(start)
        while chunk := video.read(min(10 * 1024 * 1024, end + 1 - start)):
            if not chunk:
                break
            yield chunk


@app.get("/files/{filePath}")
async def serve_file(filePath: str, request: Request) -> StreamingResponse:
    fileName = filePath
    filePath = "media/" + filePath

    if not os.path.exists(filePath):
        raise HTTPException(status_code=404, detail="File not found")

    fileSize = os.path.getsize(filePath)
    start = 0
    end = fileSize - 1

    if rangeHeader := request.headers.get("Range"):
        start, end = get_byte_range(rangeHeader, fileSize)
        contentLength = end - start + 1
        headers = {
            "Content-Disposition": f'inline; filename="{os.path.basename(fileName)}"',
            "Accept-Ranges": "bytes",
            "Content-Length": str(contentLength),
            "Content-Range": f"bytes {start}-{end}/{fileSize}",
        }
        return StreamingResponse(
            get_stream(filePath, start, end),
            headers=headers,
            status_code=206,
        )
    else:
        headers = {
            "Content-Disposition": f'inline; filename="{os.path.basename(fileName)}"',
            "Accept-Ranges": "bytes",
            "Content-Length": str(fileSize),
        }
        return StreamingResponse(
            get_stream(filePath, 0, fileSize - 1),
            headers=headers,
        )
