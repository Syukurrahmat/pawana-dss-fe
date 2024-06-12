import { LatLng, LatLngExpression, LatLngTuple, latLngBounds } from 'leaflet';
import { Circle, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import MySuperCluster from './SuperCluster';
import { Box, BoxProps } from '@chakra-ui/react';
import { NodesMarker } from './Marker';
import { useEffect, useState } from 'react';
import { CENTER_OF_MAP } from '@/constants/config';

interface IMyMap extends BoxProps {
	data: DataWithCoordinate[] | NodeData[] | ReportData[];
	companiesData?: DataWithCoordinate[] | NodeData[] | ReportData[];
	scrollWheelZoom?: boolean;
	marker?: any;
	centerAuto?: boolean;
	isEditing?: {
		coordinate: LatLngExpression | number[];
		onChange: (x: LatLng) => any;
	};
	circleBoundaryRadius?: number;
	mapRef?: any
}

export default function MyMap(props: IMyMap) {
	let { data, scrollWheelZoom = true, centerAuto = true, marker = NodesMarker, mapRef, companiesData, isEditing, circleBoundaryRadius,...rest} = props; //prettier-ignore

	const [showMarkerPicker, setShowMarkerPicker] = useState(false);

	companiesData = companiesData
		? companiesData.map((e) => ({ ...e, isCompanyLocation: true }))
		: [];

	data = isEditing ? [] : [...data, ...companiesData];

	const MapObject = () => {
		const map = useMapEvents({
			dragend: () => {
				if (isEditing) isEditing.onChange(map.getCenter());
			},
			locationfound: ({ latlng }) => {
				if (isEditing) {
					map.flyTo(latlng, map.getZoom());
					isEditing.onChange(latlng);
				}
			},
		});

		if(mapRef) mapRef.current = map

		useEffect(() => {
			console.log(marker.name);

			if (
				['ValueMarker', 'NodesMarkerWithSubs'].includes(marker.name) ||
				isEditing
			) {
				return;
			}

			data.length
				? map.flyToBounds(getBonds(data))
				: map.flyTo(CENTER_OF_MAP);
		}, [data]);

		useEffect(() => {
			if (isEditing) {
				if (!showMarkerPicker) {
					map.flyTo(isEditing.coordinate as LatLngExpression, 16);
					map.once('moveend', () => {
						setShowMarkerPicker(true);
					});
				}
			} else {
				setShowMarkerPicker(false);
			}
		}, [isEditing]);

		return null;
	};

	return (
		<Box
			rounded="md"
			h="350px"
			overflow="hidden"
			shadow="xs"
			position="relative"
			{...rest}
		>
			{isEditing && showMarkerPicker && (
				<Box className="map-marker-centered" />
			)}

			<MapContainer
				className="my-map-container"
				zoom={13}
				center={centerAuto ? CENTER_OF_MAP : undefined}
				bounds={!centerAuto ? getBonds(data) : undefined}
				scrollWheelZoom={scrollWheelZoom}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<MapObject />
				<MySuperCluster data={data} MarkerType={marker} />

				 

				{circleBoundaryRadius &&
					circleBoundaryRadius > 0 &&
					companiesData.length && (
						<Circle
							center={companiesData[0].coordinate as LatLngTuple}
							radius={circleBoundaryRadius}
							pathOptions={{
								fillColor: 'none',
								weight: 2,
								color: 'grey',
							}}
						/>
					)}
			</MapContainer>
		</Box>
	);
}

export const getBonds = (nodes: DataWithCoordinate[]) => {
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
		[x_min - 0.002, y_max - 0.002],
		[x_max + 0.002, y_min + 0.002]
	);
};

interface CoordinateGetter {
	onDragend: (x: { lat: number; lng: number }) => any;
	latlng?: LatLngExpression;
}

export function CoordinateGetter({ onDragend }: CoordinateGetter) {
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

	return null;
}
