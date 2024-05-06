import redMarkerIconSvg from '@/assets/mapMarker-red.svg';
import yellowMarkerIconSvg from '@/assets/mapMarker-yellow.svg';
import L, { DivIcon } from 'leaflet';

const icons: { [key: number]: DivIcon } = {};

export const fetchIcon = (count: number, size: number) => {
	if (!icons[count]) {
		icons[count] = L.divIcon({
			html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">${count}</div>`,
			iconAnchor: [size / 2, size / 2],
		});
	}

	return icons[count];
};

export const redMarkerIcon = new L.Icon({
	iconUrl: redMarkerIconSvg,
	className: 'map-marker',
	iconAnchor: [16, 29],
	iconSize: [32, 32],
});

export const yellowMarkerIcon = new L.Icon({
	iconUrl: yellowMarkerIconSvg,
	className: 'map-marker',
	iconAnchor: [16, 29],
	iconSize: [32, 32],
});