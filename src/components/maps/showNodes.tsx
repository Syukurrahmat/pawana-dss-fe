import React, { useCallback, useEffect, useState } from 'react';
import L, { DivIcon, PointTuple } from 'leaflet';
import './showNodes.css';
import useSupercluster from 'use-supercluster';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import supercluster, { ClusterProperties, PointFeature } from 'supercluster';
import Supercluster from 'supercluster';
import { Box } from '@chakra-ui/react';
import redMarkerIconSvg from '@/assets/mapMarker-red.svg';
import yellowMarkerIconSvg from '@/assets/mapMarker-yellow.svg';
import { fetchIcon, redMarkerIcon, yellowMarkerIcon } from './customMarker';



export default function ShowNodes({ data }: { data: locationObj[] }) {
	const maxZoom = 22;
	const [bounds, setBounds] = useState<number[]>();
	const [zoom, setZoom] = useState(12);
	const map = useMap();

	const updateMap = () => {
		const b = map.getBounds();
		setBounds([
			b.getSouthWest().lng,
			b.getSouthWest().lat,
			b.getNorthEast().lng,
			b.getNorthEast().lat,
		]);
		setZoom(map.getZoom());
	};

	const onMove = useCallback(() => {
		updateMap();
	}, [map]);

	useEffect(() => {
		updateMap();
	}, [map]);

	useEffect(() => {
		map.on('move', onMove);
		return () => {
			map.off('move', onMove);
		};
	}, [map, onMove]);

	const { clusters, supercluster } = useSupercluster<
		locationObj & ClusterProperties
	>({
		// @ts-ignore
		points: data.map((point) => ({
			type: 'Feature',
			properties: {
				cluster: false,
				...point,
			},
			geometry: {
				type: 'Point',
				coordinates: [
					parseFloat(point.longitude),
					parseFloat(point.latitude),
				],
			},
		})),
		bounds: bounds as any,
		zoom: zoom,
		options: { radius: 100, maxZoom: 17 },
	});

	return (
		<>
			{clusters.map(({ properties, geometry }, i) => {
				const [longitude, latitude] = geometry.coordinates;
				const {
					cluster: isCluster,
					point_count: pointCount,
					cluster_id: clusterId,
				} = properties;

				if (isCluster) {
					return (
						<Marker
							key={i}
							position={[latitude, longitude]}
							icon={fetchIcon(
								pointCount,
								20 + (pointCount / data.length) * 40
							)}
							eventHandlers={{
								click: () => {
									const expansionZoom = Math.min(
										// @ts-ignore
										supercluster.getClusterExpansionZoom(clusterId),
										maxZoom
									);
									map.setView([latitude, longitude], expansionZoom, {
										animate: true,
									});
								},
							}}
						/>
					);
				}

				return (
					<Marker
						key={i}
						position={[latitude, longitude]}
						icon={
							properties.environment == 'indoor'
								? yellowMarkerIcon
								: redMarkerIcon
						}
					>
						<Tooltip>
							ekekeke
							<br />
							eoeoeo
						</Tooltip>
					</Marker>
				);
			})}
		</>
	);
}
