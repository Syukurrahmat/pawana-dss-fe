import EditInMapInputGroup from '@/components/Form/EditInMapInputGroup';
import MyMap from '@/components/Maps';
import SectionTitle from '@/components/common/SectionTitle';
import { API_URL } from '@/constants/config';
import { useMyToasts } from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import { IconMapCheck } from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { KeyedMutator } from 'swr';

interface INodePosisionInMap {
	canEdit: boolean;
	mutate: KeyedMutator<NodeDataPage>;
	data: NodeDataPage;
}

export default function NodePosisionInMap({
	canEdit,
	data,
	mutate,
}: INodePosisionInMap) {
	const [editedCoordinate, setEditedCoordinate] = useState(data.coordinate);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const { id: nodeId } = useParams();
	const toast = useMyToasts();

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
				canEdit={canEdit}
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
