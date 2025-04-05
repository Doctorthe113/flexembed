import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FileVideo } from "lucide-react";

export default function Preview({ file, isVideo, handleFileChange }) {
    if (file == null) {
        return (
            <>
                <Input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    className="text-center"
                    hidden
                />
                <Label
                    htmlFor="file-input"
                    className="grow w-full cursor-pointer bg-bw rounded-base border-2 border-border flex items-center justify-center"
                >
                    <FileVideo color="#88AAEE" size={96} />
                </Label>
            </>
        );
    } else if (isVideo) {
        return (
            <video
                src={URL.createObjectURL(file)}
                controls
                className="w-full h-full rounded-base border-border border-2"
                htmlFor="file-input"
            />
        );
    } else if (!isVideo) {
        return (
            <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full rounded-base border-border border-2"
                htmlFor="file-input"
            />
        );
    }
}
