import subprocess
import requests
import os
from sqlalchemy import create_engine, text
import smtplib
import ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from time import sleep

#host = "localhost"
host = "195.14.189.82"


def runLiveStreamService():
    ffmpeg = None
    try:
        liveNumber = requests.get('http://'+host+':3000/api/createLive').json()['status']
    except:
        print('error: cannot create a live')

    while(True):
        status = 'OFF'
        try:
            status = requests.get('http://'+host+':3000/api/liveStatus?id='+str(liveNumber)).json()['status']
        except:
            print('error: cannot get live status from backend')
        
        if(status == 'ON' and ffmpeg is None):
            try:
                print('start...')
                ffmpeg = subprocess.Popen("ffmpeg -re -i /dev/video0 -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -pix_fmt yuv420p -f flv rtmp://"+host+"/live/"+str(liveNumber), shell = True)
            except:
                print('cannot run ffmpeg')
        elif(status == 'OFF' and ffmpeg is not None):
            try:
                print('stop...')
                os.system('killall ffmpeg')
                ffmpeg = None
            except Exception as e:
                print('cannot stop ffmpeg')

        sleep(1)

runLiveStreamService()