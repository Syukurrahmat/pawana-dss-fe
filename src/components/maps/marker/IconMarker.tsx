import redMarkerIconSvg from '@/assets/marker/mapMarker-red.svg';
import yellowMarkerIconSvg from '@/assets/marker/mapMarker-yellow.svg';

import moodEmpty from '@/assets/emoji/mood-empty.svg';
import moodHeart from '@/assets/emoji/mood-heart.svg';
import moodSad from '@/assets/emoji/mood-sad.svg';
import moodSmile from '@/assets/emoji/mood-smile.svg';
import moodWrrr from '@/assets/emoji/mood-wrrr.svg';

import agricultureCompanyMarker from '@/assets/marker/company-marker-agriculture.svg';
import otherCompanyMarker from '@/assets/marker/company-marker-other.svg';
import restaurantCompanyMarker from '@/assets/marker/company-marker-restaurant.svg';
import retailStoreCompanyMarker from '@/assets/marker/company-marker-retailstore.svg';
import serviceCompanyMarker from '@/assets/marker/company-marker-service.svg';
import tofuCompanyMarker from '@/assets/marker/company-marker-tofufactory.svg';

import checkMarkerOrange from '@/assets/marker/check-marker-orange.svg';
import checkMarkerRed from '@/assets/marker/check-marker.svg';

import L, { BaseIconOptions, DivIcon } from 'leaflet';

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

const emojiIconOptions: BaseIconOptions = {
	iconAnchor: [16, 16],
	iconSize: [32, 32],
};

const markerEmojiRating = [
	new L.Icon({
		iconUrl: moodWrrr,
		className: 'map-marker mood mood-wrrr',
		...emojiIconOptions,
	}),

	new L.Icon({
		iconUrl: moodSad,
		className: 'map-marker mood mood-sad',
		...emojiIconOptions,
	}),
	new L.Icon({
		iconUrl: moodEmpty,
		className: 'map-marker mood mood-empty',
		...emojiIconOptions,
	}),

	new L.Icon({
		iconUrl: moodSmile,
		className: 'map-marker mood mood-smile',
		...emojiIconOptions,
	}),
	new L.Icon({
		iconUrl: moodHeart,
		className: 'map-marker mood mood-heart',
		...emojiIconOptions,
	}),
];

export const getMarkerEmojiRating = (rating: number) =>
	markerEmojiRating[rating - 1] || markerEmojiRating[0];

const markerIconOptions: BaseIconOptions = {
	iconAnchor: [16, 29],
	iconSize: [32, 32],
	className: 'map-marker',
};

const nodesMarkers: { [key: string]: any } = {
	indoor: new L.Icon({
		iconUrl: yellowMarkerIconSvg,
		...markerIconOptions,
	}),
	outdoor: new L.Icon({
		iconUrl: redMarkerIconSvg,
		...markerIconOptions,
	}),
};

export const getNodesMarker = (type: string) =>
	nodesMarkers[type] || nodesMarkers.outdoor;

const companyMarkers: { [key: string]: any } = {
	tofufactory: new L.Icon({
		iconUrl: tofuCompanyMarker,
		...markerIconOptions,
	}),

	service: new L.Icon({
		iconUrl: serviceCompanyMarker,
		...markerIconOptions,
	}),

	agriculture: new L.Icon({
		iconUrl: agricultureCompanyMarker,
		...markerIconOptions,
	}),

	retailstore: new L.Icon({
		iconUrl: retailStoreCompanyMarker,
		...markerIconOptions,
	}),

	restaurant: new L.Icon({
		iconUrl: restaurantCompanyMarker,
		...markerIconOptions,
	}),

	other: new L.Icon({
		iconUrl: otherCompanyMarker,
		...markerIconOptions,
	}),
};

export const getCompanyMarker = (type: string) =>
	companyMarkers[type] || companyMarkers.tofufactory;

// 32.62500
const subscriptionMarkers: { [key: string]: any } = {
	subscribed: new L.Icon({
		iconUrl: checkMarkerRed,
		...markerIconOptions,
	}),
	selected: new L.Icon({
		iconUrl: checkMarkerOrange,
		iconAnchor: [19, 34.4375],
		iconSize: [38, 38],
	}),

	unselected: nodesMarkers.outdoor,
};

export const getSubscriptionMarkers = (
	s: 'subscribed' | 'selected' | 'unselected' = 'unselected'
) => subscriptionMarkers[s] || subscriptionMarkers.unselected;
