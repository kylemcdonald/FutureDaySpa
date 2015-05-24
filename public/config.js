var config = {
	serials: {
		'0': '501860402',
		'1': '000000000'
	},
	peerjsApiKey: '8qwdecpywmkuik9',
	screenshotTimeout: (2 * 60 * 1000), // every 2 minutes
	screenshotInitial: (5 * 1000), // 5 seconds after startup
	voicemailTimeout: (1 * 1000), // request connection every 1s

	crosshairs: {
		cycle: { min: 500, max: 4000 },
		range: {
			left: { min: 430, max: 820 },
			top: { min: 200, max: 430 }
		}
	},
	debugTitle: {
		cycle: { min: 500, max: 4000 },
	},
	debugBody: {
		maxLength: 160,
		cycle: { min: 30, max: 1000 },
	}
};
config.cameraId = Arg('cameraId') || 0;
config.curSerial = config.serials[config.cameraId];