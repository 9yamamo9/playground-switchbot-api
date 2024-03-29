import { Device, MotionSensorStatus, SetWebhookConfiguration, WebhookConfigurationDetailsBody } from '../type/switchbot'
import { inject, injectable } from 'tsyringe'

export interface ISwitchbotResource {
	getDevices: () => Promise<Device[]>
	getDeviceStatus: (deviceId: string) => Promise<MotionSensorStatus>
	queryWebhookUrls: () => Promise<string[]>
	queryWebhookDetails: (url: string) => Promise<WebhookConfigurationDetailsBody[]>
	setWebhook: (url: string) => Promise<SetWebhookConfiguration>
	unsetWebhook: (url: string) => Promise<SetWebhookConfiguration>
}

@injectable()
export default class Switchbot {
	private readonly resource: ISwitchbotResource

	constructor(
		@inject('ISwitchbotResource') resource: ISwitchbotResource
	) {
		this.resource = resource
	}

	public getDevices = async () => {
		return await this.resource.getDevices()
	}

	public getDeviceStatus = async (deviceId: string) => {
		return await this.resource.getDeviceStatus(deviceId)
	}

	public queryWebhookConfigure = async (url: string) => {
		const urls = await this.resource.queryWebhookUrls()

		if (!urls.includes(url)) throw Error('No exist is a webhook url.')

		return await this.resource.queryWebhookDetails(url)
	}

	public setWebhookConfigure = async (url: string) => {
		return await this.resource.setWebhook(url)
	}

	public unsetWebhookConfigure = async (url: string) => {
		return await this.resource.unsetWebhook(url)
	}
}