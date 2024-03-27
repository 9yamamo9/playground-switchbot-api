import { ISwitchbotResource } from './switchbot'
import { Device, DeviceList, DeviceStatus, MotionSensorStatus } from '../type/switchbot'
import * as crypto from 'crypto'
import { v4 as uuid } from 'uuid'
import { IHeaders } from 'typed-rest-client/Interfaces'
import { RestClient } from 'typed-rest-client'
import { BASE_URL } from '../../constants/switchbot'

export default class SwitchBotResource implements ISwitchbotResource {
	private readonly client: RestClient
	private readonly apiVersion: string
	private readonly headers: IHeaders

	constructor(apiVersion: string, token?: string, secret?: string) {
		const validatedToken = token ? token : this.validate(process.env.SWITCHBOT_API_TOKEN)
		const validatedSecret = secret ? secret : this.validate(process.env.SWITCHBOT_SECRET)
		const t = Date.now()
		const nonce = uuid()
		const seed = validatedToken + t + nonce
		const signTerm = crypto.createHmac('sha256', validatedSecret)
			.update(Buffer.from(seed, 'utf-8'))
			.digest()
		const sign = signTerm.toString('base64')

		this.apiVersion = apiVersion

		this.headers = {
			'Authorization': validatedToken,
			'sign': sign,
			'nonce': nonce,
			't': t
		}

		this.client = new RestClient('playground', BASE_URL)
	}

	public getDevices = async (): Promise<Device[]> => {
		const response = await this.client.get<DeviceList>(
			`/${this.apiVersion}/devices`,
			{ additionalHeaders: this.headers }
		)

		const result = response.result

		if (!result) throw Error('Failed to get devices.')

		return result.body.deviceList
	}

	public getDeviceStatus = async (deviceId: string): Promise<MotionSensorStatus> => {
		const response = await this.client.get<DeviceStatus>(
			`/${this.apiVersion}/devices/${deviceId}/status`,
			{ additionalHeaders: this.headers }
		)

		const result = response.result

		if (!result) throw Error('Filed to get device status.')

		return result.body
	}

	private validate = (value: string | undefined): string => {
		if (!value) throw Error('The value is undefined.')

		return value
	}
}