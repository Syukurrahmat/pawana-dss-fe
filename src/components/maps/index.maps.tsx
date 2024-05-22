import { LatLngExpression, latLngBounds } from 'leaflet';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import MySuperCluster from './SuperCluster';
import { Box, BoxProps } from '@chakra-ui/react';
import { ValueMarker, NodesMarker, MarkerRating } from './Marker';
import { useEffect } from 'react';

interface IMyMap extends BoxProps {
	data: LocationData[] | NodeData[] | ReportData[];
	scrollWheelZoom?: boolean;
	marker?: any;
}

export default function MyMap({
	data,
	scrollWheelZoom = true,
	marker = NodesMarker,
	...rest
}: IMyMap) {
	return (
		<Box rounded="md" h="300px" overflow="hidden" shadow="xs" {...rest}>
			<MapContainer
				className="my-map-container"
				style={{
					height: '100%',
					width: '100%',
				}}
				zoom={13}
				center={[-7.519794, 110.082142]}
				scrollWheelZoom={scrollWheelZoom}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<MapFlyDataChange data={data} />
				<MySuperCluster data={data} MarkerType={marker} />
			</MapContainer>
		</Box>
	);
}

export const getBonds = (nodes: LocationData[]) => {
	if (nodes.length === 0) return latLngBounds([0, 0], [0, 0]);

	let x_min = nodes[0].coordinate[0];
	let y_min = nodes[0].coordinate[1];
	let x_max = nodes[0].coordinate[0];
	let y_max = nodes[0].coordinate[1];

	for (let i = 1; i < nodes.length; i++) {
		let x = nodes[i].coordinate[0];
		let y = nodes[i].coordinate[1];
		if (x < x_min) x_min = x;
		if (x > x_max) x_max = x;
		if (y < y_min) y_min = y;
		if (y > y_max) y_max = y;
	}

	return latLngBounds(
		[x_min - 0.003, y_max - 0.003],
		[x_max + 0.003, y_min + 0.003]
	);
};

export function MapFlyDataChange({ data }: { data: any }) {
	const map = useMap();
	useEffect(() => {
		data.length
			? map.flyToBounds(getBonds(data))
			: map.flyTo([-7.519794, 110.082142]);
	}, [data]);

	return null;
}
interface CoordinateGetter {
	onDragend: (x: { lat: number; lng: number }) => any;
	latlng?: LatLngExpression;
}

export function CoordinateGetter({ onDragend, latlng }: CoordinateGetter) {
	const map = useMapEvents({
		dragend: () => {
			const { lat, lng } = map.getCenter();
			onDragend({ lat, lng });
		},
		locationfound: ({ latlng }) => {
			map.flyTo(latlng, map.getZoom());
			onDragend({ lat: latlng.lat, lng: latlng.lng });
		},
	});

	useEffect(() => {
		if (latlng) map.flyTo(latlng, map.getZoom());
	}, []);

	return null;
}
