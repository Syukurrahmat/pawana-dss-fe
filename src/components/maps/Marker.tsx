import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';
import { Avatar, Box, Button, Divider, HStack, Heading, IconButton, Tag, TagLabel, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import {
	IconCheck,
	IconExternalLink,
	IconPhoto,
	IconTrash,
	IconX,
} from '@tabler/icons-react';
import L from 'leaflet';
import { useRef } from 'react';
import { CircleMarker, Marker, MarkerProps, Popup, Tooltip } from 'react-leaflet';
import { Link } from 'react-router-dom';
import Supercluster, { ClusterProperties } from 'supercluster';
import { TagNodeStatus, TagNodeType } from '../Tags/index.tags';
import TagWithIcon from '../common/TagWithIcon';
import { getCompanyMarker, getMarkerEmojiRating, getNodesMarker, getSubscriptionMarkers as getSubscriptionMarker } from './IconMarker'; //prettier-ignore

interface Marker<T> extends MarkerProps {
	properties:
		| (T & ClusterProperties)
		| (ClusterProperties & Supercluster.AnyProps);
	position: L.LatLngExpression;
}

export const NodesMarker = ({ properties, ...rest }: Marker<NodeData>) => {
	return (
		<Marker icon={getNodesMarker('s')} {...rest}>
			<Popup className="map-popup" offset={[0, -16]}>
				<VStack align="start">
					<Text fontSize="lg" fontWeight="600" textTransform="capitalize">
						{properties.name}
					</Text>
					{properties.status !== 'active' && (
						<TagNodeStatus value={properties.status} size="sm" />
					)}

					{!!properties.lastDataSent && (
						<HStack spacing="1">
							<Text fontWeight="600">Data diperbarui pada : </Text>
							<Text>{toFormatedDatetime(properties.lastDataSent)}</Text>
						</HStack>
					)}

					<HStack>
						<IconButton
							colorScheme="red"
							size="xs"
							icon={<IconTrash size="14" />}
							aria-label="Hapus Node"
						/>
						<Link to={'/nodes/' + properties.nodeId}>
							<Button
								colorScheme="blue"
								size="xs"
								leftIcon={<IconExternalLink size="14" />}
								aria-label="Lihat Node"
								children="Lihat Node"
							/>
						</Link>
					</HStack>
				</VStack>
			</Popup>
		</Marker>
	);
};

type SelectedNode = { nodeId: number; name: string };

type GenNodesMarkerWithSubs = (
	selectedValue: SelectedNode[],
	onChange: (dt: SelectedNode) => any
) => any;

export const GenerateNodesMarkerWithSubs: GenNodesMarkerWithSubs = (
	selectedValue,
	onChange
) => {
	function NodesMarkerWithSubs({ properties, ...rest }: Marker<NodeData>) {
		const markerReff = useRef<any>();

		const { nodeId } = properties;

		const isChecked = Boolean(selectedValue.find((e) => e.nodeId == nodeId));

		const onClickHandler = () => {
			markerReff.current?.closePopup();

			setTimeout(() => {
				const { name, nodeId } = properties;
				onChange({ name, nodeId });
			}, 300);
		};

		return (
			<Marker
				icon={getSubscriptionMarker(
					properties.isSubscribed
						? 'subscribed'
						: isChecked
						? 'selected'
						: 'unselected'
				)}
				ref={markerReff}
				{...rest}
			>
				<Popup className="map-popup" offset={[0, -16]}>
					<VStack align="start" spacing="1">
						<Heading size="sm" textTransform="capitalize">
							{properties.name}
						</Heading>
						<HStack mb="2">
							<TagNodeStatus value={properties.status} />
							<TagNodeType value={properties.ownerId} />
						</HStack>

						{properties.isSubscribed ? (
							<Tag variant="outline" w="full">
								<TagLabel
									w="full"
									textAlign="center"
									children="Sudah diikuti"
								/>
							</Tag>
						) : isChecked ? (
							<Button
								leftIcon={<IconX size="14" />}
								colorScheme="red"
								size="xs"
								w="full"
								onClick={onClickHandler}
								children="Batal Pilih"
							/>
						) : (
							<Button
								leftIcon={<IconCheck size="14" />}
								colorScheme="blue"
								size="xs"
								w="full"
								onClick={onClickHandler}
								children="Pilih Node"
							/>
						)}
					</VStack>
				</Popup>
			</Marker>
		);
	}

	return NodesMarkerWithSubs;
};

type NodeDataValue = NodeData & {
	data: {
		value: number;
		datetime: string;
		color: string;
	};
};

export const CompanyMarker = ({ properties, ...rest }: Marker<CompanyData>) => (
	<Marker icon={getCompanyMarker(properties.type)} {...rest}>
		<Popup className="map-popup" offset={[0, -16]}>
			<VStack align="start">
				<Text fontSize="sm">Lokasi Usaha</Text>
				<Heading size="sm">{properties.name}</Heading>
			</VStack>
		</Popup>
	</Marker>
);

export const ValueMarker = ({ properties, ...rest }: Marker<NodeDataValue>) => (
	<CircleMarker
		center={rest.position}
		pathOptions={{ color: 'red', weight: 2.2 }}
		radius={18}
		{...rest}
	>
		<Tooltip
			className="tooltip-display-value"
			direction="center"
			children={properties?.data?.value || '??'}
			permanent
		/>
	</CircleMarker>
);

export const MarkerRating = ({ properties, ...rest }: Marker<ReportData>) => (
	<Marker icon={getMarkerEmojiRating(properties.rating)} {...rest}>
		<Popup className="map-popup" offset={[0, -16]}>
			<VStack align="start" maxW="200px">
				<HStack>
					<Avatar
						name={properties.creator.name}
						src={properties.creator.profilePicture}
						boxSize="32px"
						size="sm"
					/>
					<Box>
						<Heading size="md" fontSize="lg">
							{properties.creator.name}
						</Heading>
						<Text>{toFormatedDate(properties.createdAt)}</Text>
					</Box>
				</HStack>
				<Divider borderColor="gray.500" />
				<Text fontSize="md">{properties.message}</Text>
				{!!properties.images && !!properties.images.length && (
					<TagWithIcon
						icon={IconPhoto}
						variant="outline"
						colorScheme="orange"
					>
						{properties.images.length} Gambar dilampirkan{' '}
					</TagWithIcon>
				)}
			</VStack>
		</Popup>
	</Marker>
);
