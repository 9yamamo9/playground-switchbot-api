import 'reflect-metadata'
import Switchbot, { ISwitchbotResource } from '../../lib/client/switchbot'
import { Device, MotionSensorStatus } from '../../lib/type/switchbot'
import { beforeEach, describe, expect, test } from 'vitest'
import { container } from 'tsyringe'

class FakeSwitchbotResource implements ISwitchbotResource {
	public getDevices = async (): Promise<Device[]> => {
		return [{
			deviceId: 'CCE80249C5EF',
			deviceName: 'Golden Village',
			deviceType: 'Motion Sensor',
			enableCloudService: false,
			hubDeviceId: ''
		}]
	}

	public getDeviceStatus = async (deviceId: string): Promise<MotionSensorStatus> => {
		if (deviceId !== 'CCE80249C5EF') throw Error('deviceId is not correct.')

		return {
			deviceId: 'CCE80249C5EF',
			deviceType: 'Motion Sensor',
			hubDeviceId: '',
			battery: 0,
			version: ''
		}
	}
}

interface LocalTestContext {
	switchbot: Switchbot
}

beforeEach<LocalTestContext>(async (context) => {
	container.register('ISwitchbotResource', {
		useClass: FakeSwitchbotResource
	})

	context.switchbot = container.resolve(Switchbot)
})

describe('getDevices', () => {
	test<LocalTestContext>('success to get devices', async ({ switchbot }) => {
		const actual = await switchbot.getDevices()

		const expected: Device[] = [
			{
				deviceId: 'CCE80249C5EF',
				deviceName: 'Golden Village',
				deviceType: 'Motion Sensor',
				enableCloudService: false,
				hubDeviceId: ''
			}
		]

		expect(actual).toEqual(expected)
	})
})

describe('getDeviceStatus', () => {
	test<LocalTestContext>('success to get device status', async ({ switchbot }) => {
		const actual = await switchbot.getDeviceStatus('CCE80249C5EF')

		const expected: MotionSensorStatus = {
			deviceId: 'CCE80249C5EF',
			deviceType: 'Motion Sensor',
			hubDeviceId: '',
			battery: 0,
			version: ''
		}

		expect(actual).toEqual(expected)
	})
})