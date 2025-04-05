import { useTheme } from "../theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

export default function DarkModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <Button
            variant="default"
            className={theme === "dark" ? "bg-green" : "bg-yellow"}
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? <Moon /> : <Sun />}
        </Button>
    );
}
