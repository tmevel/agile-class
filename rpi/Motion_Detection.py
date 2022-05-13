import cv2
import subprocess
import requests
import os
from time import sleep

#host = "localhost"
host = "195.14.189.82"

upload_url = 'http://'+host+':3000/upload'




def filmAndSend():
    print("start 30s video capture")
    try:
        os.system('killall ffmpeg')
        ffmpeg = subprocess.Popen("ffmpeg -re -i /dev/video0 -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -pix_fmt yuv420p -f mp4 out.mp4", shell = True)
        sleep(10)
        os.system('killall ffmpeg')
        with open('out.mp4', 'rb') as f: r = requests.post(upload_url, files={'out.mp4': f})
    except Exception as e:
        print(e)

    


# capturing video/ (0) means source is from local camera
capture = cv2.VideoCapture(0)

"""
For a camera deployed on a server,
we can use the IP from which we can access the video stream

camera_ip = "username:password@IP/port"
stream = cv2.VideoCapture(camera_ip)
"""

while capture.isOpened():
    # to read frame by frame
    _, img_1 = capture.read()
    _, img_2 = capture.read()

    # find difference between two frames
    diff = cv2.absdiff(img_1, img_2)

    # to convert the frame to grayscale
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)

    # apply some blur to smoothen the frame
    diff_blur = cv2.GaussianBlur(diff_gray, (5, 5), 0)

    # to get the binary image
    _, thresh_bin = cv2.threshold(diff_blur, 20, 255, cv2.THRESH_BINARY)

    # to find contours
    contours, hierarchy = cv2.findContours(thresh_bin, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    # to draw the bounding box when the motion is detected
    if len(contours)>0:
        filmAndSend()
