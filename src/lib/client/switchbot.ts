import { v4 as uuid, validate } from 'uuid'
import * as crypto from 'crypto'
import * as rm from 'typed-rest-client'
import { API_VERSION, BASE_URL } from '../../constants/switchbot'
import { IHeaders } from 'typed-rest-client/Interfaces'
import { DeviceList, DeviceStatus } from '../type/switchbot'
import process from 'process'

export class Switchbot {
	private readonly client: rm.RestClient
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
		const sign =signTerm.toString('base64')

		this.apiVersion = apiVersion

		this.headers = {
			'Authorization': validatedToken,
			'sign': sign,
			'nonce': nonce,
			't': t,
		}

		this.client = new rm.RestClient('playground', BASE_URL)
	}

	public getDevices = async () => {
		const response = await this.client.get<DeviceList>(`/${this.apiVersion}/devices`, {
			additionalHeaders: this.headers
		})

		const result = response.result

		return result?.body.deviceList
	}

	public getDeviceStatus = async (deviceId: string) => {
		const response = await this.client.get<DeviceStatus>(`/${API_VERSION}/devices/${deviceId}/status`, {
			additionalHeaders: this.headers
		})

		const result = response.result

		return result?.body
	}

	private validate = (value: string | undefined): string => {
		if (!value) throw Error('The value is undefined.')

		return value
	}

}