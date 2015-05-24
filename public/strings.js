var strings = {
	fluids: [
		'bile',
		'blood',
		'cerebrospinal',
		'gastric',
		'lymph',
		'mucus',
		'pericardial',
		'pleural',
		'saliva',
		'synovial',
		'sweat'
	],
	bodyParts: [
		'ankle',
		'arm',
		'back',
		'belly',
		'bottom',
		'calf',
		'cheek',
		'chin',
		'ear',
		'elbow',
		'eye',
		'eyebrow',
		'eyelash',
		'finger',
		'fist',
		'foot',
		'forearm',
		'forehead',
		'hair',
		'hand',
		'head',
		'hip',
		'knee',
		'leg',
		'lip',
		'mouth',
		'neck',
		'nose',
		'nostril',
		'shoulder',
		'thigh',
		'thumb',
		'toe',
		'tongue',
		'tooth',
		'waist',
		'wrist'
	],
	raw: [
		'0',
		'00',
		'02',
		'05',
		'1',
		'10',
		'10789',
		'10790',
		'10792',
		'1C',
		'2',
		'2015',
		'240',
		'3',
		'31',
		'3230',
		'32416',
		'4',
		'40',
		'5',
		'61',
		'81',
		'9',
		'96',
		'98',
		'BTLE',
		'E8',
		'FF',
		'GMT',
		'Inc',
		'Life',
		'Nonin',
		'OXIMETER',
		'Oximetry',
		'PROPRIETARY',
		'PulseOximeter',
		'QUALC002',
		'Qualcomm',
		'VM3',
		'airInterfaceType',
		'batteryLevel',
		'bpm',
		'cdeVersion',
		'correctCheck',
		'counter',
		'custom',
		'customerId',
		'customerName',
		'dV',
		'decoderModel',
		'decoderVersion',
		'deviceAddress',
		'deviceData',
		'deviceDetails',
		'deviceModel',
		'deviceSerialNumber',
		'deviceType',
		'displaySyncMode',
		'exporterVersion',
		'false',
		'firmware',
		'firmwareRevision',
		'hubId',
		'hubReceiveTime',
		'hubReceiveTimeOffset',
		'id',
		'length',
		'lowBatteryCondition',
		'lowSignal',
		'number',
		'oAoKFR8CUQAoYgA9',
		'offset',
		'oximetry',
		'packetType',
		'packets',
		'protocol',
		'pulseAmplitudeIndex',
		'pulseRate',
		'qclBtlePacketHeaders',
		'qclJsonVersion',
		'r1',
		'r2',
		'records',
		'revision',
		's',
		'searching',
		'serial',
		'serialNumber',
		'smartPointAlgorithm',
		'software',
		'softwareVersion',
		'spO2',
		'spReceiveTime',
		'standard',
		'timeZone',
		'true',
		'twonetId',
		'twonetProperties',
		'unit',
		'uuid',
		'uuidDescription',
		'uuidType',
		'value',
		'version'
	],
	words: [
		'2net',
		'Analysis',
		'Analyze',
		'Body',
		'Compute',
		'Communication',
		'Comm',
		'Data',
		'Device',
		'Digital',
		'Downgrade',
		'Health',
		'Height',
		'Index',
		'Life',
		'Mass',
		'Oxi',
		'Oximeter',
		'Process',
		'Pulse',
		'Qual',
		'Quality',
		'Rate',
		'Segment',
		'Upgrade',
		'Vacuum',
		'Weight'
	]
};

function generateLiteral() {
	return _.sample(strings.words, _.random(2, 3)).join('_');
}

function generatePhrase() {

}