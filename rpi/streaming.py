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


def runLiveStreamService():
    ffmpeg = None
    while(True):
        status = 'OFF'
        try:
            status = requests.get('http://195.14.189.82:3000/api/liveStatus').json()['status']
        except:
            print('error: cannot get live status from backend')
        
        if(status == 'ON' and ffmpeg is None):
            try:
                print('start...')
                ffmpeg = subprocess.Popen("ffmpeg -re -i /dev/video0 -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -pix_fmt yuv420p -f flv rtmp://195.14.189.82/live/test", shell = True)
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

#dbConnection function in python because it's what we use to do all stream related stuff
# path is port where the db is stored + dbname in the format : host/dbname
def dbconnection(user, password, path):
    engine = create_engine("mysql://" + user + ":" + password + '@' + path)
    return engine

#raspberrypi.MotionAgile@gmail.com
#Agileproject
#data contains all relevant data to the main message or imbedded directly in html (depends on how testing goes once we have actual data) and agree on specific email content
def send_mail(customer_email, subject, data):
    port = 465
    smtp_server = "smtp.gmail.com"
    password = "Agileproject" #in plaintext for now, eventually more secure, store as environment var?
    # msg = MIMEMultipart()
    # msg['From'] = "raspberrypi.MotionAgile@gmail.com"
    # msg['To'] = customer_email
    # msg['Subject'] = subject #contains time of detection with a generic message?
    # html = MIMEText(html)
    msg = MIMEMultipart("alternative")
    msg['From'] = "raspberrypi.MotionAgile@gmail.com"
    msg['To'] = customer_email
    msg['Subject'] = subject #contains time of detection with a generic message?
    html = """\
            <html>
            <body>
                <p><b>Motion detected at {} </b><br>
                <br>
                <img src="{}"/><br>
                 <a href="{}">View more details</a> 
                </p>
            </body>
            </html>
            """.format(data[0],data[1],data[2]) #List containing time, screenshot src, link to the website containing all the info on the picture
    text = MIMEText(html, "html")
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login("raspberrypi.MotionAgile@gmail.com", "Agileproject")
        server.sendmail(
            "raspberrypi.MotionAgile@gmail.com", customer_email, msg.as_string()
        )
        
    
    

runLiveStreamService()