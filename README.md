# agile-class

## installation

### backend
```
cd backend
npm install
```

### frontend
```
cd frontend
npm install
```

### camera
```
cd rpi
pip3 install -r requirements.txt
```


## config

### camera
edit host, camera_id and customer_email in rpi/init.py

### frontend
change hostname in frontend/index.js

## usage

### backend
```
cd backend
node streaming-server.js
```
```
cd backend
node index.js
```

### frontend
```
cd frontend
npm run start
```

### camera
```
cd rpi
python3 init.py
```