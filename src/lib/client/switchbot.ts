import { Device, MotionSensorStatus } from '../type/switchbot'
import { inject, injectable } from 'tsyringe'

export interface ISwitchbotResource {
	getDevices: () => Promise<Device[]>
	getDeviceStatus: (deviceId: string) => Promise<MotionSensorStatus>
}

@injectable()
export default class Switchbot {
	private readonly client: ISwitchbotResource

	constructor(
		@inject('ISwitchbotResource') client: ISwitchbotResource
	) {
		this.client = client
	}

	public getDevices = async () => {
		return await this.client.getDevices()
	}

	public getDeviceStatus = async (deviceId: string) => {
		return await this.client.getDeviceStatus(deviceId)
	}
}