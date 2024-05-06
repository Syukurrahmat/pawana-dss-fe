import { IconCircle } from '@tabler/icons-react';
import { LatLngTuple, latLngBounds, marker } from 'leaflet';
import {
	CircleMarker,
	MapContainer,
	Marker,
	TileLayer,
	Tooltip,
	useMapEvents,
} from 'react-leaflet';
import ShowNodes from './showNodes';

interface IMyMap {
	data: locationObj[];
}

export default function MyMap({ data }: IMyMap) {
	return (
		<MapContainer
			bounds={getBonds(data)}
			style={{
				height: '250px',
				flex: '1 0 60%',
			}}
			boundsOptions={{ padding: [10, 10] }}
			zoom={13}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<ShowNodes data={data} />
		</MapContainer>
	);
}

export function getBonds(nodes: locationObj[]) {
	if (nodes.length === 0) return latLngBounds([0, 0], [0, 0]);

	let x_min = parseFloat(nodes[0].latitude);
	let y_min = parseFloat(nodes[0].longitude);
	let x_max = parseFloat(nodes[0].latitude);
	let y_max = parseFloat(nodes[0].longitude);

	for (let i = 1; i < nodes.length; i++) {
		let x = parseFloat(nodes[i].latitude);
		let y = parseFloat(nodes[i].longitude);
		if (x < x_min) x_min = x;
		if (x > x_max) x_max = x;
		if (y < y_min) y_min = y;
		if (y > y_max) y_max = y;
	}

	return latLngBounds([x_min, y_max], [x_max, y_min]);
}

export function CoordinateGetter({ onDragend }: { onDragend: any }) {
	const map = useMapEvents({
		dragend: () => {
			const { lat, lng } = map.getCenter();
			onDragend({ lat, lng });
		},
	});
	return null;
}
