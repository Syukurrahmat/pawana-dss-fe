import { homeMarkerIcon, redMarkerIcon, markerEmojiRating } from './marker/iconMarker'; //prettier-ignore
import { Button, HStack, Heading, IconButton, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconTrash } from '@tabler/icons-react';
import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { Marker, MarkerProps } from 'react-leaflet';
import Supercluster, { ClusterProperties } from 'supercluster';
import NameWithAvatar from '../common/NamewithAvatar';
import { TagNodeStatus, TagNodeType } from '../tags/index.tags';
import { toFormatedDatetime } from '@/utils/dateFormating';

interface IMarker<T> extends MarkerProps {
	properties:
		| (T & ClusterProperties)
		| (ClusterProperties & Supercluster.AnyProps);
	position: L.LatLngExpression;
}

export const NodesMarker = ({ properties, ...rest }: IMarker<NodeData>) => {
	if (properties.isCompanyLocation) {
		return (
			<Marker icon={homeMarkerIcon} {...rest}>
				<Popup className="map-popup" offset={[0, -16]}>
					<VStack align="start">
						<Text fontSize="sm">Lokasi Aktivitas</Text>
						<Heading size="sm">{properties.name}</Heading>
					</VStack>
				</Popup>
			</Marker>
		);
	}

	return (
		<Marker icon={redMarkerIcon} {...rest}>
			<Popup className="map-popup" offset={[0, -16]}>
				<VStack align="start">
					<Heading size="sm" textTransform='capitalize'>{properties.name}</Heading>

					<HStack>
						<TagNodeStatus status={properties.status} />
						<TagNodeType isPrivate={Boolean(properties.ownerId)} />
					</HStack>

					{!!properties.lastDataSent && (
						<Text>
							Terakhir data diperbarui pada :{' '}
							{toFormatedDatetime(properties.lastDataSent)}
						</Text>
					)}

					<HStack>
						<HStack>
							<IconButton
								colorScheme="red"
								size="xs"
								icon={<IconTrash size="16" />}
								aria-label="Hapus Node"
							/>
							<Link to={'/nodes/' + properties.nodeId}>
								<Button
									colorScheme="blue"
									size="xs"
									leftIcon={<IconExternalLink size="16" />}
									aria-label="Lihat Node"
								>
									Lihat Node
								</Button>
							</Link>
						</HStack>
					</HStack>
				</VStack>
			</Popup>
		</Marker>
	);
};


type NodeDataWithValue = NodeData & {
	data : {
		value :  number,
		datetime : string,
		color : string
	}
}

export const ValueMarker = ({ properties, ...rest }: IMarker<NodeDataWithValue>) => {
	return (
		<CircleMarker
			center={rest.position}
			pathOptions={{ color: 'red', weight: 2.2 }}
			radius={18}
			{...rest}
		>
			<Tooltip
				className="tooltip-display-value"
				direction="center"
				children={properties?.data?.value?.toFixed(2)}
				permanent
			/>
		</CircleMarker>
	);
};

export const MarkerRating = ({ properties, ...rest }: IMarker<ReportData>) => (
	<Marker icon={markerEmojiRating[properties.rating - 1]} {...rest}>
		<Popup className="map-popup" offset={[0, -16]}>
			<VStack align="start" maxW="200px">
				<NameWithAvatar
					size="xs"
					spacing="2"
					name={properties.creator.name}
				/>
				<Text>{properties.message}</Text>
			</VStack>
		</Popup>
	</Marker>
);
