import cv2
import subprocess
import requests
import os
from time import sleep
from time import time
import numpy as np
from mailing import send_mail


def filmAndSend(capture, camera_id, host, customer_email):

    ret, frame = capture.read()
    cv2.imwrite('picture.jpg',frame)


    frame_width = int(capture.get(3))
    frame_height = int(capture.get(4))

    size = (frame_width, frame_height)

    result = cv2.VideoWriter('out.avi', cv2.VideoWriter_fourcc(*'MJPG'), 10, size)

    begin = time()

    while(time()<begin+15):
        ret, frame = capture.read()

        if ret == True:
            result.write(frame)

        if cv2.waitKey(100) == 13:
            exit()
    
    result.release()

    upload_url = 'http://'+host+':3000/upload?id='+str(camera_id)
    try:
        with open('out.avi', 'rb') as f: r = requests.post(upload_url, files={'out.avi': f})
        print("video uploaded")
    except Exception as e:
        print(e)
    send_mail(customer_email, camera_id, host, "picture.jpg")
    print("mail sent")

    
def run_motion_detection(camera_id, host, customer_email):
    # capturing video stream

    while True:
        try:

            capture = cv2.VideoCapture("rtmp://"+host+":1935/live/"+str(camera_id))

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

                motion_detected = False

                for contour in contours:
                    x, y, w, h = cv2.boundingRect(contour)
                    if cv2.contourArea(contour) > 300:
                        motion_detected = True
                        cv2.rectangle(img_1, (x, y), (x+w, y+h), (0, 255, 0), 2)
                        # cv2.drawContours(img_1, contours, -1, (0, 255, 0), 2)

                # display the output
                #cv2.imshow("Detecting Motion...", img_1)

                if motion_detected:
                    print("motion detected")
                    filmAndSend(capture, camera_id, host, customer_email)

                if cv2.waitKey(100) == 13:
                    exit()
        except:
            print("stream closed")
            sleep(5)