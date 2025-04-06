import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import DarkModeToggle from "./components/ui/darkmode";
import Preview from "./components/previewComponent";
import { useTheme } from "./components/theme-provider";
import { useToast } from "./hooks/use-toast";
import { ToastAction } from "./components/ui/toast";

function App() {
    const { theme } = useTheme();
    const { toast } = useToast();
    const [file, setFiles] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(
        "https://flexembed.doctorthe113.com/files/",
    );

    // copies the link to the clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            toast({
                title: "Failed to copy",
                variant: "destructive",
                description: "Your link couldn't be copied to the clipboard",
                action: (
                    <ToastAction altText="Done">
                        Okay
                    </ToastAction>
                ),
            });
        }
    };

    // processes the video before uploading
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

    // uploads the file to the server
    const handleSubmit = async (e) => {
        e.preventDefault();

        // starts sending the file
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
                copyToClipboard(resJson.preview);
                toast({
                    title: "Successfully uploaded",
                    description:
                        "Your file has been uploaded and link has been copied to the clipboard ",
                    action: (
                        <ToastAction altText="Done">
                            Okay
                        </ToastAction>
                    ),
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Upload Failed",
                variant: "destructive",
                description:
                    "Your file couldn't be uploaded, please try again later",
                action: (
                    <ToastAction altText="Done">
                        Okay
                    </ToastAction>
                ),
            });
        }
    };

    return (
        <main className="h-screen w-screen flex justify-start items-center flex-col bg-bg">
            <div className="h-14 max-w-[480px] w-full flex justify-between px-2 py-1 bg-main border-2 border-border rounded-b-base shadow-shadow">
                <h1 className="text-2xl font-bold text-black flex items-center">
                    flexEmbed
                </h1>
                <DarkModeToggle />
            </div>
            <div className="grow flex flex-col justify-center">
                <Card className="max-w-[480px] flex flex-col items-center justify-center pt-2">
                    <p className="m-2">
                        <strong className="font-bold">
                            flexEmbed
                        </strong>{" "}
                        is for users to embed large images and videos upto 2GB
                        on discord and other platforms. Due to storage
                        restrictions, the files will be deleted after 7 days.
                        Consider supporting to change that and help me with
                        other projects :D
                    </p>
                    <div className="min-h-[300px] p-2 w-full flex flex-col ">
                        {
                            /* <form
                            onSubmit={handleSubmit}
                            className="flex flex-col items-center justify-center grow"
                        > */
                        }
                        <Preview
                            file={file}
                            isVideo={isVideo}
                            handleFileChange={handleFileChange}
                        />
                        <div className="w-full flex justify-evenly">
                            <Button
                                variant="default"
                                id="upload-button"
                                className="!bg-purple m-1 grow"
                                onClick={() => {
                                    setFiles(null);
                                    setIsVideo(false);
                                }}
                            >
                                <span>Clear</span>
                            </Button>
                            <Button
                                variant="default"
                                id="upload-button"
                                className="!bg-purple m-1 grow"
                                onClick={handleSubmit}
                            >
                                <span>Upload</span>
                            </Button>
                        </div>
                        {/* </form> */}
                        <p className="w-full text-left text-white mt-2 bg-secondary-black rounded-base border-2 border-border px-2">
                            Preview link:{" "}
                            <a
                                className="text-purple italic"
                                href={previewUrl}
                                target="_blank"
                            >
                                {previewUrl}
                            </a>
                        </p>
                    </div>
                </Card>
            </div>
        </main>
    );
}

export default App;
