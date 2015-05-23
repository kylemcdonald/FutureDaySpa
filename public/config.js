var config = {
	serials: {
		'0': '501860402', // real
		'1': '000000000' // i don't have a second atm
	},
	screenshotTimeout: (2 * 60 * 1000), // every 2 minutes
	screenshotInitial: (5 * 1000), // 5 seconds after startup
	voicemailTimeout: (1 * 1000), // request connection every 1s
	peerjsApiKey: '8qwdecpywmkuik9'
};

var cameraId = Arg('cameraId') || 0;
var curSerial = config.serials[cameraId];