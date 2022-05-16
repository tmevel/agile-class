import requests
import os
import smtplib
import ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

#raspberrypi.MotionAgile@gmail.com
#Agileproject
#data contains all relevant data to the main message or imbedded directly in html (depends on how testing goes once we have actual data) and agree on specific email content
def send_mail(customer_email, camera_id, host, screenshot):
    current_time = datetime.now().strftime("%H:%M:%S")
    attachment = open(screenshot,'rb')

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
    msg['Subject'] = "Motion detected on camera "+str(camera_id)
    html = """\
            <html>
            <body>
                <p><b>Motion detected at {} </b><br>
                <br>
                 <a href="{}">View more details</a> 
                </p>
            </body>
            </html>
            """.format(current_time,"http://"+host+":4200") #List containing time, link to the website containing all the info on the picture
    text = MIMEText(html, "html")
    msg.attach(text)

    obj = MIMEBase('application','octet-stream')
    obj.set_payload((attachment).read())
    encoders.encode_base64(obj)
    obj.add_header('Content-Disposition',"attachment; filename= "+screenshot)
    msg.attach(obj)
    

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login("raspberrypi.MotionAgile@gmail.com", "Agileproject")
        server.sendmail(
            "raspberrypi.MotionAgile@gmail.com", customer_email, msg.as_string()
        )
        