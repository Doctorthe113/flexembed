import requests

response = requests.post(
    "https://flexembed.doctorthe113.com/upload/",
    files={"file": open("./dada.webm", "rb")},
)
print(response.json())
