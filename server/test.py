import os
import time


def remove_old_files() -> None:
    files = os.listdir("media")
    threeDayOld = int(time.time() - 3 * 24 * 3600)
    for file in files:
        fileMetaTime = int((os.path.getmtime("media/" + file)))
        if fileMetaTime < threeDayOld:
            os.remove("media/" + file)
            print(f"Removed {file}")


remove_old_files()
