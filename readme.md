# Future Day Spa

## Setup and Run

```
git clone git@github.com:kylemcdonald/FutureDaySpa.git
cd FutureDaySpa
npm install
node app.js
```

On the main computer, open up two Chrome tabs with the following URLs:

```
http://localhost:8000/server.html?cameraId=1
http://localhost:8000/server.html?cameraId=2
```

The numbers `1` and `2` may be different on a different machine. They could even change if you switch USB ports and restart Chrome. But if you keep things plugged in the same way they should be the same even if you restart Chrome or the computer.

Make sure to click "Allow" for the camera permissions. Alternatively, you can open the tabs by running this command from the Terminal on OSX:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "http://localhost:8000/server.html?cameraId=0" --use-fake-ui-for-media-stream
```

Then on the tablets that are used for visualization, open the corresponding pages:

```
http://localhost:8000/client.html?cameraId=1
http://localhost:8000/client.html?cameraId=2
```

They will show the video stream after a delay of, at most, a few seconds.