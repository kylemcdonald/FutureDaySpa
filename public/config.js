var config = {
	serials: {
		'-1': '-1', // debug serial
		'0': '501860403', // on site BACK
		'1': '501860400' // on site FRONT
	},
	remote: 'http://qualcomm-lucymcrae.herokuapp.com',
	peerjsApiKey: '8qwdecpywmkuik9',
	screenshotTimeout: (60 * 1000), // every 60s
	screenshotInitial: (5 * 1000), // 5s after startup
	voicemailTimeout: (4 * 1000), // request connection every 4s

	crosshairs: {
		cycle: { min: 500, max: 4000 },
		range: {
			left: { min: 400, max: 780 },
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
config.screenshot = Arg('screenshot');
if(Arg('render')) {
	config.render = {
		overall: Arg('overall'),
		spo2: Arg('spo2'),
		begin: Arg('begin'),
		end: Arg('end')
	}
}