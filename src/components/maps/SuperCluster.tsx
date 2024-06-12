import { useCallback, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import Supercluster, { ClusterProperties } from 'supercluster';
import useSupercluster from 'use-supercluster';
import { fetchIcon } from './IconMarker';

import './maps.css';
import { CompanyMarker } from './Marker';

interface ISuperCluster {
	data: DataWithCoordinate[];
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

	type useUserClusterPropType = DataWithCoordinate & ClusterProperties;

	const { clusters, supercluster } = useSupercluster<useUserClusterPropType>({
		// @ts-ignore
		points: data.map((point) => ({
			type: 'Feature',
			properties: {
				cluster_id: point.nodeId,
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
			{clusters.map(({ properties, geometry }) => {
				const [longitude, latitude] = geometry.coordinates;
				const {
					cluster: isCluster,
					point_count: pointCount,
					cluster_id: clusterId,
				} = properties;

				if (isCluster) {
					return (
						<Marker
							key={clusterId}
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

				return properties.isCompanyLocation ? (
					<CompanyMarker
						key={'comp-' + properties.companyId}
						position={[latitude, longitude]}
						properties={properties}
					/>
				) : properties.isReport ? (
					<MarkerType
						key={'report-' + properties.reportId}
						position={[latitude, longitude]}
						properties={properties}
					/>
				) : (
					<MarkerType
						key={'node-' + properties.nodeId}
						position={[latitude, longitude]}
						properties={properties}
					/>
				);
			})}
		</>
	);
}
