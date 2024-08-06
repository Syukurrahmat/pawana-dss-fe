import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';
import { Avatar, Box, Button, Divider, HStack, Heading, Spacer, Tag, TagLabel, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconCheck, IconPhoto, IconX } from '@tabler/icons-react';
import L from 'leaflet';
import { useRef } from 'react';
import { CircleMarker, Marker, MarkerProps, Popup, Tooltip } from 'react-leaflet';  //prettier-ignore
import Supercluster, { ClusterProperties } from 'supercluster';
import { TagCompanyType, TagNodeStatus } from '../Tags/index.tags';
import TagWithIcon from '../common/TagWithIcon';
import { getCompanyMarker, getMarkerEmojiRating, getNodesMarker, getSubscriptionMarkers } from './IconMarker'; //prettier-ignore

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
					<TagNodeStatus value={properties.isUptodate} size="sm" />
					{!!properties.lastDataSent && (
						<HStack spacing="1">
							<Text fontWeight="600">Data diperbarui pada : </Text>
							<Text>{toFormatedDatetime(properties.lastDataSent)}</Text>
						</HStack>
					)}
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
				icon={getSubscriptionMarkers(
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
							<TagNodeStatus value={properties.isUptodate} />
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

export const CompanyMarker = ({ properties, ...rest }: any) => {
	const { name, type, indoorNodeValue, indoorNodes } = properties;

	return (
		<Marker icon={getCompanyMarker(type)} {...rest}>
			<Popup className="map-popup" offset={[0, -16]}>
				<VStack align="start" spacing="1">
					<Text fontSize="sm">Lokasi Usaha</Text>
					<Heading size="sm">{name}</Heading>
					{indoorNodeValue ? (
						<>
							<Divider />
							<VStack>
								{indoorNodeValue.map((e: any, i: number) => (
									<VStack key={i} align="end" spacing="1">
										<HStack>
											<Text
												fontWeight="600"
												fontSize="md"
												children={e.name}
											/>
											<Spacer />
											<Tag children={e.data?.name} />
											<Tag
												colorScheme={e.data?.color || 'gray'}
												children={e.data?.value || '??'}
											/>
										</HStack>
										{!!e.data?.datetime && (
											<Text>
												Diperbarui pada{' '}
												{toFormatedDatetime(e.data?.datetime)}
											</Text>
										)}
									</VStack>
								))}
							</VStack>
						</>
					) : indoorNodes ? (
						<>
							<Divider />

							<VStack>
								{indoorNodes.map((e: any, i: number) => (
									<VStack key={i} spacing="1">
										<HStack>
											<Text
												fontWeight="600"
												fontSize="md"
												children={e.name}
											/>
											<Spacer />
											<TagNodeStatus value={e.isUptodate} size="sm" />
										</HStack>
										<Text>
											Diperbarui pada{' '}
											{toFormatedDatetime(e.lastDataSent)}
										</Text>
									</VStack>
								))}
							</VStack>
						</>
					) : (
						<TagCompanyType value={type} />
					)}
				</VStack>
			</Popup>
		</Marker>
	);
};

function formatNumber(number: any) {
	return typeof number !== 'number'
		? ''
		: number % 1
		? number.toFixed(1)
		: number.toString();
}

export const ValueMarker = ({ properties, ...rest }: Marker<NodeDataValue>) => {
	const { data, name } = properties;

	return (
		<CircleMarker
			center={rest.position}
			pathOptions={{
				color: `var(--chakra-colors-${data?.color || 'gray'}-500)`,
				weight: 2.2,
			}}
			radius={18}
			{...rest}
		>
			<Popup className="map-popup" offset={[0, -16]}>
				<VStack spacing="1" align="end">
					{data ? (
						(() => {
							const { value, datetime, name: dataName, color } = data;

							return (
								<>
									<HStack>
										<Text
											fontWeight="600"
											fontSize="md"
											children={name}
										/>
										<Spacer />
										<Tag children={dataName} />
										<Tag
											colorScheme={color || 'gray'}
											children={value}
										/>
									</HStack>
									<Text>
										Diperbarui pada {toFormatedDatetime(datetime)}
									</Text>
								</>
							);
						})()
					) : (
						<Text>Node tidak uptodate</Text>
					)}
				</VStack>
			</Popup>

			<Tooltip
				className="tooltip-display-value"
				direction="center"
				children={
					<Text stroke="1px red">{formatNumber(data?.value) || '??'}</Text>
				}
				permanent
			/>
		</CircleMarker>
	);
};

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
