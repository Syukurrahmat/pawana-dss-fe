import homeMarkerIconSvg from '@/assets/home-marker.svg';
import redMarkerIconSvg from '@/assets/mapMarker-red.svg';
import yellowMarkerIconSvg from '@/assets/mapMarker-yellow.svg';
import moodEmpty from '@/assets/mood-empty.svg';
import moodHeart from '@/assets/mood-heart.svg';
import moodSad from '@/assets/mood-sad.svg';
import moodSmile from '@/assets/mood-smile.svg';
import moodWrrr from '@/assets/mood-wrrr.svg';
import L, { DivIcon } from 'leaflet';

// ICON
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

export const markerEmojiRating = [
	new L.Icon({
		iconUrl: moodWrrr,
		className: 'map-marker mood mood-wrrr',
		iconAnchor: [16, 29],
		iconSize: [32, 32],
	}),

	new L.Icon({
		iconUrl: moodSad,
		className: 'map-marker mood mood-sad',
		iconAnchor: [16, 29],
		iconSize: [32, 32],
	}),
	new L.Icon({
		iconUrl: moodEmpty,
		className: 'map-marker mood mood-empty',
		iconAnchor: [16, 29],
		iconSize: [32, 32],
	}),

	new L.Icon({
		iconUrl: moodSmile,
		className: 'map-marker mood mood-smile',
		iconAnchor: [16, 29],
		iconSize: [32, 32],
	}),
	new L.Icon({
		iconUrl: moodHeart,
		className: 'map-marker mood mood-heart',
		iconAnchor: [16, 29],
		iconSize: [32, 32],
	}),
];

export const redMarkerIcon = new L.Icon({
	iconUrl: redMarkerIconSvg,
	className: 'map-marker',
	iconAnchor: [16, 29],
	iconSize: [32, 32],
});

export const homeMarkerIcon = new L.Icon({
	iconUrl: homeMarkerIconSvg,
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
