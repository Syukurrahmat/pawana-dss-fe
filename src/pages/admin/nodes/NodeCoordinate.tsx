import EditInMapInputGroup from '@/components/Form/EditInMapInputGroup';
import MyMap from '@/components/Maps';
import SectionTitle from '@/components/common/SectionTitle';
import { API_URL } from '@/constants/config';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import useUser from '@/hooks/useUser';
import { IconMapCheck } from '@tabler/icons-react'; //prettier-ignore
import axios from 'axios';
import { LatLngExpression } from 'leaflet';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { KeyedMutator } from 'swr';

interface INodePosisionInMap {
	mutate: KeyedMutator<any>;
	data: NodeDataPage;
}

export default function NodePosisionInMap({
	data,
	mutate,
}: INodePosisionInMap) {
	const [editedCoordinate, setEditedCoordinate] = useState(data.coordinate);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const { apiResponseToast } = useApiResponseToast();
	const { id: nodeId } = useParams();
	const { user } = useUser();

	const handleSubmitEditedCoordinate = async () => {
		setIsSubmiting(true);

		const { data: dt } = await axios.put(`${API_URL}/nodes/${nodeId}`, {
			coordinate: editedCoordinate,
			nodeId: data.nodeId,
		});

		setIsSubmiting(false);

		apiResponseToast(dt, {
			onSuccess() {
				mutate({ ...data, coordinate: editedCoordinate });
				setIsEditing(false);
			},
		});
	};

	return (
		<>
			<SectionTitle IconEl={IconMapCheck}>Letak Node</SectionTitle>
			<EditInMapInputGroup
				role={user.role}
				coordinate={data.coordinate}
				isEditingState={[isEditing, setIsEditing]}
				editedCoordinateState={[editedCoordinate, setEditedCoordinate]}
				isSubmiting={isSubmiting}
				handleSubmitEditedCoordinate={handleSubmitEditedCoordinate}
			/>

			<MyMap
				mt="4"
				data={[data]}
				outline={isEditing ? '3px solid' : ''}
				outlineColor="orange.300"
				isEditing={
					isEditing
						? {
								coordinate: data.coordinate as LatLngExpression,
								onChange: (x) => setEditedCoordinate([x.lat, x.lng]),
						  }
						: undefined
				}
			/>
		</>
	);
}
