import requests

url = 'http://localhost:3000/upload'

with open('test.mp4', 'rb') as f: r = requests.post(url, files={'test.mp4': f})