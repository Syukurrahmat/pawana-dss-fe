import { IconCircle } from '@tabler/icons-react';
import { LatLngTuple, latLngBounds, marker } from 'leaflet';
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import ShowNodes from './showNodes';


interface IMyMap {
	data: nodeDataMap[];
}

export default function MyMap({ data }: IMyMap) {
	return (
		<MapContainer
			bounds={getBonds(data)}
			style={{
				height: '250px',
				flex: '1 0 60%',
			}}
			boundsOptions={{ padding: [50, 50] }}
			zoom={13}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<ShowNodes data={data}/>
		</MapContainer>
	);
}

export function getBonds(nodes: nodeDataMap[]) {
	if (nodes.length === 0) return latLngBounds([0, 0], [0, 0]);

	let x_min = nodes[0].latitude
	let y_min = nodes[0].longitude;
	let x_max = nodes[0].latitude
	let y_max = nodes[0].longitude;

	for (let i = 1; i < nodes.length; i++) {
		let x = nodes[i].latitude
		let y = nodes[i].longitude;
		if (x < x_min) x_min = x;
		if (x > x_max) x_max = x;
		if (y < y_min) y_min = y;
		if (y > y_max) y_max = y;
	}

	return latLngBounds([x_min, y_max], [x_max, y_min]);
}
