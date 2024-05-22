import { fetchIcon } from './marker/iconMarker';
import { useCallback, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import Supercluster, { ClusterProperties } from 'supercluster';
import useSupercluster from 'use-supercluster';
import './maps.css';

interface ISuperCluster {
	data: LocationData[];
	MarkerType: any;
}

export type SCProperties<T> =
	| (T & ClusterProperties)
	| (ClusterProperties & Supercluster.AnyProps);

export default function MySuperCluster({ data, MarkerType }: ISuperCluster) {
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
		LocationData & ClusterProperties
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
				coordinates: [point.coordinate[1], point.coordinate[0]],
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
					<MarkerType
						key={i}
						position={[latitude, longitude]}
						properties={properties}
					/>
				);
			})}
		</>
	);
}
