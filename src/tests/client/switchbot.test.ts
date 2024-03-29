import 'reflect-metadata'
import Switchbot, { ISwitchbotResource } from '../../lib/client/switchbot'
import {
	Device,
	MotionSensorStatus,
	SetWebhookConfiguration,
	WebhookConfigurationDetailsBody
} from '../../lib/type/switchbot'
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
		if (deviceId !== 'CCE80249C5EF') throw Error('Filed to get device status.')

		return {
			deviceId: 'CCE80249C5EF',
			deviceType: 'Motion Sensor',
			hubDeviceId: '',
			battery: 0,
			version: ''
		}
	}

	public queryWebhookUrls = async (): Promise<string[]> => {
		return [
			'https://dummy.com/webhook'
		]
	}

	public queryWebhookDetails = async (url: string): Promise<WebhookConfigurationDetailsBody[]> => {
		console.log('URL: ', url)

		return [{
			url: 'https://dummy.com/webhook',
			createTime: 123456,
			lastUpdateTime: 234567,
			deviceList: 'ALL',
			enable: true
		}]
	}

	public setWebhook = async (url: string): Promise<SetWebhookConfiguration> => {
		console.log('URL: ', url)

		return {
			statusCode: 100,
			body: {},
			message: ""
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

	test<LocalTestContext>('device is no exist', async ({ switchbot }) => {
		await expect(() => switchbot.getDeviceStatus('dummy')).rejects.toThrowError('Filed to get device status.')
	})
})

describe('queryWebhookConfigure', () => {
	test<LocalTestContext>('success to query webhook configure', async ({ switchbot }) => {
		const actual = await switchbot.queryWebhookConfigure('https://dummy.com/webhook')

		const expected: WebhookConfigurationDetailsBody[] = [{
			url: 'https://dummy.com/webhook',
			createTime: 123456,
			lastUpdateTime: 234567,
			deviceList: 'ALL',
			enable: true
		}]

		expect(actual).toEqual(expected)
	})

	test<LocalTestContext>('no exist is webhook url', async ({ switchbot }) => {
		await expect(() => switchbot.queryWebhookConfigure('https://no.exist.dummy.com/webhook')).rejects.toThrowError('No exist is a webhook url.')
	})
})

describe('setWebhookConfigure', () => {
	test<LocalTestContext>('success to set webhook configure', async({ switchbot }) => {
		const actual = await switchbot.setWebhookConfigure('https://dummy.com/webhook')

		const expected: number = 100

		expect(actual.statusCode).toEqual(expected)
	})
})
