import * as crypto from 'crypto'
import * as process from 'process'
import { v4 as uuid } from 'uuid'
import * as rm from 'typed-rest-client'
import { API_VERSION, BASE_URL } from './constants/switchbot'


const token = process.env.SWITCHBOT_API_TOKEN || ''
const secret = process.env.SWITCHBOT_SECRET || ''
const t = Date.now()
const nonce = uuid()
const seed = token + t + nonce
const signTerm = crypto.createHmac('sha256', secret)
	.update(Buffer.from(seed, 'utf-8'))
	.digest()
const sign = signTerm.toString('base64')


async function main() {
	const client = new rm.RestClient('playground', BASE_URL)

	const devicesResponse = await client.get(`/${API_VERSION}/devices`, {
		additionalHeaders: {
			'Authorization': token,
			'sign': sign,
			'nonce': nonce,
			't': t
		}
	})

	const devicesResult: any = devicesResponse.result
	const devices = devicesResult.body

	console.log(devices)

	const deviceId = devices.deviceList[0].deviceId

	const deviceStatusResponse = await client.get(`/${API_VERSION}/devices/${deviceId}/status`, {
		additionalHeaders: {
			'Authorization': token,
			'sign': sign,
			'nonce': nonce,
			't': t
		}
	})

	const deviceStatusResult: any = deviceStatusResponse.result
	const deviceStatus = deviceStatusResult.body

	console.log(deviceStatus)
}

main()