export type DeviceList = BaseResponse & {
	body: {
		deviceList: Device[]
		infraredRemoteList: InfraredRemote[]
	}
}

export type Device = BaseDevice

export type DeviceStatus = BaseResponse & { body: MotionSensorStatus }

export interface MotionSensorStatus {
	deviceId: string
	deviceType: string
	battery: number
	version: string
	hubDeviceId: string
}

export type WebhookConfiguration = BaseResponse & { body: WebhookConfigurationBody}
export interface WebhookConfigurationBody {
	urls: string[]
}

interface BaseResponse {
	statusCode: number
	message: string
}

interface BaseDevice {
	deviceId: string
	deviceName: string
	deviceType: string
	enableCloudService: boolean
	hubDeviceId: string
}

interface InfraredRemote {
	deviceId: string
	deviceName: string
	remoteType: string
	hubDeviceId: string
}
