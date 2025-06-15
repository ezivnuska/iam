// hooks/useDeviceInfo.ts
import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

type Orientation = 'portrait' | 'landscape'

type DeviceInfo = {
  width: number
  height: number
  isMobile: boolean
  orientation: Orientation
}

export function useDeviceInfo(): DeviceInfo {
	const getInfo = (): DeviceInfo => {
		const { width, height } = Dimensions.get('screen')
		return {
			width,
			height,
			isMobile: width < 768,
			orientation: height >= width ? 'portrait' : 'landscape',
		}
	}

	const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getInfo)

	useEffect(() => {
		const onChange = () => {
			setDeviceInfo(getInfo())
		}

		const subscription = Dimensions.addEventListener('change', onChange)

		return () => {
			subscription.remove()
		}
	}, [])

	return deviceInfo
}