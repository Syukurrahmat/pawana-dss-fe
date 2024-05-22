import { Box, HStack, Button, Text} from '@chakra-ui/react'; //prettier-ignore
import { IconDeviceFloppy, IconEdit, IconMapCheck} from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import { API_URL } from '@/constants/config';
import { KeyedMutator } from 'swr';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SectionTitle from '@/components/common/SectionTitle';
import GMapsButton from '@/components/common/GMapsButton';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { redMarkerIcon, yellowMarkerIcon } from '@/components/maps/marker/iconMarker'; //prettier-ignore
import { CoordinateGetter } from '@/components/maps/index.maps';
import { LatLngTuple } from 'leaflet';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';

interface INodePosisionInMap {
	mutate: KeyedMutator<any>;
	data: NodeDataPage;
}

export default function NodePosisionInMap({
	data,
	mutate,
}: INodePosisionInMap) {
	const latLng = data.coordinate as LatLngTuple;
	const [newLatLong, setNewLatLng] = useState(data.coordinate);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const { apiResponseToast, toast } = useApiResponseToast();
	const { id: nodeId } = useParams();

	return (
		<>
			<SectionTitle IconEl={IconMapCheck}>Letak Node</SectionTitle>
			<HStack justify="space-between">
				<GMapsButton coordinate={data.coordinate} />

				{!isEditing ? (
					<Button
						leftIcon={<IconEdit size="20" />}
						size="sm"
						colorScheme="yellow"
						children="Ubah posisi"
						onClick={() => setIsEditing((e) => !e)}
					/>
				) : (
					<Button
						leftIcon={<IconDeviceFloppy size="20" />}
						colorScheme="blue"
						size="sm"
						children="Simpan posisi"
						isLoading={isSubmiting}
						onClick={() => {
							setIsSubmiting(true);

							if (
								latLng[0] == newLatLong[0] &&
								latLng[1] == newLatLong[1]
							) {
								toast({
									title: `Opss !!!`,
									description: 'Belum ada yang disunting',
									status: 'warning',
								});
								setIsSubmiting(false);
								return;
							}

							axios
								.put(`${API_URL}/nodes/${nodeId}`, {
									coordinate: newLatLong,
									nodeId: data.nodeId,
								})
								.then(({ data }) => {
									setIsSubmiting(false);

									apiResponseToast(data, {
										onSuccess() {
											mutate();
											setIsEditing(false);
										},
									});
								});
						}}
					/>
				)}
			</HStack>
			<Box
				rounded="md"
				overflow="hidden"
				shadow="xs"
				mt="3"
				position="relative"
				outline={isEditing ? '2px solid' : ''}
				outlineColor="yellow.500"
			>
				{isEditing && <Box className="map-marker-centered" />}

				<MapContainer
					style={{ height: '250px' }}
					boundsOptions={{ padding: [10, 10] }}
					zoom={18}
					center={latLng as LatLngTuple}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					{!isEditing ? (
						<Marker
							position={latLng}
							icon={data.ownerId ? yellowMarkerIcon : redMarkerIcon}
						/>
					) : (
						<CoordinateGetter
							latlng={latLng}
							onDragend={(x: any) => setNewLatLng([x.lat, x.lng])}
						/>
					)}
				</MapContainer>
			</Box>
			{isEditing && (
				<Text mt="2" color="yellow.600">
					Geser peta dan paskan penanda ke titik yang dimaksud, Lalu tekan
					tombol Simpan
				</Text>
			)}
		</>
	);
}
