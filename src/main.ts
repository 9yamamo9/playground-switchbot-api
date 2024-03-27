import { API_VERSION } from './constants/switchbot'
import { Switchbot } from './lib/client/switchbot'

async function main() {
	const switchbotClient = new Switchbot(API_VERSION)

	const devices = await switchbotClient.getDevices()
	console.log('devices:', devices)

	if (!devices) throw Error('Failed to get devices')

	for (const device of devices) {
		const deviceStatus = await switchbotClient.getDeviceStatus(device.deviceId)
		console.log('deviceStatus:', deviceStatus)
	}
}

main()