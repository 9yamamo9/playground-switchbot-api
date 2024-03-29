import 'reflect-metadata'
import Switchbot, { ISwitchbotResource } from '../../lib/client/switchbot'
import { Device, MotionSensorStatus, WebhookConfiguration, WebhookConfigurationBody } from '../../lib/type/switchbot'
import { beforeEach, describe, expect, test } from 'vitest'
import { container } from 'tsyringe'
import { an, ay } from 'vitest/dist/reporters-P7C2ytIv'

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
		if (deviceId !== 'CCE80249C5EF') throw Error('Filed to get device status.')

		return {
			deviceId: 'CCE80249C5EF',
			deviceType: 'Motion Sensor',
			hubDeviceId: '',
			battery: 0,
			version: ''
		}
	}

	public queryWebhookConfigure = async (): Promise<string[]> => {
		return [
			'https://dummy.com/webhook'
		]
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

	test<LocalTestContext>('device is no exist', async ({ switchbot }) => {
		await expect(() => switchbot.getDeviceStatus('dummy')).rejects.toThrowError('Filed to get device status.')
	})
})

describe('queryWebhook', () => {
	test<LocalTestContext>('success to query webhook configure', async ({ switchbot }) => {
		const actual = await switchbot.queryWebhookConfigure()

		const expected: string[] = ['https://dummy.com/webhook']

		expect(actual).toEqual(expected)
	})
})