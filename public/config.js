var config = {
	serials: {
		'0': '501860402', // with kyle
		'1': '501860400', // on site
		'2': '501860403' // on site
	},
	remote: 'http://qualcomm-lucymcrae.herokuapp.com',
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
		maxLength: 140,
		cycle: { min: 30, max: 1000 },
	},
	graphBars: {
		duration: { min: 200, max: 800 },
		durationOffset: 400,
		delay: 4000,
		count: 33,
		dataRange: { min: 10, max: 100 },
		colorWidth: 4,
		colors: ['#AD8BB8', '#A7CAE1', '#E398B9', '#B0BBC6']
	}
};
config.cameraId = Arg('cameraId') || 0;
config.curSerial = config.serials[config.cameraId];