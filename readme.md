# Future Day Spa

## Setup and Run

1. Install [Chrome](https://www.google.com/chrome/browser/desktop/index.html)
2. Install [git](http://git-scm.com/download/mac)
3. Install [Node.js](http://nodejs.org/)

```
git clone git@github.com:kylemcdonald/FutureDaySpa.git
cd FutureDaySpa
npm install
node app.js
```

On the main computer (`futuredayspa.local`), open up two Chrome tabs with the following URLs:

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
http://futuredayspa.local:8000/?cameraId=1
http://futuredayspa.local:8000/?cameraId=2
```

If `futuredayspa.local` does not resolve, you may need to assign a static IP to the main computer and use the IP address instead.

The tablets will then show the video stream after a delay of, at most, a few seconds. Swipe up in the middle of the screen to make the address bar disappear.