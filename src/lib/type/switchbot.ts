export type DeviceList = BaseResponse & {
	body: {
		deviceList: Device[]
		infraredRemoteList: InfraredRemote[]
	}
}
export type DeviceStatus = BaseResponse & { body: MotionSensorStatus }

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

type Device = BaseDevice

interface InfraredRemote {
	deviceId: string
	deviceName: string
	remoteType: string
	hubDeviceId: string
}

interface MotionSensorStatus {
	deviceId: string
	deviceType: string
	battery: number
	version: string
	hubDeviceId: string
}