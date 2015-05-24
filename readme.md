# Future Day Spa

## Setup and Run

1. Install [Chrome](https://www.google.com/chrome/browser/desktop/index.html)
2. Install [Homebrew](http://brew.sh/)
3. Install git: `brew install git`
4. Install imagemagick: `brew install imagemagick`
5. Install [Node.js](http://nodejs.org/)

Then open Terminal and enter:

```
git clone git@github.com:kylemcdonald/FutureDaySpa.git
cd FutureDaySpa
npm install
sudo npm install -g forever
forever app.js
```

On the main computer (presumably `futuredayspa.local`), open up two Chrome tabs with the following URLs:

```
http://localhost:8000/server.html?cameraId=1
http://localhost:8000/server.html?cameraId=2
```

The numbers `1` and `2` may be different on a different machine. They could even change if you switch USB ports and restart Chrome. But if you keep things plugged in the same way they should be the same even if you restart Chrome or the computer.

Make sure to click "Allow" for the camera permissions. Alternatively, you can open Chrome by running this command from the Terminal on OSX:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "http://localhost:8000/server.html?cameraId=0" --use-fake-ui-for-media-stream
```

Then on the tablets that are used for visualization, open the corresponding pages:

```
http://futuredayspa.local:8000/?cameraId=1
http://futuredayspa.local:8000/?cameraId=2
```

Where `cameraId` corresponds to which camera the tablet is beneath.

If `futuredayspa.local` does not resolve, you may need to assign a static IP to the main computer and use the IP address instead.

The tablets will then show the video stream after a delay of, at most, a few seconds. Swipe up in the middle of the screen to make the address bar disappear.

As a final step in configuration, you'll need to map the serial numbers of the pulse oximeters to the corresponding `cameraId` they'll be beneath. If you take a reading with the pulse oximeter (can take up to 30 seconds) then go to [this endpoint](http://qualcomm-lucymcrae.herokuapp.com/get/data) the most recent data will have the serial of that device. Modify [public/config.js](https://github.com/kylemcdonald/FutureDaySpa/blob/master/public/config.js#L3-L4) to match the serial to the `cameraId`.

For printing, the parameters are stored in [config.json](https://github.com/kylemcdonald/FutureDaySpa/blob/master/config.json). Setting the DPI only controls the rendering resolution of the page, it is not used in the printer options.

## Tablets

The Xperia tablets have about 3 hours battery life when running the live video.

They should be configured to stay on for 30 minutes intervals:

1. Swipe down at the top right
2. "Shortcut to Settings"
3. "Display" under the "DEVICE" heading
4. "Sleep"
5. Select "30 minutes"
