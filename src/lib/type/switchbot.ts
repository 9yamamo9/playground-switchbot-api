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

export type WebhookConfigurationDetails = BaseResponse & { body: WebhookConfigurationDetailsBody[] }

export interface WebhookConfigurationDetailsBody {
	url: string
	createTime: number
	lastUpdateTime: number
	deviceList: string
	enable: boolean
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
