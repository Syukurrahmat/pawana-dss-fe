import { buildMapURL, compareObjects, trimAllValues } from '@/utils/index.utils';
import { Box, HStack, Button, Link, Text, useToast} from '@chakra-ui/react'; //prettier-ignore
import { IconBrandGoogleMaps, IconDeviceFloppy, IconEdit} from '@tabler/icons-react'; //prettier-ignore
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { redMarkerIcon, yellowMarkerIcon } from '@/components/maps/customMarker';
import { useState } from 'react';
import { CoordinateGetter } from '@/components/maps/index.maps';
import { API_URL } from '@/constants/config';
import { KeyedMutator } from 'swr';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface INodePosisionInMap {
	mutate: KeyedMutator<any>;
	data: any;
}

export default function NodePosisionInMap({
	data,
	mutate,
}: INodePosisionInMap) {
	const { latitude, longitude } = data;
	const [newLatLong, setNewLatLng] = useState({ latitude, longitude });
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const toast = useToast();
	const {id : nodeId} = useParams()
	
	return (
		<>
			<HStack justify="space-between">
				<Link href={buildMapURL(latitude, longitude)} target={'_blank'}>
					<Button
						leftIcon={<IconBrandGoogleMaps size="20" />}
						colorScheme="blue"
						size="sm"
						variant="outline"
						children="Lihat di Google map"
					/>
				</Link>

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
							trimAllValues(newLatLong);
							const filteredData = compareObjects(
								{ latitude, longitude },
								newLatLong
							);

							if (Object.keys(filteredData).length === 0) {
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
									...filteredData,
									nodeId: data.nodeId,
								})
								.then(({ data }) => {
									setIsSubmiting(false);

									if (!data.success) {
										toast({
											title: `Gagal`,
											description: data.message,
											status: 'error',
										});
									} else {
										toast({
											title: `Sukses`,
											description: data.message,
											status: 'success',
										});
										mutate(null, { revalidate: true });
										setIsEditing(false);
									}
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
					center={[latitude, longitude]}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					{!isEditing ? (
						<Marker
							position={[latitude, longitude]}
							icon={
								data.environment == 'indoor'
									? yellowMarkerIcon
									: redMarkerIcon
							}
						/>
					) : (
						<CoordinateGetter
							onDragend={(x: any) =>
								setNewLatLng({
									latitude: x.lat,
									longitude: x.lng,
								})
							}
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
