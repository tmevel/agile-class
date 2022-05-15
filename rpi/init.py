from streaming import run_stream_service
from motion_detection import run_motion_detection
from time import sleep
import threading


#host = "195.14.189.82"
host = "localhost"
camera_id = 0
camera_name = "test"
customer_email = "thomas.mevel@insa-rennes.fr"

t1 = threading.Thread(target=run_stream_service, args=(camera_id,host,))
t1.start()

sleep(5)

t2 = threading.Thread(target=run_motion_detection, args=(camera_id,host,customer_email))
t2.start()
