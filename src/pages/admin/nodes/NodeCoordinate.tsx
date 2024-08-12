import EditInMapInputGroup from '@/components/Form/EditInMapInputGroup';
import MyMap from '@/components/Maps';
import SectionTitle from '@/components/common/SectionTitle';
import { API_URL } from '@/constants/config';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import useUser from '@/hooks/useUser';
import { usemyToasts } from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import { IconMapCheck } from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { KeyedMutator } from 'swr';

interface INodePosisionInMap {
	mutate: KeyedMutator<NodeDataPage>;
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
	const toast = usemyToasts();

	const onSubmitEditedCoordinate = async () => {
		setIsSubmiting(true);
		const nodeUpdateURL = `${API_URL}/nodes/${nodeId}`;

		myAxios
			.patch(nodeUpdateURL, { coordinate: editedCoordinate })
			.then(() => {
				toast.success('Lokasi Perusahaan berhasil diperbarui');
				mutate({ ...data, coordinate: editedCoordinate });
			})
			.catch(() => {
				toast.error('Lokasi Perusahaan gagal diperbarui');
			})
			.finally(() => {
				setIsEditing(false);
				setIsSubmiting(false);
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
				handleSubmitEditedCoordinate={onSubmitEditedCoordinate}
			/>

			<MyMap
				mt="4"
				data={[data]}
				outline={isEditing ? '3px solid' : ''}
				outlineColor="orange.300"
				isEditing={
					!isEditing
						? undefined
						: {
								coordinate: editedCoordinate || data.coordinate,
								onChange: (x) => setEditedCoordinate([x.lat, x.lng]),
						  }
				}
			/>
		</>
	);
}
