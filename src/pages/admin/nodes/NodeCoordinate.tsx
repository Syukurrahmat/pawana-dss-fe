import { HStack, Button, Text, Spacer} from '@chakra-ui/react'; //prettier-ignore
import { IconDeviceFloppy, IconEdit, IconMapCancel, IconMapCheck} from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import { API_URL } from '@/constants/config';
import { KeyedMutator } from 'swr';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SectionTitle from '@/components/common/SectionTitle';
import GMapsButton from '@/components/common/GMapsButton';
import MyMap from '@/components/Maps';
import { LatLngExpression } from 'leaflet';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';

interface INodePosisionInMap {
	mutate: KeyedMutator<any>;
	data: NodeDataPage;
}

export default function NodePosisionInMap({
	data,
	mutate,
}: INodePosisionInMap) {
	const [newCoordinate, setNewCoordinate] = useState(data.coordinate);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const { apiResponseToast } = useApiResponseToast();
	const { id: nodeId } = useParams();

	const handleSubmitEditedCoordinate = async () => {
		setIsSubmiting(true);

		const { data: dt } = await axios.put(`${API_URL}/nodes/${nodeId}`, {
			coordinate: newCoordinate,
			nodeId: data.nodeId,
		});
		
		setIsSubmiting(false);

		apiResponseToast(dt, {
			onSuccess() {
				mutate({ ...data, coordinate: newCoordinate });
				setIsEditing(false);
			},
		});
	};

	return (
		<>
			<SectionTitle IconEl={IconMapCheck}>Letak Node</SectionTitle>
			<HStack justify="space-between">
				{!isEditing && (
					<>
						<GMapsButton size='md' coordinate={data.coordinate} />
						<Spacer />

						<Button
							leftIcon={<IconEdit size="20" />}
							colorScheme="yellow"
							children="Ubah posisi"
							onClick={() => setIsEditing((e) => !e)}
							isDisabled={isSubmiting}
						/>
					</>
				)}
				{isEditing && (
					<>
						<Text fontSize="sm">
							Geser peta dan paskan penanda ke titik yang dimaksud
						</Text>
						<Spacer />
						<Button
							colorScheme="red"
							leftIcon={<IconMapCancel size="18" />}
							children="Batal"
							onClick={() => setIsEditing(false)}
							isDisabled={isSubmiting}
						/>
						<Button
							colorScheme="blue"
							leftIcon={<IconDeviceFloppy size="18" />}
							children="Simpan"
							isLoading={isSubmiting}
							onClick={handleSubmitEditedCoordinate}
						/>
					</>
				)}
			</HStack>
			<MyMap
				mt='4'
				data={[data]}
				outline={isEditing ? '3px solid' : ''}
				outlineColor="orange.300"
				isEditing={
					isEditing
						? {
								coordinate: data.coordinate as LatLngExpression,
								onChange: (x) => setNewCoordinate([x.lat, x.lng]),
						  }
						: undefined
				}
			/>
		</>
	);
}
