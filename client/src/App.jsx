import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
    const [file, setFiles] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(
        "https://flexembed.doctorthe113.com/files/",
    );

    const handleFileChange = (e) => {
        const prevFilename = e.target.files[0].name;
        const rename = uuidv4();
        const fileExt = prevFilename.split(".").pop();
        const newFile = new File([e.target.files[0]], rename + "." + fileExt, {
            type: e.target.files[0].type,
        });
        setFiles(newFile);

        if (fileExt === "mp4" || fileExt === "mov" || fileExt === "webm") {
            setIsVideo(true);
        } else {
            setIsVideo(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("submitted");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(
                "https://flexembed.doctorthe113.com/upload/",
                {
                    method: "POST",
                    body: formData,
                },
            );

            if (res.status === 200) {
                const resJson = await res.json();
                setPreviewUrl(resJson.preview);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="h-screen w-screen bg-slate-900 flex justify-center items-center flex-col text-amber-100 bg-grad">
            <div className="h-9 w-screen max-w-[480px] p-2">
                <div className="bg-slate-800 text-center rounded-lg text-blue-100 font-bold">
                    flexEmbed
                </div>
            </div>
            <div className="grow flex flex-col justify-center">
                <div className="max-w-[480px] flex flex-col items-center justify-center bg-slate-900 rounded-lg pt-2 border-[1px]">
                    <p className="my-1">
                        <strong className="text-blue-200">flexEmbed</strong>
                        {" "}
                        is for users to embed large images and videos upto 2GB
                        on discord and other platforms. Due to storage
                        restrictions, the files will be deleted after 7 days.
                    </p>
                    <div className="min-h-[300px] bg-slate-950 p-2 w-full rounded-b-lg pb-2 flex flex-col ">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col items-center justify-center grow"
                        >
                            {!file
                                ? (
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="grow cursor-pointer w-full text-center"
                                    />
                                )
                                : (
                                    isVideo
                                        ? (
                                            <video
                                                src={URL.createObjectURL(file)}
                                            >
                                            </video>
                                        )
                                        : (
                                            <img
                                                src={URL.createObjectURL(file)}
                                            />
                                        )
                                )}

                            <button
                                type="submit"
                                className="w-full bg-slate-900 rounded-md h-7 mt-2 border-[1px] cursor-pointer"
                            >
                                Upload
                            </button>
                        </form>
                        <p className="w-full text-left italic mt-2">
                            Preview link:{" "}
                            <a
                                className="text-blue-100"
                                href={previewUrl}
                                target="_blank"
                            >
                                {previewUrl}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;
