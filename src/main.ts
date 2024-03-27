import 'reflect-metadata'
import { API_VERSION } from './constants/switchbot'
import Switchbot from './lib/client/switchbot'
import { container } from 'tsyringe'
import SwitchBotResource from './lib/client/rest'

async function main() {
	container.register('ISwitchbotResource', {
		useValue: new SwitchBotResource(API_VERSION)
	})

	const switchbot = container.resolve(Switchbot)

	const devices = await switchbot.getDevices()
	console.log('devices:', devices)

	if (!devices) throw Error('Failed to get devices')

	for (const device of devices) {
		const deviceStatus = await switchbot.getDeviceStatus(device.deviceId)
		console.log('deviceStatus:', deviceStatus)
	}
}

main()