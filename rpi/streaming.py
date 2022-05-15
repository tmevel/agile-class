import subprocess
import requests
import os
from time import sleep


def run_stream_service(camera_id, host):

    ffmpeg = None

    while(True):
        ret = requests.get('http://'+host+':3000/api/keepAlive?id='+str(camera_id))

        status = 'OFF'
        try:
            status = requests.get('http://'+host+':3000/api/liveStatus?id='+str(camera_id)).json()['status']['status']
        except:
            print('error: cannot get live status from backend')

        
        if(status == 'ON' and ffmpeg is None):
            try:
                print('start...')
                ffmpeg = subprocess.Popen("ffmpeg -loglevel panic -re -i /dev/video0 -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -pix_fmt yuv420p -f flv rtmp://"+host+"/live/"+str(camera_id), shell = True)
            except:
                print('cannot start ffmpeg')
        elif(status == 'OFF' and ffmpeg is not None):
            try:
                print('stop...')
                os.system('killall ffmpeg')
                ffmpeg = None
            except Exception as e:
                print('cannot stop ffmpeg')


        sleep(1)