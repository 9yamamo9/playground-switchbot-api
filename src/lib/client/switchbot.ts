import { Device, MotionSensorStatus } from '../type/switchbot'
import { inject, injectable } from 'tsyringe'

export interface ISwitchbotResource {
	getDevices: () => Promise<Device[]>
	getDeviceStatus: (deviceId: string) => Promise<MotionSensorStatus>
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
}