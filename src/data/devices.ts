// Devices data configuration file

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// Device category type; supports brand and custom categories
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Phone: [
		{
			name: "Google Pixel 10 Pro XL",
			image: "/images/device/pixel.png",
			specs: "Obsidian / 16G + 512TB",
			description:
				"Flagship performance, GrapheneOS Security, butter smooth experience.",
			link: "https://store.google.com/de/product/pixel_10_pro",
		},
	],
	Router: [
		{
			name: "Fritzbox 6660",
			image: "/images/device/fritz.png",
			specs: "1000Mbps / 2.5G / Wifi 6",
			description:
				"Stationary WiFi 6 router, good enough for Home Users.",
			link: "https://fritz.com/en/pages/service-fritz-box-6660-cable",
		},
	],
};
